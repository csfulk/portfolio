/**
 * Plugin Manager
 * Extensible plugin system for modular functionality
 */

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
    this.middleware = [];
    this.context = {
      services: new Map(),
      config: new Map(),
      state: new Map()
    };
    this.lifecycle = {
      beforeInit: [],
      afterInit: [],
      beforeDestroy: [],
      afterDestroy: []
    };
  }

  /**
   * Register a plugin
   * @param {string} name - Plugin name
   * @param {Object} plugin - Plugin implementation
   * @param {Object} options - Plugin options
   */
  async register(name, plugin, options = {}) {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' is already registered`);
    }

    // Validate plugin structure
    this._validatePlugin(name, plugin);

    const pluginInstance = {
      name,
      plugin,
      options,
      status: 'registered',
      dependencies: plugin.dependencies || [],
      hooks: new Map(),
      middleware: [],
      context: { ...this.context }
    };

    this.plugins.set(name, pluginInstance);

    console.log(`Plugin '${name}' registered`);
    return pluginInstance;
  }

  /**
   * Initialize a plugin
   * @param {string} name - Plugin name
   * @param {Object} customOptions - Custom initialization options
   */
  async initialize(name, customOptions = {}) {
    const pluginInstance = this.plugins.get(name);
    if (!pluginInstance) {
      throw new Error(`Plugin '${name}' not found`);
    }

    if (pluginInstance.status === 'initialized') {
      console.warn(`Plugin '${name}' already initialized`);
      return pluginInstance;
    }

    // Check dependencies
    await this._checkDependencies(pluginInstance);

    try {
      // Run lifecycle hooks
      await this._runLifecycleHooks('beforeInit', { name, options: customOptions });

      // Merge options
      const finalOptions = { ...pluginInstance.options, ...customOptions };

      // Initialize plugin
      if (pluginInstance.plugin.initialize) {
        await pluginInstance.plugin.initialize(finalOptions, this._createPluginAPI(name));
      }

      // Register plugin hooks
      if (pluginInstance.plugin.hooks) {
        Object.entries(pluginInstance.plugin.hooks).forEach(([hookName, handler]) => {
          this.addHook(hookName, handler, { plugin: name });
        });
      }

      // Register plugin middleware
      if (pluginInstance.plugin.middleware) {
        pluginInstance.plugin.middleware.forEach(mw => {
          this.addMiddleware(mw, { plugin: name });
        });
      }

      pluginInstance.status = 'initialized';
      
      await this._runLifecycleHooks('afterInit', { name, options: finalOptions });
      
      console.log(`Plugin '${name}' initialized`);
      return pluginInstance;

    } catch (error) {
      pluginInstance.status = 'error';
      console.error(`Plugin '${name}' initialization failed:`, error);
      throw error;
    }
  }

  /**
   * Initialize all registered plugins
   * @param {Object} globalOptions - Global options for all plugins
   */
  async initializeAll(globalOptions = {}) {
    const plugins = Array.from(this.plugins.keys());
    const initialized = [];
    const failed = [];

    for (const name of plugins) {
      try {
        await this.initialize(name, globalOptions);
        initialized.push(name);
      } catch (error) {
        failed.push({ name, error });
      }
    }

    console.log(`Plugin initialization complete. Success: ${initialized.length}, Failed: ${failed.length}`);
    
    if (failed.length > 0) {
      console.warn('Failed plugin initializations:', failed);
    }

    return { initialized, failed };
  }

  /**
   * Destroy a plugin
   * @param {string} name - Plugin name
   */
  async destroy(name) {
    const pluginInstance = this.plugins.get(name);
    if (!pluginInstance || pluginInstance.status !== 'initialized') {
      return;
    }

    try {
      await this._runLifecycleHooks('beforeDestroy', { name });

      // Cleanup plugin hooks
      pluginInstance.hooks.forEach((handler, hookName) => {
        this.removeHook(hookName, handler);
      });

      // Cleanup plugin middleware
      pluginInstance.middleware.forEach(mw => {
        this.removeMiddleware(mw);
      });

      // Run plugin destroy method
      if (pluginInstance.plugin.destroy) {
        await pluginInstance.plugin.destroy();
      }

      pluginInstance.status = 'destroyed';
      
      await this._runLifecycleHooks('afterDestroy', { name });
      
      console.log(`Plugin '${name}' destroyed`);

    } catch (error) {
      console.error(`Plugin '${name}' destruction failed:`, error);
      throw error;
    }
  }

  /**
   * Add a hook
   * @param {string} name - Hook name
   * @param {Function} handler - Hook handler
   * @param {Object} metadata - Hook metadata
   */
  addHook(name, handler, metadata = {}) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, []);
    }

    const hook = { handler, metadata, priority: metadata.priority || 0 };
    this.hooks.get(name).push(hook);
    
    // Sort by priority (higher first)
    this.hooks.get(name).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove a hook
   * @param {string} name - Hook name
   * @param {Function} handler - Hook handler to remove
   */
  removeHook(name, handler) {
    if (!this.hooks.has(name)) return;

    const hooks = this.hooks.get(name);
    const index = hooks.findIndex(hook => hook.handler === handler);
    
    if (index > -1) {
      hooks.splice(index, 1);
    }
  }

  /**
   * Execute hooks
   * @param {string} name - Hook name
   * @param {*} data - Data to pass to hooks
   * @returns {*} Processed data
   */
  async executeHooks(name, data) {
    const hooks = this.hooks.get(name) || [];
    let result = data;

    for (const hook of hooks) {
      try {
        const hookResult = await hook.handler(result, this.context);
        if (hookResult !== undefined) {
          result = hookResult;
        }
      } catch (error) {
        console.error(`Hook '${name}' execution failed:`, error);
        // Continue with other hooks unless it's critical
        if (hook.metadata.critical) {
          throw error;
        }
      }
    }

    return result;
  }

  /**
   * Add middleware
   * @param {Function} middleware - Middleware function
   * @param {Object} metadata - Middleware metadata
   */
  addMiddleware(middleware, metadata = {}) {
    this.middleware.push({ middleware, metadata });
    
    // Sort by priority
    this.middleware.sort((a, b) => (b.metadata.priority || 0) - (a.metadata.priority || 0));
  }

  /**
   * Remove middleware
   * @param {Function} middleware - Middleware function to remove
   */
  removeMiddleware(middleware) {
    const index = this.middleware.findIndex(mw => mw.middleware === middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
    }
  }

  /**
   * Execute middleware chain
   * @param {string} type - Middleware type
   * @param {*} data - Data to process
   * @returns {*} Processed data
   */
  async executeMiddleware(type, data) {
    const applicableMiddleware = this.middleware.filter(
      mw => !mw.metadata.type || mw.metadata.type === type
    );

    let result = data;
    
    for (const { middleware } of applicableMiddleware) {
      try {
        result = await middleware(result, this.context);
      } catch (error) {
        console.error('Middleware execution failed:', error);
        throw error;
      }
    }

    return result;
  }

  /**
   * Get plugin status
   * @param {string} name - Plugin name
   * @returns {string|null} Plugin status
   */
  getPluginStatus(name) {
    const plugin = this.plugins.get(name);
    return plugin ? plugin.status : null;
  }

  /**
   * List all plugins
   * @returns {Array} Plugin list with status
   */
  listPlugins() {
    return Array.from(this.plugins.entries()).map(([name, instance]) => ({
      name,
      status: instance.status,
      dependencies: instance.dependencies,
      hasHooks: instance.plugin.hooks !== undefined,
      hasMiddleware: instance.plugin.middleware !== undefined
    }));
  }

  /**
   * Set context value
   * @param {string} key - Context key
   * @param {*} value - Context value
   */
  setContext(key, value) {
    this.context.state.set(key, value);
    
    // Update all plugin contexts
    this.plugins.forEach(plugin => {
      plugin.context = { ...this.context };
    });
  }

  /**
   * Get context value
   * @param {string} key - Context key
   * @returns {*} Context value
   */
  getContext(key) {
    return this.context.state.get(key);
  }

  /**
   * Validate plugin structure
   * @private
   */
  _validatePlugin(name, plugin) {
    if (!plugin || typeof plugin !== 'object') {
      throw new Error(`Plugin '${name}' must be an object`);
    }

    const requiredMethods = ['initialize'];
    const optionalMethods = ['destroy', 'hooks', 'middleware'];

    requiredMethods.forEach(method => {
      if (!plugin[method] || typeof plugin[method] !== 'function') {
        throw new Error(`Plugin '${name}' must implement '${method}' method`);
      }
    });
  }

  /**
   * Check plugin dependencies
   * @private
   */
  async _checkDependencies(pluginInstance) {
    for (const dependency of pluginInstance.dependencies) {
      const depPlugin = this.plugins.get(dependency);
      
      if (!depPlugin) {
        throw new Error(`Plugin '${pluginInstance.name}' depends on '${dependency}' which is not registered`);
      }
      
      if (depPlugin.status !== 'initialized') {
        console.log(`Initializing dependency '${dependency}' for '${pluginInstance.name}'`);
        await this.initialize(dependency);
      }
    }
  }

  /**
   * Create plugin API
   * @private
   */
  _createPluginAPI(pluginName) {
    return {
      addHook: (name, handler, metadata = {}) => {
        this.addHook(name, handler, { ...metadata, plugin: pluginName });
      },
      removeHook: (name, handler) => {
        this.removeHook(name, handler);
      },
      executeHooks: (name, data) => {
        return this.executeHooks(name, data);
      },
      setContext: (key, value) => {
        this.setContext(key, value);
      },
      getContext: (key) => {
        return this.getContext(key);
      },
      getPlugin: (name) => {
        return this.plugins.get(name);
      }
    };
  }

  /**
   * Run lifecycle hooks
   * @private
   */
  async _runLifecycleHooks(phase, data) {
    const hooks = this.lifecycle[phase] || [];
    
    for (const hook of hooks) {
      try {
        await hook(data);
      } catch (error) {
        console.error(`Lifecycle hook '${phase}' failed:`, error);
      }
    }
  }

  /**
   * Add lifecycle hook
   * @param {string} phase - Lifecycle phase
   * @param {Function} hook - Hook function
   */
  addLifecycleHook(phase, hook) {
    if (!this.lifecycle[phase]) {
      this.lifecycle[phase] = [];
    }
    
    this.lifecycle[phase].push(hook);
  }

  /**
   * Destroy all plugins and cleanup
   */
  async destroyAll() {
    const plugins = Array.from(this.plugins.keys());
    
    for (const name of plugins) {
      try {
        await this.destroy(name);
      } catch (error) {
        console.error(`Failed to destroy plugin '${name}':`, error);
      }
    }

    this.plugins.clear();
    this.hooks.clear();
    this.middleware = [];
    this.context = { services: new Map(), config: new Map(), state: new Map() };
  }
}

// Create singleton instance
export const pluginManager = new PluginManager();

// Export class for testing or custom instances
export { PluginManager };

export default pluginManager;
