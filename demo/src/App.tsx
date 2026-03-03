import React, { useState } from 'react'
import {
  SmartCTA,
  PrimaryAnimatedButton,
  SecondaryAnimatedButton,
  AccentAnimatedButton,
  ShimmerButton,
  RainbowButton,
  BlurFadeButton,
  getBrandVoicePreset,
  validateBrandVoice,
  BRAND_VOICE_PRESETS,
  TONE_PRESETS,
  AUDIENCE_PRESETS
} from '@fluxxis/react'

function App() {
  const [clickCount, setClickCount] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState('tech-startup')
  const [customTone, setCustomTone] = useState('confident-but-warm')
  const [customAudience, setCustomAudience] = useState('founders')
  const [customCTAStyle, setCustomCTAStyle] = useState('direct')

  const handleClick = () => {
    setClickCount(prev => prev + 1)
    console.log('Button clicked!', clickCount + 1)
  }

  // Get current brand voice from preset
  const currentBrandVoice = getBrandVoicePreset(selectedPreset) || {
    tone: customTone as any,
    audience: [customAudience],
    ctaStyle: customCTAStyle as any,
  }

  // Validate current brand voice
  const validation = validateBrandVoice(currentBrandVoice)

  return (
    <div className="container">
      <header>
        <h1>🎨 AI Design System - Complete Test Page</h1>
        <p>Test all components, BrandVoice presets, and AI features</p>
      </header>

      {/* BrandVoice Configuration Section */}
      <div className="section">
        <h2>🎯 BrandVoice Configuration (P1-15)</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Test different BrandVoice presets and custom configurations
        </p>

        <div className="config-panel">
          <div className="config-group">
            <h3>1. Select Industry Preset</h3>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              style={selectStyle}
            >
              {Object.keys(BRAND_VOICE_PRESETS).map(preset => (
                <option key={preset} value={preset}>
                  {preset.replace(/-/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <p style={descriptionStyle}>
              {currentBrandVoice.tone.replace(/-/g, ' ').toUpperCase()} for {currentBrandVoice.audience.join(', ')}
            </p>
          </div>

          <div className="config-group">
            <h3>2. Or Customize Manually</h3>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Tone:</label>
                <select
                  value={customTone}
                  onChange={(e) => setCustomTone(e.target.value)}
                  style={selectStyle}
                >
                  <option value="confident-but-warm">Confident but Warm</option>
                  <option value="playful">Playful</option>
                  <option value="professional">Professional</option>
                  <option value="minimal">Minimal</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="witty">Witty</option>
                  <option value="empathetic">Empathetic</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Audience:</label>
                <input
                  type="text"
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>CTA Style:</label>
                <select
                  value={customCTAStyle}
                  onChange={(e) => setCustomCTAStyle(e.target.value)}
                  style={selectStyle}
                >
                  <option value="direct">Direct</option>
                  <option value="soft">Soft</option>
                  <option value="urgent">Urgent</option>
                  <option value="curious">Curious</option>
                  <option value="benefit-focused">Benefit Focused</option>
                  <option value="question">Question</option>
                  <option value="command">Command</option>
                </select>
              </div>
            </div>
          </div>

          <div className="config-group">
            <h3>3. Validation Status</h3>
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              background: validation.valid ? '#d1fae5' : '#fee2e2',
              color: validation.valid ? '#065f46' : '#991b1b',
            }}>
              {validation.valid ? (
                <strong>✅ Valid BrandVoice Configuration</strong>
              ) : (
                <div>
                  <strong>❌ Invalid Configuration:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1.5rem' }}>
                    {validation.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="config-group">
            <h3>4. Available Presets</h3>
            <div style={presetGridStyle}>
              <div>
                <strong>Industry Presets:</strong>
                <ul style={{ fontSize: '0.875rem' }}>
                  {Object.keys(BRAND_VOICE_PRESETS).map(p => (
                    <li key={p}>{p.replace(/-/g, ' ')}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Tone Presets:</strong>
                <ul style={{ fontSize: '0.875rem' }}>
                  {Object.keys(TONE_PRESETS).map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Audience Presets:</strong>
                <ul style={{ fontSize: '0.875rem' }}>
                  {Object.keys(AUDIENCE_PRESETS).map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SmartCTA with Current BrandVoice */}
      <div className="section">
        <h2>🤖 SmartCTA with Current BrandVoice</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Testing AI copy generation with selected BrandVoice configuration
          <br />
          <strong>Current:</strong> {currentBrandVoice.tone} | {currentBrandVoice.audience.join(', ')} | {currentBrandVoice.ctaStyle}
          <br />
          <strong>Click Count:</strong> {clickCount}
        </p>

        <div className="button-grid">
          {/* Convert Goal */}
          <div className="button-demo">
            <span className="goal-badge goal-convert">Convert</span>
            <h3>Convert Goal</h3>
            <SmartCTA
              goal="convert"
              defaultCopy="Get Started Free"
              pageContext="pricing"
              brandVoice={currentBrandVoice}
              variant="primary"
              onClick={handleClick}
            />
            <code>AI-generated copy with your BrandVoice ✨</code>
          </div>

          {/* Inform Goal */}
          <div className="button-demo">
            <span className="goal-badge goal-inform">Inform</span>
            <h3>Inform Goal</h3>
            <SmartCTA
              goal="inform"
              defaultCopy="Learn More"
              pageContext="demo"
              brandVoice={currentBrandVoice}
              variant="secondary"
              onClick={handleClick}
            />
            <code>AI-generated copy with your BrandVoice ✨</code>
          </div>

          {/* Engage Goal */}
          <div className="button-demo">
            <span className="goal-badge goal-engage">Engage</span>
            <h3>Engage Goal</h3>
            <SmartCTA
              goal="engage"
              defaultCopy="Try It Now"
              pageContext="features"
              brandVoice={currentBrandVoice}
              variant="primary"
              onClick={handleClick}
            />
            <code>AI-generated copy with your BrandVoice ✨</code>
          </div>
        </div>
      </div>

      {/* All Industry Presets Quick Test */}
      <div className="section">
        <h2>🎨 Quick Test: All Industry Presets</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          See how different BrandVoice presets affect copy generation
        </p>

        <div className="button-grid">
          {Object.entries(BRAND_VOICE_PRESETS).slice(0, 4).map(([presetName, preset]) => (
            <div key={presetName} className="button-demo">
              <span className="goal-badge goal-convert">{presetName.replace(/-/g, ' ').toUpperCase()}</span>
              <SmartCTA
                goal="convert"
                defaultCopy="Get Started"
                pageContext="demo"
                brandVoice={preset}
                variant="primary"
                onClick={handleClick}
                size="sm"
              />
              <code style={{ fontSize: '0.7rem' }}>
                {preset.tone} | {preset.audience[0]}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Buttons Section */}
      <div className="section">
        <h2>✨ Animated Button Variants</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Beautiful, modern animated buttons powered by 21st.dev, Magic UI, and ReactBits.
        </p>

        <div className="button-grid">
          <div className="button-demo">
            <h3>Shimmer Button</h3>
            <ShimmerButton onClick={handleClick}>
              Click Me
            </ShimmerButton>
            <p>Shimmer effect on hover</p>
          </div>

          <div className="button-demo">
            <h3>Rainbow Button</h3>
            <RainbowButton onClick={handleClick}>
              Rainbow Magic
            </RainbowButton>
            <p>Animated rainbow border</p>
          </div>

          <div className="button-demo">
            <h3>Blur Fade Button</h3>
            <BlurFadeButton onClick={handleClick}>
              Fade In
            </BlurFadeButton>
            <p>Blur fade entrance animation</p>
          </div>
        </div>
      </div>

      {/* Goal-Based Animated Buttons */}
      <div className="section">
        <h2>🎯 Goal-Based Animated Buttons</h2>
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
        <h2>📏 Size Variants</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Three sizes available: small (36px), medium (44px), large (52px).
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

      {/* Loading & Disabled States */}
      <div className="section">
        <h2>⚙️ Component States</h2>
        <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
          Built-in loading and disabled states.
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

// Styles
const selectStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid #d1d5db',
  background: 'white',
  minWidth: '200px',
  marginBottom: '0.5rem',
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid #d1d5db',
  width: '100%',
  marginBottom: '0.5rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.25rem',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: '#374151',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
}

const presetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem',
  background: '#f9fafb',
  padding: '1rem',
  borderRadius: '0.5rem',
}

const descriptionStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: '0.5rem',
  fontStyle: 'italic',
}

export default App
