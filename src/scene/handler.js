import { IMT } from '../const/message.js';
import { getNextXYZ, isOverlap } from '../coords/index.js';
import global from '../global.js';
import { ShardForge } from '../shard/forge.js';

/**
 * @param {Object} p
 * @param {import('../user/index.js').User} p.user
 * @param {string} p.type
 * @param {*} p.data
 * @returns
 */
export const onSceneEvent = ({ user, type, data }) => {
  switch(type) {
    case IMT.SCENE_LOAD:
    {
      // If a shard key is provided, it retrieves the shard's content
      // if not, it creates a shard based on the scene.
      const shard = data.shard ? ShardForge.seek(data.shard) : undefined;
      user.shard = shard ?? ShardForge.shatter(global.scene.find(data.scene));
      return {
        type: IMT.SCENE_LOAD,
        data: { objects: [...user.shard.objects] },
      };
    }
    case IMT.SCENE_LOADED:
    {
      const scene = global.scene.find(data.scene);
      return scene.onLoaded(user);
    }
    case IMT.OBJECT_MOVE:
    {
      const shard = user.shard;
      const objects = shard.objects;
      const target = shard.objects.find((o) => o.serial === data.serial);
      if (!target) {
        throw new Error(`Fail to move. No target (${data.target}).`);
      }
      if (target.x === data.x && target.y === data.y) {
        return null;
      }
      const next = getNextXYZ({ target, objects, destination: data });
      return shard.message.object.move(data.serial, {
        ...next,
        direction: data.direction,
      });
    }
    case IMT.OBJECT_INTERACT:
    {
      const objects = user.shard.objects;
      const target = objects.find((o) => o.serial === data.target);
      if (!target) {
        return;
      }

      const interactionArea = (() => {
        const hitbox = target.hitbox ?? { ...target, w: 0, h: 0 };
        const {
          x, y, w, h,
        } = hitbox;
        switch (target.direction) {
          case 'up':
            return {
              x, y: y - 5, w, h: h + 5,
            };
          case 'down':
            return {
              x, y, w, h: h + 5,
            };
          case 'left':
            return {
              x: x - 5, y, w: w + 5, h,
            };
          case 'right':
            return {
              x, y, w: w + 5, h,
            };
          default:
            throw new Error('Invalid direction.');
        }
      })();

      const willInteract = objects.find(
        (object) => {
          return object !== target && object.hitbox && isOverlap(object.hitbox, interactionArea);
        }
      );
      if (!willInteract) {
        return;
      }
      willInteract.dispatchEvent(new CustomEvent('interact'));
      return null;
    }
  }
};
