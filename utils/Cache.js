import Lock from './Lock.js';

class Entry {
  #lock = new Lock();
  #data = null;
  #expiresAt = -1;

  get #now() {
    return Date.now();
  }

  get expired() {
    return this.#expiresAt && this.#now > this.#expiresAt;
  }

  get data() {
    return this.#data;
  }

  get() {
    if (!this.expired) {
      return this.data;
    }
  }

  /**
   * @param {() => Promise<*>} orElse
   * @param {number} expiration
   */
  async getOrElse(orElse, expiration = null) {
    if (!this.expired) {
      return this.data;
    }
    return await this.#lock.execute(async () => {
      if (!this.expired) {
        return this.data;
      }
      const data = await orElse();
      this.set(data, expiration);
      return data;
    });
  }

  set(data, expiration = null) {
    this.#data = data;
    this.#expiresAt = expiration ? this.#now + expiration : null;
  }
}

export default class Cache {
  static DEFAULT_EXPIRATION = 60 * 1000;

  /** @type {Map<string, Entry} */
  #map = new Map();
  #defaultExpiration = Cache.DEFAULT_EXPIRATION;
  #nextPruneAt = 0;

  get #now() {
    return Date.now();
  }

  constructor({ defaultExpiration = Cache.DEFAULT_EXPIRATION } = {}) {
    this.#defaultExpiration = defaultExpiration;
    this.#nextPruneAt = this.#now + this.#defaultExpiration;
  }

  /** @param {string} key */
  get(key) {
    const entry = this.#map.get(key);
    if (entry) {
      return entry.data;
    }
  }

  /**
   * @param {string} key
   * @return {Entry}
   */
  #getOrCreateEntry(key) {
    let entry = this.#map.get(key);
    if (entry) {
      return entry;
    }

    entry = new Entry();
    this.#map.set(key, entry);
    return entry;
  }

  set(key, data, expiration) {
    if (expiration === undefined) {
      expiration = this.#defaultExpiration;
    }

    this.#tryPrune();

    const entry = this.#getOrCreateEntry(key);

    entry.set(data, expiration);
  }

  /**
   * @param {string} key
   * @param {() => Promise<*>} callback
   * @param {number} expiration
   */
  async getOrElse(key, callback, expiration) {
    if (expiration === undefined) {
      expiration = this.#defaultExpiration;
    }

    this.#tryPrune();

    const entry = this.#getOrCreateEntry(key);

    return await entry.getOrElse(callback, expiration);
  }

  prune() {
    for (const [key, entry] of this.#map) {
      if (entry.expired) {
        this.#map.delete(key);
      }
    }
    this.#nextPruneAt = this.#now + this.#defaultExpiration;
  }

  #tryPrune() {
    if (this.#now < this.#nextPruneAt) {
      return;
    }
    this.prune();
  }
}
