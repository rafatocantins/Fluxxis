import { useEffect, useId, useMemo, useState } from 'react';
import { IntentDeclaration, IntentResolution, Signal } from '@fluxxis/core';
import { useFluxxis } from '../components/FluxxisProvider';

/**
 * useIntent
 * 
 * Primary React hook for declaring a component's intent and receiving its
 * adaptive resolution based on current signals and active actor type.
 * 
 * @param declaration The component's intent declaration
 * @param componentId Optional explict ID. An auto-generated ID is used if not provided.
 */
export function useIntent(
    declaration: Omit<IntentDeclaration, 'componentId' | 'timestamp'>,
    componentId?: string
): IntentResolution {
    const { resolver, registerComponent, unregisterComponent } = useFluxxis();

    // Auto-generate an ID if one wasn't provided
    const generatedId = useId();
    const id = componentId || `fluxxis-comp-${generatedId}`;

    // Local signal state specific to this component.
    // In a fully integrated system, the `FluxxisProvider` might push signals down,
    // or a `useSignal` hook would gather them and feed them here.
    // For now, we resolve statelessly based on the initial declaration.
    const [signals] = useState<Signal[]>([]);

    // Register component presence with the engine on mount
    useEffect(() => {
        registerComponent(id, declaration.goal, declaration.priority);

        return () => {
            unregisterComponent(id);
        };
    }, [id, declaration.goal, declaration.priority, registerComponent, unregisterComponent]);

    // Calculate resolution whenever the declaration or signals change
    const resolution = useMemo(() => {
        const fullDeclaration: IntentDeclaration = {
            ...declaration,
            componentId: id,
            timestamp: Date.now(),
        };

        return resolver.resolve(fullDeclaration, signals);
    }, [resolver, declaration, id, signals]);

    return resolution;
}
