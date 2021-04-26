import Lock from '../utils/Lock.js';

/**
 * @template T
 */
class Binding {
  #shared = false;
  #lock = new Lock();
  /** @type {(container: ServiceContainer) => Promise<T>} */
  #concrete = undefined;
  #resolved = false;
  #instance = undefined;
  #hasInstance = false;

  /**
   * @param {{ concrete: (container: ServiceContainer) => {}, instance: T, shared: boolean }} options
   */
  constructor(options) {
    if (options.hasOwnProperty('instance')) {
      if (!options.concrete) {
        throw new Error('concrete and instance cannot be both null');
      }
      this.#hasInstance = true;
      this.#instance = options.instance;
    }
    this.#concrete = options.concrete;
    this.#shared = options.shared;
  }

  /**
   * @param {ServiceContainer} container
   * @param {[*]} parameters
   * @return {Promise<T>}
   */
  async resolve(container, parameters = []) {
    if (parameters.length) {
      return this.#instantiate(container, parameters);
    }

    if (this.#hasInstance) {
      return this.#instance;
    }

    if (!this.#shared) {
      return await this.#instantiate(container);
    }

    return await this.#lock.execute(async () => {
      if (!this.#hasInstance) {
        this.#instance = await this.#instantiate(container);
        this.#hasInstance = true;
      }
      return this.#instance;
    });
  }

  async #instantiate(container, parameters = []) {
    let instance;
    if (parameters.length) {
      instance = await this.#concrete(container, ...parameters);
    } else {
      instance = await this.#concrete(container);
    }
    this.#resolved = true;
    return instance;
  }

  get resolved() {
    return this.#resolved;
  }

  get shared() {
    return this.#shared;
  }
}

export default class ServiceContainer {
  /** @type {ServiceContainer} */
  #parent;
  /** @type {WeakMap<Object, Binding>} */
  #weakMapBindings = new WeakMap();
  /** @type {Map<string, Binding>} */
  #primitiveBindings = new Map();
  /** @type {WeakMap<Object, Object>} */
  #weakMapAliases = new WeakMap();
  /** @type {Map<string, Object>} */
  #primitiveAliases = new Map();

  /** @param {{ parent: ServiceContainer }} */
  constructor({ parent } = {}) {
    this.#parent = parent;
    this.singleton(ServiceContainer, () => this);
  }

  static #isPrimitive(abstract) {
    const type = typeof abstract;
    return type != 'object' && type != 'function';
  }

  /**
   * @template T
   * @param {new() => T} abstract
   */
  #getAliasMap(abstract) {
    return ServiceContainer.#isPrimitive(abstract)
      ? this.#primitiveAliases
      : this.#weakMapAliases;
  }

  /**
   * @template T
   * @param {new() => T} abstract
   */
  #getBindingMap(abstract) {
    return ServiceContainer.#isPrimitive(abstract)
      ? this.#primitiveBindings
      : this.#weakMapBindings;
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @return {Binding<T>?}
   */
  #getBinding(abstract) {
    const aliasMap = this.#getAliasMap(abstract);
    if (aliasMap.has(abstract)) {
      return this.#getBinding(aliasMap.get(abstract));
    }
    const bindingMap = this.#getBindingMap(abstract);
    if (bindingMap.has(abstract)) {
      return bindingMap.get(abstract);
    }
    if (this.#parent) {
      return this.#parent.#getBinding(abstract);
    }
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @return {boolean}
   */
  isAlias(abstract) {
    if (this.#getAliasMap(abstract).has(abstract)) {
      return true;
    }
    if (this.#getBindingMap(abstract).has(abstract)) {
      return false;
    }
    if (this.#parent) {
      return this.#parent.isAlias(abstract);
    }
    return false;
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {*} alias
   */
  alias(abstract, alias) {
    this.#getAliasMap(alias).set(alias, abstract);
    this.#getBindingMap(alias).delete(alias);
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @return {boolean}
   */
  bound(abstract) {
    if (
      this.#getBindingMap(abstract).has(abstract) ||
      this.#getAliasMap(abstract).has(abstract)
    ) {
      return true;
    }
    if (this.#parent) {
      return this.#parent.bound(abstract);
    }
    return false;
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {(container: ServiceContainer) => Promise<T>} concrete
   * @param {boolean} shared
   */
  bind(abstract, concrete, shared = false) {
    this.#getAliasMap(abstract).delete(abstract);
    this.#getBindingMap(abstract).set(
      abstract,
      new Binding({ concrete, shared })
    );
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {(container: ServiceContainer) => Promise<T>} concrete
   * @param {boolean} shared
   */
  bindIf(abstract, concrete, shared = false) {
    if (!this.bound(abstract)) {
      this.bind(abstract, concrete, shared);
    }
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {(container: ServiceContainer) => Promise<T>} concrete
   */
  singleton(abstract, concrete) {
    this.bind(abstract, concrete, true);
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {(container: ServiceContainer) => Promise<T>} concrete
   */
  singletonIf(abstract, concrete) {
    if (!this.bound(abstract)) {
      this.singleton(abstract, concrete);
    }
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {T} instance
   */
  instance(abstract, instance) {
    this.#getBindingMap(abstract).set(
      abstract,
      new Binding({ instance, shared: true })
    );
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @param {[*]} parameters
   * @return {Promise<T>}
   */
  async resolve(abstract, parameters = []) {
    const binding = this.#getBinding(abstract);
    if (binding) {
      return await binding.resolve(this, parameters);
    }

    if (typeof abstract == 'function') {
      return new abstract(...parameters);
    }

    throw new Error(
      `Binding not found for {${
        ServiceContainer.#isPrimitive(abstract) ? abstract : abstract.name
      }}`
    );
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @return {boolean}
   */
  resolved(abstract) {
    const binding = this.#getBinding(abstract);
    return binding ? binding.resolved : false;
  }

  /**
   * @template T
   * @param {new() => T} abstract
   * @return {boolean}
   */
  isShared(abstract) {
    const binding = this.#getBinding(abstract);
    return binding ? binding.shared : false;
  }

  /**
   * @return {ServiceContainer}
   */
  createSubContainer() {
    return new ServiceContainer({ parent: this });
  }
}
