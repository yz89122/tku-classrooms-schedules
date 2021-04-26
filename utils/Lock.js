export default class Lock {
  #promise = Promise.resolve();
  #resolve;

  /**
   * @return {Promise<void>}
   */
  async acquire() {
    const promise = this.#promise;
    let _resolve;
    this.#promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    await promise;
    this.#resolve = _resolve;
  }

  /**
   * @return {Promise<void>}
   */
  async release() {
    await this.#resolve();
  }

  /**
   * @template T
   * @param {() => Promise<T>} callback
   * @return {Promise<T>}
   */
  async execute(callback) {
    try {
      await this.acquire();
      return await callback();
    } finally {
      await this.release();
    }
  }
}
