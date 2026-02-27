/**
 * Animated Button Variants for SmartCTA
 *
 * Modern, beautiful animated button variants with:
 * - Shimmer effects (21st-dev-magic inspired)
 * - Rainbow animations (magicuidesign-mcp inspired)
 * - Blur fade effects (reactbits inspired)
 * - Text animations
 * - Hover effects
 * - Full accessibility support
 *
 * @packageDocumentation
 */

import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import type { GoalType } from '../../types';

// ============================================================================
// Type Definitions
// ============================================================================

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant type */
  variant?: 'primary' | 'secondary' | 'accent';
  /** Goal type for intent-driven styling */
  goal?: GoalType;
  /** Button text */
  children: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Icon to display after text */
  trailingIcon?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disable animations (for reduced motion) */
  disableAnimations?: boolean;
}

export interface ShimmerButtonProps extends AnimatedButtonProps {
  shimmerDirection?: 'horizontal' | 'diagonal';
  shimmerIntensity?: 'subtle' | 'normal' | 'strong';
}

export interface RainbowButtonProps extends AnimatedButtonProps {
  rainbowSpeed?: 'slow' | 'normal' | 'fast';
  rainbowWidth?: number;
}

export interface BlurFadeButtonProps extends AnimatedButtonProps {
  blurAmount?: number;
  fadeDirection?: 'up' | 'down' | 'left' | 'right' | 'center';
}

export interface IconButtonProps extends Omit<AnimatedButtonProps, 'children'> {
  icon: React.ReactNode;
  label: string;
  tooltip?: string;
}

// ============================================================================
// Animation Keyframes (injected via style tag)
// ============================================================================

const animationStyles = `
/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes shimmer-diagonal {
  0% {
    background-position: -200% -200%;
  }
  100% {
    background-position: 200% 200%;
  }
}

/* Rainbow Animation */
@keyframes rainbow-border {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes rainbow-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(239, 68, 68, 0.5),
      0 0 40px rgba(249, 115, 22, 0.3),
      0 0 60px rgba(234, 179, 8, 0.2);
  }
  25% {
    box-shadow: 
      0 0 20px rgba(249, 115, 22, 0.5),
      0 0 40px rgba(234, 179, 8, 0.3),
      0 0 60px rgba(34, 197, 94, 0.2);
  }
  50% {
    box-shadow: 
      0 0 20px rgba(234, 179, 8, 0.5),
      0 0 40px rgba(34, 197, 94, 0.3),
      0 0 60px rgba(59, 130, 246, 0.2);
  }
  75% {
    box-shadow: 
      0 0 20px rgba(34, 197, 94, 0.5),
      0 0 40px rgba(59, 130, 246, 0.3),
      0 0 60px rgba(168, 85, 247, 0.2);
  }
}

/* Pulse Animation */
@keyframes pulse-soft {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
}

@keyframes pulse-strong {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Bounce Animation */
@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Glow Animation */
@keyframes glow {
  0%, 100% {
    box-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor;
  }
  50% {
    box-shadow: 
      0 0 10px currentColor,
      0 0 20px currentColor,
      0 0 30px currentColor;
  }
}

/* Gradient Shift */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Particle Float */
@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100%) rotate(360deg);
    opacity: 0;
  }
}

/* Wave Animation */
@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

/* Blur Fade */
@keyframes blur-fade-in {
  0% {
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

/* Text Gradient */
@keyframes text-gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Ripple Effect */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Shake Animation (for error/attention) */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}

/* Spin Animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Injects animation styles into the document head
 */
const AnimationStylesInjector: React.FC = () => {
  useEffect(() => {
    const styleId = 'animated-button-styles';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = animationStyles;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Keep styles for other components
    };
  }, []);

  return null;
};

/**
 * Particle effect for accent buttons
 */
const ParticleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (!isActive) {return;}

    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      };
      setParticles((prev) => [...prev.slice(-5), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 2000);
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <>
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.left}%`,
            bottom: '0',
            width: '6px',
            height: '6px',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            borderRadius: '50%',
            animation: 'particle-float 2s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  );
};

// ============================================================================
// Loading Spinner Component
// ============================================================================

const LoadingSpinner: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const dimensions = size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px';
  
  return (
    <svg
      style={{
        width: dimensions,
        height: dimensions,
        animation: 'spin 1s linear infinite',
      }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ opacity: 0.3 }}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

// ============================================================================
// Main Animated Button Component
// ============================================================================

/**
 * AnimatedButton - A modern, beautiful animated button with multiple variants
 *
 * Features:
 * - Primary variant: Bold, attention-grabbing with shimmer effect (for "convert" goal)
 * - Secondary variant: Clean, professional with subtle animations (for "inform" goal)
 * - Accent variant: Playful, interactive with rainbow/particle effects (for "engage" goal)
 * - Full accessibility support (keyboard navigation, screen readers, reduced motion)
 * - Smooth animations (300-500ms)
 * - Hover and click feedback
 * - Responsive design
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      variant = 'primary',
      goal,
      children,
      isLoading = false,
      icon,
      trailingIcon,
      size = 'md',
      disableAnimations = false,
      className = '',
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    const shouldAnimate = !disableAnimations && !prefersReducedMotion && !isLoading;

    // Handle click
    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (disabled || isLoading) {
        return;
      }
      onClick?.(e);
    }, [onClick, disabled, isLoading]);

    // Size styles
    const sizeStyles = {
      sm: { padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '36px' },
      md: { padding: '0.75rem 1.5rem', fontSize: '1rem', minHeight: '44px' },
      lg: { padding: '1rem 2rem', fontSize: '1.125rem', minHeight: '52px' },
    };

    // Base styles
    const baseStyles: React.CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      border: 'none',
      outline: 'none',
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      fontWeight: 600,
      fontFamily: 'inherit',
      overflow: 'hidden',
      isolation: 'isolate',
      WebkitTapHighlightColor: 'transparent',
      ...sizeStyles[size],
    };

    // Variant-specific styles
    const getVariantStyles = (): React.CSSProperties => {
      if (variant === 'primary') {
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
          color: 'white',
          borderRadius: '0.75rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed ? 'scale(0.97)' : isHovered && shouldAnimate ? 'translateY(-2px) scale(1.02)' : 'scale(1)',
          boxShadow: isHovered && shouldAnimate
            ? '0 8px 25px 0 rgba(59, 130, 246, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.1)'
            : isPressed
            ? '0 2px 4px rgba(59, 130, 246, 0.2)'
            : '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
        };
      }

      if (variant === 'secondary') {
        const secondaryStyles: React.CSSProperties = {
          ...baseStyles,
          background: 'transparent',
          color: '#4b5563',
          borderRadius: '0.5rem',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: '#e5e7eb',
          borderRightWidth: '2px',
          borderRightStyle: 'solid',
          borderRightColor: '#e5e7eb',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: '#e5e7eb',
          borderLeftWidth: '2px',
          borderLeftStyle: 'solid',
          borderLeftColor: '#e5e7eb',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isPressed ? 'scale(0.98)' : isHovered && shouldAnimate ? 'translateY(-1px)' : 'scale(1)',
        };

        if (isHovered && shouldAnimate) {
          secondaryStyles.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
          secondaryStyles.borderTopColor = '#3b82f6';
          secondaryStyles.borderRightColor = '#3b82f6';
          secondaryStyles.borderBottomColor = '#3b82f6';
          secondaryStyles.borderLeftColor = '#3b82f6';
          secondaryStyles.color = '#1f2937';
          secondaryStyles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }

        return secondaryStyles;
      }

      // accent variant
      const accentStyles: React.CSSProperties = {
        ...baseStyles,
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
        color: 'white',
        borderRadius: '1rem',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isPressed
          ? 'scale(0.95)'
          : isHovered && shouldAnimate
          ? 'translateY(-4px) scale(1.03) rotate(-1deg)'
          : 'scale(1)',
        boxShadow: shouldAnimate
          ? '0 4px 20px 0 rgba(168, 85, 247, 0.4)'
          : '0 2px 8px rgba(168, 85, 247, 0.3)',
      };

      if (isHovered && shouldAnimate) {
        accentStyles.animation = 'rainbow-glow 2s ease infinite';
      }

      return accentStyles;
    };

    const variantStyles = getVariantStyles();

    // Apply disabled state
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (disabled || isLoading) {
      variantStyles.opacity = 0.6;
      variantStyles.cursor = 'not-allowed';
      variantStyles.transform = 'none';
      variantStyles.animation = 'none';
    }

    // Get shimmer overlay for primary variant
    const renderShimmerOverlay = () => {
      if (variant !== 'primary' || !shouldAnimate || !isHovered) {return null;}

      return (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            backgroundSize: '200% 100%',
            backgroundPosition: '0% 50%',
            animation: 'shimmer 1.5s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      );
    };

    // Get rainbow border for accent variant
    const renderRainbowBorder = () => {
      if (variant !== 'accent' || !shouldAnimate) {return null;}

      return (
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            backgroundImage: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ec4899, #ef4444)',
            backgroundSize: '400% 400%',
            backgroundPosition: '0% 50%',
            borderRadius: '1.125rem',
            zIndex: -1,
            animation: isHovered ? 'rainbow-border 3s ease infinite' : 'none',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      );
    };

    // Get text gradient style for accent variant
    const getTextGradientStyle = (): React.CSSProperties | undefined => {
      if (variant !== 'accent' || !shouldAnimate) {return undefined;}

      return {
        backgroundImage: isHovered
          ? 'linear-gradient(90deg, #fff, #fde68a, #fff)'
          : 'none',
        backgroundSize: '200% auto',
        backgroundPosition: '0% 50%',
        WebkitBackgroundClip: isHovered ? 'text' : 'unset',
        WebkitTextFillColor: isHovered ? 'transparent' : 'unset',
        animation: isHovered ? 'text-gradient 1.5s linear infinite' : 'none',
        transition: 'all 0.3s ease',
      };
    };

    return (
      <>
        <AnimationStylesInjector />
        <button
          ref={ref}
          style={variantStyles}
          className={`animated-button animated-button--${variant} ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsPressed(false);
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={handleClick}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={disabled || isLoading}
          aria-busy={isLoading}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          aria-disabled={disabled || isLoading}
          data-variant={variant}
          data-goal={goal}
          data-hovered={isHovered}
          data-pressed={isPressed}
          {...props}
        >
          {/* Background effects */}
          {renderShimmerOverlay()}
          {renderRainbowBorder()}

          {/* Particle effect for accent */}
          {variant === 'accent' && isHovered && shouldAnimate && <ParticleEffect isActive={true} />}

          {/* Content */}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            position: 'relative',
            zIndex: 2,
            ...getTextGradientStyle(),
          }}>
            {isLoading ? (
              <LoadingSpinner size={size} />
            ) : (
              <>
                {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
                <span>{children}</span>
                {trailingIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{trailingIcon}</span>}
              </>
            )}
          </span>

          {/* Focus ring */}
          {isFocused && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                border: '2px solid currentColor',
                borderRadius: variant === 'accent' ? '1.125rem' : variant === 'primary' ? '0.875rem' : '0.625rem',
                pointerEvents: 'none',
                animation: 'pulse-soft 1.5s ease-in-out infinite',
              }}
            />
          )}
        </button>
      </>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// ============================================================================
// Specialized Button Variants
// ============================================================================

/**
 * PrimaryAnimatedButton - Bold, attention-grabbing button for "convert" goals
 * Features shimmer effect, strong shadows, and confident animations
 */
export const PrimaryAnimatedButton: React.FC<AnimatedButtonProps> = (props) => (
  <AnimatedButton variant="primary" goal="convert" {...props} />
);

/**
 * SecondaryAnimatedButton - Clean, professional button for "inform" goals
 * Features subtle hover effects and minimal styling
 */
export const SecondaryAnimatedButton: React.FC<AnimatedButtonProps> = (props) => (
  <AnimatedButton variant="secondary" goal="inform" {...props} />
);

/**
 * AccentAnimatedButton - Playful, interactive button for "engage" goals
 * Features rainbow effects, particles, and bouncy animations
 */
export const AccentAnimatedButton: React.FC<AnimatedButtonProps> = (props) => (
  <AnimatedButton variant="accent" goal="engage" {...props} />
);

// ============================================================================
// Shimmer Button Component (21st-dev-magic inspired)
// ============================================================================

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  shimmerDirection = 'horizontal',
  shimmerIntensity = 'normal',
  ...props
}) => {
  const intensityOpacity = {
    subtle: 0.1,
    normal: 0.2,
    strong: 0.4,
  };

  return (
    <AnimatedButton {...props}>
      {props.children}
      <style>{`
        .shimmer-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            ${shimmerDirection === 'diagonal' ? '135deg' : '90deg'},
            transparent,
            rgba(255, 255, 255, ${intensityOpacity[shimmerIntensity]}),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </AnimatedButton>
  );
};

// ============================================================================
// Rainbow Button Component (magicuidesign-mcp inspired)
// ============================================================================

export const RainbowButton: React.FC<RainbowButtonProps> = ({
  rainbowSpeed = 'normal',
  rainbowWidth = 3,
  ...props
}) => {
  const speedDuration: Record<string, string> = {
    slow: '4s',
    normal: '2s',
    fast: '1s',
  };

  return (
    <AnimatedButton variant="accent" {...props}>
      {props.children}
      <style>{`
        .rainbow-button::after {
          content: '';
          position: absolute;
          top: -${rainbowWidth}px;
          left: -${rainbowWidth}px;
          right: -${rainbowWidth}px;
          bottom: -${rainbowWidth}px;
          background: linear-gradient(
            90deg,
            #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #ef4444
          );
          background-size: 400% 400%;
          border-radius: inherit;
          z-index: -1;
          animation: rainbow-border ${speedDuration[rainbowSpeed]} ease infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .rainbow-button:hover::after {
          opacity: 1;
        }
      `}</style>
    </AnimatedButton>
  );
};

// ============================================================================
// Blur Fade Button Component (reactbits inspired)
// ============================================================================

export const BlurFadeButton: React.FC<BlurFadeButtonProps> = ({
  blurAmount = 10,
  fadeDirection = 'center',
  ...props
}) => {
  const getFadeTransform = (): string => {
    switch (fadeDirection) {
      case 'up':
        return 'translateY(10px)';
      case 'down':
        return 'translateY(-10px)';
      case 'left':
        return 'translateX(10px)';
      case 'right':
        return 'translateX(-10px)';
      default:
        return 'scale(0.95)';
    }
  };

  return (
    <AnimatedButton {...props}>
      {props.children}
      <style>{`
        .blur-fade-button {
          animation: blur-fade-in 0.5s ease-out forwards;
        }
        .blur-fade-button-enter {
          opacity: 0;
          transform: ${getFadeTransform()};
          filter: blur(${blurAmount}px);
        }
        .blur-fade-button-enter-active {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
          transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
        }
      `}</style>
    </AnimatedButton>
  );
};

// ============================================================================
// Icon Button with Animation
// ============================================================================

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  tooltip,
  size = 'md',
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeStyles = {
    sm: { width: '36px', height: '36px', padding: '0.5rem' },
    md: { width: '44px', height: '44px', padding: '0.75rem' },
    lg: { width: '52px', height: '52px', padding: '1rem' },
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <AnimatedButton
        size={size}
        style={{
          ...sizeStyles[size],
          padding: '0',
          borderRadius: '50%',
        }}
        aria-label={label}
        onMouseEnter={() => {
          if (tooltip) {setShowTooltip(true);}
        }}
        onMouseLeave={() => setShowTooltip(false)}
        {...props}
      >
        {icon}
      </AnimatedButton>
      {tooltip && showTooltip && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-8px)',
            background: '#1f2937',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 10,
            animation: 'blur-fade-in 0.2s ease-out',
          }}
        >
          {tooltip}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '6px solid transparent',
              borderTopColor: '#1f2937',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AnimatedButton;
