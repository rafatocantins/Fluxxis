import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useBehaviorObserver, type BehaviorMetrics } from '../../hooks/useBehaviorObserver';
import { nodeRegistry, eventBus } from '@fluxxis/core';
import type { SmartSectionProps } from './types';

export const SmartSection: React.FC<SmartSectionProps> = ({
    goal,
    pageContext,
    brandVoice,
    as: Component = 'section',
    children,
    className = '',
    id: proposedId,
    ...props
}) => {
    const [nodeId, setNodeId] = useState<string>('');
    const [sectionMetrics, setSectionMetrics] = useState<BehaviorMetrics | null>(null);

    // Use the proposed id if provided, else generate one
    useEffect(() => {
        const id = proposedId || `smartsection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setNodeId(id);

        // Register node with registry
        const node = nodeRegistry.register({
            id,
            goal,
            pageContext,
            brandVoice,
            // Intent mapping defaults
            sectionId: id,
        });

        // Emit registration event
        void eventBus.publish('NODE_REGISTER', { node }, 'SmartSection');

        // Cleanup on unmount
        return () => {
            nodeRegistry.deregister(id, 'Component unmounted');
            void eventBus.publish('NODE_DEREGISTER', { nodeId: id, reason: 'Component unmounted' }, 'SmartSection');
        };
    }, [goal, pageContext, brandVoice, proposedId]);

    // Setup behavior observer
    const { ref } = useBehaviorObserver<HTMLElement>({
        trackHover: true,
        trackDwell: true,
        onBehaviorChange: useCallback((behavior: BehaviorMetrics) => {
            setSectionMetrics(behavior);

            // We don't need to report every minor behavior change, only milestones.
            // Dwell milestones: e.g., 2000ms, 5000ms, 10000ms
            const dwellThresholds = [2000, 5000, 10000];

            // Let's rely on external listeners or just track internal state for now.
            // Or we can emit specific signals when milestones are reached.
            if (behavior.inViewport && behavior.dwellTime > 0) {
                // We can track entry. This might be too noisy on every change, 
                // but the event bus pattern handles high volume if implemented well.
                // For MVP, we'll avoid spamming.
            }
        }, []),
    });

    // Track viewport entry/exit specifically if needed, utilizing behavior metrics
    const wasInViewport = useRef<boolean>(false);
    useEffect(() => {
        if (!nodeId || !sectionMetrics) return;

        if (sectionMetrics.inViewport && !wasInViewport.current) {
            wasInViewport.current = true;
            // Emit entrance signal
            void eventBus.publish('BEHAVIOR_SIGNAL', {
                nodeId,
                signalType: 'view_start',
                value: 1, // entered
                timestamp: Date.now(),
            }, 'SmartSection');
        } else if (!sectionMetrics.inViewport && wasInViewport.current) {
            wasInViewport.current = false;
            // Emit exit signal
            void eventBus.publish('BEHAVIOR_SIGNAL', {
                nodeId,
                signalType: 'view_end',
                value: sectionMetrics.dwellTime, // amount of time spent looking at it
                timestamp: Date.now(),
            }, 'SmartSection');

            // Update registry metrics
            nodeRegistry.updateMetrics(nodeId, {
                timeExposed: sectionMetrics.dwellTime
            });
        }
    }, [sectionMetrics, nodeId]);

    const classes = [
        'smart-section',
        `smart-section--${goal}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <Component
            ref={ref}
            className={classes}
            data-goal={goal}
            data-page-context={pageContext}
            data-node-id={nodeId}
            id={proposedId}
            {...props}
        >
            {children}
        </Component>
    );
};

SmartSection.displayName = 'SmartSection';
