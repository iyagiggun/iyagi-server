import { IMT } from '../const/message.js';

/**
 * @typedef {{
 *  type: string,
 *  data: any,
 * }} Message
 */

/**
 * @typedef {{
 *  user: import('../user/index.js').User;
 *  shard: import('../shard/index.js').Shard;
 *  message: Message;
 *  listen: (message: Message) => void;
 * }} SubjectData
 */

/**
 * @typedef {(data: SubjectData) => import('rxjs').Observable<Message>} Process
 */


/**
 * @typedef {{
 *  tell: (message: Message) => void,
 * }} TellerParams
 */

export class Teller {
  /**
   * @param {SubjectData} data
   */
  ask(data) {
    switch(data.message.type) {
      case IMT.SHARD_LOAD:
        data.shard.load$.next(data);
        return;
      case IMT.SHARD_LOADED:
        data.shard.loaded$.next(data);
        return;
    }
  }
}
