export default class Lock {
  #promise = Promise.resolve();
  #resolve;

  async acquire() {
    const promise = this.#promise;
    let _resolve;
    this.#promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    await promise;
    this.#resolve = _resolve;
  }

  async release() {
    await this.#resolve();
  }

  /**
   * @param {() => Promise<*>} callback
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
