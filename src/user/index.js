import { message } from '../message/index.js';

export class User {
  /**
   * @type {import('../shard/index.js').Shard | null}
   */
  #shard = null;

  #message;

  /**
   * @param {string} key
   */
  constructor(key) {
    this.key = key;
    this.#message = message;
  }

  get shard() {
    if (!this.#shard) {
      throw new Error('User does not have a shard.');
    }
    return this.#shard;
  }
  /**
   * @param {import('../shard/index.js').Shard} _shard
   */
  set shard(_shard) {
    this.#shard = _shard;
  }

  get message() {
    return this.#message;
  }
}

/**
 * @typedef {User} UserType
 */
