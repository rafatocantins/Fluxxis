import React, { useState } from 'react'
import { 
  SmartCTA, 
  PrimaryAnimatedButton, 
  SecondaryAnimatedButton, 
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton
} from '@ia-design-system/react'

function App() {
  const [clickCount, setClickCount] = useState(0)

  const handleClick = () => {
    setClickCount(prev => prev + 1)
    console.log('Button clicked!', clickCount + 1)
  }

  return (
    <div className="container">
      <header>
        <h1>🎨 AI Design System</h1>
        <p>Interactive Component Demo</p>
      </header>

      {/* SmartCTA Section */}
      <div className="section">
        <h2>SmartCTA Components</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Intent-driven buttons that adapt based on user behavior and goals.
          Click count: <strong>{clickCount}</strong>
        </p>
        
        <div className="button-grid">
          {/* Convert Goal */}
          <div className="button-demo">
            <span className="goal-badge goal-convert">Convert</span>
            <h3>Primary (Convert) - AI Copy</h3>
            <SmartCTA
              goal="convert"
              defaultCopy="Get Started Free"
              pageContext="pricing"
              brandVoice={{
                tone: 'confident-but-warm',
                audience: ['founders', 'startups'],
                ctaStyle: 'direct'
              }}
              variant="primary"
              onClick={handleClick}
            />
            <code>With brandVoice + OpenRouter AI ✨</code>
          </div>

          {/* Inform Goal */}
          <div className="button-demo">
            <span className="goal-badge goal-inform">Inform</span>
            <h3>Secondary (Inform)</h3>
            <SmartCTA
              goal="inform"
              defaultCopy="Learn More"
              pageContext="demo"
              variant="secondary"
              onClick={handleClick}
            />
            <code>&lt;SmartCTA goal="inform" /&gt;</code>
          </div>

          {/* Engage Goal */}
          <div className="button-demo">
            <span className="goal-badge goal-engage">Engage</span>
            <h3>Accent (Engage) - AI Copy</h3>
            <SmartCTA
              goal="engage"
              defaultCopy="Try It Now"
              pageContext="features"
              brandVoice={{
                tone: 'playful',
                audience: ['developers'],
                ctaStyle: 'curious'
              }}
              variant="primary"
              onClick={handleClick}
            />
            <code>With brandVoice + OpenRouter AI ✨</code>
          </div>
        </div>
      </div>

      {/* Animated Buttons Section */}
      <div className="section">
        <h2>Animated Button Variants</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Beautiful, modern animated buttons powered by 21st.dev, Magic UI, and ReactBits.
        </p>

        <div className="button-grid">
          {/* Shimmer Button */}
          <div className="button-demo">
            <h3>Shimmer Button</h3>
            <ShimmerButton onClick={handleClick}>
              Click Me
            </ShimmerButton>
            <p>Shimmer effect on hover</p>
          </div>

          {/* Rainbow Button */}
          <div className="button-demo">
            <h3>Rainbow Button</h3>
            <RainbowButton onClick={handleClick}>
              Rainbow Magic
            </RainbowButton>
            <p>Animated rainbow border</p>
          </div>

          {/* Blur Fade Button */}
          <div className="button-demo">
            <h3>Blur Fade Button</h3>
            <BlurFadeButton onClick={handleClick}>
              Fade In
            </BlurFadeButton>
            <p>Blur fade entrance animation</p>
          </div>
        </div>
      </div>

      {/* Primary Animated Buttons */}
      <div className="section">
        <h2>Goal-Based Animated Buttons</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Specialized animated buttons for each goal type.
        </p>

        <div className="button-grid">
          <div className="button-demo">
            <span className="goal-badge goal-convert">Convert</span>
            <h3>Primary Animated</h3>
            <PrimaryAnimatedButton onClick={handleClick}>
              Start Free Trial
            </PrimaryAnimatedButton>
            <p>Shimmer + scale effect</p>
          </div>

          <div className="button-demo">
            <span className="goal-badge goal-inform">Inform</span>
            <h3>Secondary Animated</h3>
            <SecondaryAnimatedButton onClick={handleClick}>
              View Documentation
            </SecondaryAnimatedButton>
            <p>Clean, professional</p>
          </div>

          <div className="button-demo">
            <span className="goal-badge goal-engage">Engage</span>
            <h3>Accent Animated</h3>
            <AccentAnimatedButton onClick={handleClick}>
              ✨ Explore Features
            </AccentAnimatedButton>
            <p>Playful with particles</p>
          </div>
        </div>
      </div>

      {/* Size Variants */}
      <div className="section">
        <h2>Size Variants</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Three sizes available: small, medium, large.
        </p>

        <div className="button-grid">
          <div className="button-demo">
            <h3>Small (36px)</h3>
            <PrimaryAnimatedButton size="sm" onClick={handleClick}>
              Small
            </PrimaryAnimatedButton>
            <code>size="sm"</code>
          </div>

          <div className="button-demo">
            <h3>Medium (44px)</h3>
            <PrimaryAnimatedButton size="md" onClick={handleClick}>
              Medium
            </PrimaryAnimatedButton>
            <code>size="md"</code>
          </div>

          <div className="button-demo">
            <h3>Large (52px)</h3>
            <PrimaryAnimatedButton size="lg" onClick={handleClick}>
              Large
            </PrimaryAnimatedButton>
            <code>size="lg"</code>
          </div>
        </div>
      </div>

      {/* Loading State */}
      <div className="section">
        <h2>Loading State</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Built-in loading states with spinner animation.
        </p>

        <div className="button-grid">
          <div className="button-demo">
            <h3>Loading State</h3>
            <PrimaryAnimatedButton isLoading onClick={handleClick}>
              Loading...
            </PrimaryAnimatedButton>
            <code>isLoading</code>
          </div>

          <div className="button-demo">
            <h3>Disabled State</h3>
            <PrimaryAnimatedButton disabled onClick={handleClick}>
              Disabled
            </PrimaryAnimatedButton>
            <code>disabled</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
