/**
 * SmartCTA Component
 *
 * An intent-driven CTA component that adapts based on user behavior and goals.
 * Now includes beautiful animated button variants with shimmer, rainbow, and blur effects.
 *
 * @example
 * ```tsx
 * <SmartCTA
 *   goal="convert"
 *   defaultCopy="Get Started"
 *   pageContext="pricing"
 *   brandVoice={{ tone: 'confident-but-warm', audience: ['founders'], ctaStyle: 'direct' }}
 *   animatedVariant="primary"
 * />
 * ```
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useBehaviorObserver } from '../../hooks/useBehaviorObserver';
import type { BehaviorMetrics } from '../../hooks/useBehaviorObserver';
import { getIntentTokens, getIntentCSSVariables } from '../../tokens/intentTokens';
import { nodeRegistry } from '../../registry/NodeRegistry';
import { eventBus } from '../../events/EventBus';
import { generateCopy } from '../../api/copyGeneration';
import type { SmartCTAProps } from './types';
import { AnimatedButton } from './AnimatedButtonVariants';
import './animatedButtonStyles.css';

export const SmartCTA: React.FC<SmartCTAProps & {
  /** Enable animated button variant */
  animated?: boolean;
  /** Animated button variant type */
  animatedVariant?: 'primary' | 'secondary' | 'accent';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
  /** Icon before text */
  icon?: React.ReactNode;
  /** Icon after text */
  trailingIcon?: React.ReactNode;
  /** Disable animations (respects reduced motion) */
  disableAnimations?: boolean;
  /** Testing: API key for development */
  _apiKey?: string;
  /** Testing: Force provider ('groq' | 'openrouter' | 'gemini' | 'anthropic') */
  _provider?: 'groq' | 'openrouter' | 'gemini' | 'anthropic';
}> = ({
  goal = 'convert',
  defaultCopy = 'Get Started',
  pageContext = '',
  brandVoice,
  variant = 'primary',
  animated = true,
  animatedVariant,
  size = 'md',
  isLoading = false,
  icon,
  trailingIcon,
  disableAnimations = false,
  _apiKey,
  _provider,
  onClick,
  className = '',
  ...props
}) => {
  console.log('[SmartCTA] Component mounted with props:', { goal, pageContext, hasBrandVoice: !!brandVoice });
  
  // Component state
  const [emphasis, setEmphasis] = useState<'subtle' | 'normal' | 'strong'>('normal');
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const [nodeId, setNodeId] = useState<string>('');
  const [copy, setCopy] = useState<string>(defaultCopy);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState<boolean>(false);
  const [hasCopyError, setHasCopyError] = useState<boolean>(false);
  const interactionCountRef = useRef<number>(0);

  // Generate unique node ID
  useEffect(() => {
    const id = `smartcta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNodeId(id);

    // Register node with registry
    const node = nodeRegistry.register({
      id,
      goal,
      pageContext,
      brandVoice,
      sectionId: undefined,
    });

    // Emit registration event
    void eventBus.publish('NODE_REGISTER', { node }, 'SmartCTA');

    // Cleanup on unmount
    return () => {
      nodeRegistry.deregister(id, 'Component unmounted');
      void eventBus.publish('NODE_DEREGISTER', { nodeId: id, reason: 'Component unmounted' }, 'SmartCTA');
    };
  }, [goal, pageContext, brandVoice]);

  // Generate AI-powered copy (if brandVoice provided)
  useEffect(() => {
    // Access env vars from globalThis (injected by demo app)
    const openrouterKey = (globalThis as any).VITE_OPENROUTER_API_KEY || '';
    const groqKey = (globalThis as any).VITE_GROQ_API_KEY || '';
    const geminiKey = (globalThis as any).VITE_GEMINI_API_KEY || '';
    const anthropicKey = (globalThis as any).VITE_ANTHROPIC_API_KEY || '';
    const qwenKey = (globalThis as any).VITE_QWEN_API_KEY || '';
    
    console.log('[SmartCTA] Checking AI copy generation...', { 
      hasBrandVoice: !!brandVoice,
      hasOpenRouterKey: !!openrouterKey,
      hasGroqKey: !!groqKey,
      hasGeminiKey: !!geminiKey,
      hasAnthropicKey: !!anthropicKey,
      hasQwenKey: !!qwenKey,
    });
    
    if (!brandVoice || (!openrouterKey && !groqKey && !geminiKey && !anthropicKey && !qwenKey)) {
      console.log('[SmartCTA] No API key found, using default copy');
      setCopy(defaultCopy);
      return;
    }

    // Determine provider from available keys (priority: Groq > OpenRouter > Gemini > Anthropic > Qwen)
    const provider = groqKey ? 'groq' : openrouterKey ? 'openrouter' : geminiKey ? 'gemini' : anthropicKey ? 'anthropic' : 'qwen';
    const apiKey = groqKey || openrouterKey || geminiKey || anthropicKey || qwenKey;
    const model = provider === 'groq' ? 'llama-3.3-70b-versatile' 
      : provider === 'openrouter' ? 'meta-llama/llama-3-8b-instruct'
      : provider === 'gemini' ? 'gemini-2.0-flash' 
      : provider === 'anthropic' ? 'claude-sonnet-4-5-20250929' 
      : 'qwen-max';

    const generateCopyForCTA = async () => {
      setIsGeneratingCopy(true);
      setHasCopyError(false);

      try {
        const response = await generateCopy(
          {
            goal,
            pageContext,
            brandVoice,
            defaultCopy,
            componentType: 'button',
          },
          {
            provider,
            apiKey,
            model,
            enableCache: true,
          }
        );

        if (!response.fallback && response.selected) {
          setCopy(response.selected);
          console.log('[SmartCTA] Copy generated:', response.selected);
        } else {
          console.log('[SmartCTA] Using fallback copy');
        }
      } catch (error) {
        console.error('[SmartCTA] Copy generation failed:', error);
        setHasCopyError(true);
        setCopy(defaultCopy);
      } finally {
        setIsGeneratingCopy(false);
      }
    };

    generateCopyForCTA();
  }, [goal, pageContext, brandVoice, defaultCopy]);

  // Setup behavior observer
  const { ref } = useBehaviorObserver<HTMLButtonElement>({
    trackHover: true,
    trackDwell: true,
    onBehaviorChange: useCallback((behavior: BehaviorMetrics) => {
      // Emit behavior signals on hover start
      if (behavior.isHovered && behavior.hoverTime < 100) {
        void eventBus.publish('BEHAVIOR_SIGNAL', {
          nodeId,
          signalType: 'hover',
          value: behavior.hoverTime,
          timestamp: Date.now(),
        }, 'SmartCTA');
      }

      // Adjust emphasis based on dwell time
      if (behavior.dwellTime > 5000) {
        setEmphasis('strong');
      } else if (behavior.dwellTime > 2000) {
        setEmphasis('normal');
      }
    }, [nodeId]),
  });

  // Scroll-based floating behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Enable floating after scrolling past initial viewport
      setIsFloating(scrollPosition > viewportHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get intent tokens for styling
  const intentTokens = getIntentTokens(goal);
  const cssVariables = getIntentCSSVariables(goal);

  // Handle click
  const handleClick = useCallback((_e: React.MouseEvent<HTMLButtonElement>) => {
    interactionCountRef.current += 1;

    // Record interaction
    void eventBus.publish('BEHAVIOR_SIGNAL', {
      nodeId,
      signalType: 'click',
      value: 1,
      timestamp: Date.now(),
    }, 'SmartCTA');

    // Update node metrics
    nodeRegistry.updateMetrics(nodeId, {
      interactions: interactionCountRef.current,
      lastInteraction: Date.now(),
    });

    // Call user's onClick handler
    onClick?.();
  }, [nodeId, onClick]);

  // Determine animated variant based on goal if not explicitly set
  const resolvedAnimatedVariant = animatedVariant ?? (
    goal === 'convert' ? 'primary' : goal === 'inform' ? 'secondary' : 'accent'
  );

  // Build class names
  const classes = [
    'smart-cta',
    `smart-cta--${variant}`,
    `smart-cta--${goal}`,
    `smart-cta--emphasis-${emphasis}`,
    isFloating ? 'smart-cta--floating' : '',
    className,
  ].filter(Boolean).join(' ');

  // Render animated button if enabled
  if (animated) {
    return (
      <AnimatedButton
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        variant={resolvedAnimatedVariant}
        goal={goal}
        size={size}
        isLoading={isLoading || isGeneratingCopy}
        icon={icon}
        trailingIcon={trailingIcon}
        disableAnimations={disableAnimations}
        className={classes}
        data-goal={goal}
        data-page-context={pageContext}
        data-node-id={nodeId}
        data-emphasis={emphasis}
        data-floating={isFloating}
        data-copy-error={hasCopyError}
        onClick={handleClick}
        {...props}
      >
        {isGeneratingCopy ? 'Loading...' : copy}
      </AnimatedButton>
    );
  }

  // Render legacy button if animated is disabled
  return (
    <button
      ref={ref}
      className={classes}
      data-goal={goal}
      data-page-context={pageContext}
      data-node-id={nodeId}
      data-emphasis={emphasis}
      data-floating={isFloating}
      onClick={handleClick}
      style={{
        ...cssVariables,
        '--intent-animation': intentTokens.animation,
        '--intent-border-radius': intentTokens.borderRadius,
        '--intent-shadow': intentTokens.shadow,
      } as React.CSSProperties}
      {...props}
    >
      {defaultCopy}
    </button>
  );
};

SmartCTA.displayName = 'SmartCTA';
