/**
 * Configuration Management System
 * Centralized configuration with environment-specific overrides and feature flags
 */

class ConfigManager {
  constructor() {
    this.configs = new Map();
    this.environment = this._detectEnvironment();
    this.featureFlags = new Map();
    this.watchers = new Map();
    this.cache = new Map();
    this.secrets = new Map();
    
    // Initialize with defaults
    this._loadDefaults();
  }

  /**
   * Load configuration from multiple sources
   * @param {Object} sources - Configuration sources
   */
  async load(sources = {}) {
    const {
      defaults = {},
      environment = {},
      local = {},
      runtime = {},
      remote = null
    } = sources;

    try {
      // Load in priority order (lowest to highest)
      this._mergeConfig('defaults', defaults);
      this._mergeConfig('environment', environment);
      this._mergeConfig('local', local);
      this._mergeConfig('runtime', runtime);
      
      // Load remote config if specified
      if (remote) {
        const remoteConfig = await this._loadRemoteConfig(remote);
        this._mergeConfig('remote', remoteConfig);
      }

      // Apply environment-specific overrides
      this._applyEnvironmentOverrides();

      console.log(`Configuration loaded for environment: ${this.environment}`);
      
    } catch (error) {
      console.error('Configuration loading failed:', error);
      throw error;
    }
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key (supports dot notation)
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  get(key, defaultValue = undefined) {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const value = this._getNestedValue(this.configs, key);
    const result = value !== undefined ? value : defaultValue;
    
    // Cache the result
    this.cache.set(key, result);
    
    return result;
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key (supports dot notation)
   * @param {*} value - Configuration value
   * @param {Object} options - Set options
   */
  set(key, value, options = {}) {
    const { 
      source = 'runtime',
      notify = true,
      validate = true 
    } = options;

    if (validate && !this._validateValue(key, value)) {
      throw new Error(`Invalid value for configuration key '${key}'`);
    }

    // Clear cache for this key and related keys
    this._clearRelatedCache(key);

    // Set the value
    this._setNestedValue(this.configs, key, value, source);

    // Notify watchers
    if (notify) {
      this._notifyWatchers(key, value);
    }

    console.log(`Configuration updated: ${key} = ${JSON.stringify(value)}`);
  }

  /**
   * Watch configuration changes
   * @param {string} key - Key to watch (supports wildcards)
   * @param {Function} callback - Change callback
   * @returns {Function} Unwatch function
   */
  watch(key, callback) {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, new Set());
    }
    
    this.watchers.get(key).add(callback);

    // Return unwatch function
    return () => {
      const callbacks = this.watchers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.watchers.delete(key);
        }
      }
    };
  }

  /**
   * Get feature flag value
   * @param {string} flag - Feature flag name
   * @param {*} defaultValue - Default value
   * @returns {boolean|*} Feature flag value
   */
  getFeature(flag, defaultValue = false) {
    if (this.featureFlags.has(flag)) {
      const flagConfig = this.featureFlags.get(flag);
      return this._evaluateFeatureFlag(flagConfig);
    }
    
    return defaultValue;
  }

  /**
   * Set feature flag
   * @param {string} flag - Feature flag name
   * @param {boolean|Object} config - Flag configuration
   */
  setFeature(flag, config) {
    if (typeof config === 'boolean') {
      config = { enabled: config };
    }

    this.featureFlags.set(flag, {
      enabled: config.enabled || false,
      rollout: config.rollout || 100,
      conditions: config.conditions || {},
      ...config
    });

    this._notifyWatchers(`feature.${flag}`, config);
  }

  /**
   * Get all feature flags
   * @returns {Object} All feature flags with their current values
   */
  getAllFeatures() {
    const features = {};
    
    this.featureFlags.forEach((config, flag) => {
      features[flag] = this._evaluateFeatureFlag(config);
    });
    
    return features;
  }

  /**
   * Get configuration for specific environment
   * @param {string} env - Environment name
   * @returns {Object} Environment-specific configuration
   */
  getEnvironmentConfig(env = this.environment) {
    return this.get(`environments.${env}`, {});
  }

  /**
   * Check if running in specific environment
   * @param {string} env - Environment to check
   * @returns {boolean} True if current environment matches
   */
  isEnvironment(env) {
    return this.environment === env;
  }

  /**
   * Get current environment
   * @returns {string} Current environment
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * Set secret value (encrypted storage)
   * @param {string} key - Secret key
   * @param {string} value - Secret value
   */
  setSecret(key, value) {
    // In a real implementation, this would encrypt the value
    this.secrets.set(key, this._encryptValue(value));
  }

  /**
   * Get secret value (decrypted)
   * @param {string} key - Secret key
   * @returns {string|null} Decrypted secret value
   */
  getSecret(key) {
    const encrypted = this.secrets.get(key);
    return encrypted ? this._decryptValue(encrypted) : null;
  }

  /**
   * Validate entire configuration
   * @returns {Object} Validation results
   */
  validate() {
    const errors = [];
    const warnings = [];

    // Validate required keys
    const requiredKeys = this.get('validation.required', []);
    requiredKeys.forEach(key => {
      if (this.get(key) === undefined) {
        errors.push(`Required configuration key '${key}' is missing`);
      }
    });

    // Validate types
    const typeValidation = this.get('validation.types', {});
    Object.entries(typeValidation).forEach(([key, expectedType]) => {
      const value = this.get(key);
      if (value !== undefined && typeof value !== expectedType) {
        errors.push(`Configuration key '${key}' should be of type '${expectedType}', got '${typeof value}'`);
      }
    });

    // Validate feature flags
    this.featureFlags.forEach((config, flag) => {
      if (config.rollout < 0 || config.rollout > 100) {
        warnings.push(`Feature flag '${flag}' has invalid rollout percentage: ${config.rollout}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Export configuration as JSON
   * @param {Object} options - Export options
   * @returns {string} Configuration JSON
   */
  export(options = {}) {
    const {
      includeSecrets = false,
      includeFeatures = true,
      prettify = true
    } = options;

    const exportData = {
      environment: this.environment,
      config: Object.fromEntries(this.configs),
      timestamp: new Date().toISOString()
    };

    if (includeFeatures) {
      exportData.featureFlags = Object.fromEntries(this.featureFlags);
    }

    if (includeSecrets) {
      exportData.secrets = Object.fromEntries(this.secrets);
    }

    return prettify 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);
  }

  /**
   * Import configuration from JSON
   * @param {string} jsonData - JSON configuration data
   * @param {Object} options - Import options
   */
  import(jsonData, options = {}) {
    const {
      merge = true,
      validateBeforeImport = true
    } = options;

    try {
      const importData = JSON.parse(jsonData);
      
      if (validateBeforeImport) {
        this._validateImportData(importData);
      }

      if (!merge) {
        this.configs.clear();
        this.featureFlags.clear();
      }

      // Import configuration
      if (importData.config) {
        Object.entries(importData.config).forEach(([key, value]) => {
          this.set(key, value, { notify: false });
        });
      }

      // Import feature flags
      if (importData.featureFlags) {
        Object.entries(importData.featureFlags).forEach(([flag, config]) => {
          this.setFeature(flag, config);
        });
      }

      // Import secrets
      if (importData.secrets) {
        Object.entries(importData.secrets).forEach(([key, value]) => {
          this.secrets.set(key, value);
        });
      }

      console.log('Configuration imported successfully');
      
    } catch (error) {
      console.error('Configuration import failed:', error);
      throw error;
    }
  }

  /**
   * Clear all configuration
   */
  clear() {
    this.configs.clear();
    this.featureFlags.clear();
    this.cache.clear();
    this.secrets.clear();
    this._loadDefaults();
  }

  /**
   * Load default configuration
   * @private
   */
  _loadDefaults() {
    const defaults = {
      app: {
        name: 'Portfolio',
        version: '1.0.0',
        debug: false
      },
      environments: {
        development: {
          debug: true,
          hotReload: true,
          mockData: true
        },
        production: {
          debug: false,
          hotReload: false,
          mockData: false,
          analytics: true,
          optimization: true
        },
        test: {
          debug: false,
          mockData: true,
          analytics: false
        }
      },
      features: {
        analytics: true,
        imageOptimization: true,
        lazyLoading: true,
        caching: true
      },
      validation: {
        required: ['app.name', 'app.version'],
        types: {
          'app.debug': 'boolean',
          'app.version': 'string'
        }
      }
    };

    this._mergeConfig('defaults', defaults);
  }

  /**
   * Detect current environment
   * @private
   */
  _detectEnvironment() {
    // Check various environment indicators
    if (typeof window !== 'undefined') {
      // Browser environment
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
        return 'development';
      }
      if (window.location.protocol === 'file:') {
        return 'local';
      }
      return 'production';
    }
    
    // Node.js environment
    return process.env.NODE_ENV || 'development';
  }

  /**
   * Merge configuration from source
   * @private
   */
  _mergeConfig(source, config) {
    Object.entries(config).forEach(([key, value]) => {
      this._setNestedValue(this.configs, key, value, source);
    });
  }

  /**
   * Apply environment-specific overrides
   * @private
   */
  _applyEnvironmentOverrides() {
    const envConfig = this.getEnvironmentConfig();
    Object.entries(envConfig).forEach(([key, value]) => {
      this.set(key, value, { source: 'environment', notify: false });
    });
  }

  /**
   * Get nested value using dot notation
   * @private
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current.get ? current.get(key) : current?.[key];
    }, obj);
  }

  /**
   * Set nested value using dot notation
   * @private
   */
  _setNestedValue(obj, path, value, source) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    let current = obj;
    
    for (const key of keys) {
      if (!current.has(key)) {
        current.set(key, new Map());
      }
      current = current.get(key);
    }
    
    current.set(lastKey, { value, source, timestamp: Date.now() });
  }

  /**
   * Evaluate feature flag conditions
   * @private
   */
  _evaluateFeatureFlag(config) {
    if (!config.enabled) return false;
    
    // Check rollout percentage
    if (config.rollout < 100) {
      const hash = this._hashUserId() % 100;
      if (hash >= config.rollout) return false;
    }
    
    // Check conditions
    if (config.conditions) {
      // Add condition evaluation logic here
      // e.g., user segments, device types, etc.
    }
    
    return true;
  }

  /**
   * Generate user hash for rollout
   * @private
   */
  _hashUserId() {
    // Simple hash function for demo - use proper user ID in production
    const userId = this.getSecret('userId') || 'anonymous';
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Clear related cache entries
   * @private
   */
  _clearRelatedCache(key) {
    const keysToDelete = [];
    
    for (const cacheKey of this.cache.keys()) {
      if (cacheKey.startsWith(key) || key.startsWith(cacheKey)) {
        keysToDelete.push(cacheKey);
      }
    }
    
    keysToDelete.forEach(k => this.cache.delete(k));
  }

  /**
   * Notify configuration watchers
   * @private
   */
  _notifyWatchers(key, value) {
    // Notify exact key watchers
    if (this.watchers.has(key)) {
      this.watchers.get(key).forEach(callback => {
        try {
          callback(key, value);
        } catch (error) {
          console.error('Configuration watcher error:', error);
        }
      });
    }

    // Notify wildcard watchers
    this.watchers.forEach((callbacks, watchKey) => {
      if (watchKey.includes('*') && this._matchesWildcard(key, watchKey)) {
        callbacks.forEach(callback => {
          try {
            callback(key, value);
          } catch (error) {
            console.error('Configuration watcher error:', error);
          }
        });
      }
    });
  }

  /**
   * Check if key matches wildcard pattern
   * @private
   */
  _matchesWildcard(key, pattern) {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(key);
  }

  /**
   * Validate configuration value
   * @private
   */
  _validateValue(key, value) {
    // Add validation logic based on key patterns or schemas
    return true;
  }

  /**
   * Load remote configuration
   * @private
   */
  async _loadRemoteConfig(remoteConfig) {
    try {
      const response = await fetch(remoteConfig.url, {
        method: remoteConfig.method || 'GET',
        headers: remoteConfig.headers || {}
      });
      
      if (!response.ok) {
        throw new Error(`Remote config request failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to load remote configuration:', error);
      return {};
    }
  }

  /**
   * Validate import data structure
   * @private
   */
  _validateImportData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Import data must be an object');
    }
    
    // Add more validation as needed
  }

  /**
   * Encrypt value (placeholder implementation)
   * @private
   */
  _encryptValue(value) {
    // In production, use proper encryption
    return btoa(value);
  }

  /**
   * Decrypt value (placeholder implementation)
   * @private
   */
  _decryptValue(encrypted) {
    // In production, use proper decryption
    try {
      return atob(encrypted);
    } catch {
      return null;
    }
  }
}

// Create singleton instance
export const configManager = new ConfigManager();

// Export class for testing or custom instances
export { ConfigManager };

export default configManager;
