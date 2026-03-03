import React, { createContext, useContext, useMemo, useState } from 'react';
import { IntentResolver, ResolutionOptions, DEFAULT_RESOLUTION_OPTIONS } from '@fluxxis/core';

export interface FluxxisContextState {
    resolver: IntentResolver;
    options: ResolutionOptions;
    components: Map<string, { goal: string; priority: string }>;
    registerComponent: (id: string, goal: string, priority: string) => void;
    unregisterComponent: (id: string) => void;
}

export const FluxxisContext = createContext<FluxxisContextState | null>(null);

export interface FluxxisProviderProps {
    children: React.ReactNode;
    options?: Partial<ResolutionOptions>;
    cacheTTL?: number;
}

/**
 * FluxxisProvider
 * 
 * Central context provider for the FLUXXIS engine in React applications.
 * Instantiates the IntentResolver and manages the active component registry.
 */
export const FluxxisProvider: React.FC<FluxxisProviderProps> = ({
    children,
    options = {},
    cacheTTL = 300000,
}) => {
    // Merge user options with defaults
    const mergedOptions = useMemo(
        () => ({ ...DEFAULT_RESOLUTION_OPTIONS, ...options }),
        [options]
    );

    // Initialize the engine resolver once
    const resolver = useMemo(() => new IntentResolver(mergedOptions, cacheTTL), [mergedOptions, cacheTTL]);

    // Track active declarative components
    const [components, setComponents] = useState<Map<string, { goal: string; priority: string }>>(
        new Map()
    );

    const registerComponent = (id: string, goal: string, priority: string) => {
        setComponents((prev) => {
            const next = new Map(prev);
            next.set(id, { goal, priority });
            return next;
        });
    };

    const unregisterComponent = (id: string) => {
        setComponents((prev) => {
            const next = new Map(prev);
            next.delete(id);
            return next;
        });
        // Clear cache for this component when it unmounts
        resolver.clearCache(id);
    };

    const value = useMemo(
        () => ({
            resolver,
            options: mergedOptions,
            components,
            registerComponent,
            unregisterComponent,
        }),
        [resolver, mergedOptions, components]
    );

    // Future expansion: we could initialize the global SignalProcessor here to listen
    // to document-level generic events (clicks, scrolls) and feed them to the active components.

    return <FluxxisContext.Provider value={value}>{children}</FluxxisContext.Provider>;
};

/**
 * Internal hook to access the Fluxxis engine context
 */
export function useFluxxis(): FluxxisContextState {
    const context = useContext(FluxxisContext);
    if (!context) {
        throw new Error('useFluxxis must be used within a FluxxisProvider');
    }
    return context;
}
