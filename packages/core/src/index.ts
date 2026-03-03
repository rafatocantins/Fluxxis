/**
 * @fluxxis/core
 * 
 * FLUXXIS Adaptive Structural Interface Engine
 * Framework-agnostic core
 */

// Core Modules
export * from './signals';
export * from './intents';
export * from './analytics';
export * from './structured-data';
export * from './licensing';

// Infrastructure
export * from './events';
export * from './registry';
// Note: stores exported separately to avoid Signal conflict
// export * from './stores';

// Utilities
export * from './utils';
export * from './tokens';
export * from './styles';

// UI and framework-specific code moved to @fluxxis/react
// API (framework-agnostic)
export * from './api';

// Core Types
export * from './types';

// Note: _internal types are internal - import from specific modules
// Note: types and tracking are internal-only
