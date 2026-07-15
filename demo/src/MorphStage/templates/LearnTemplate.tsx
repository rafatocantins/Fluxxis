import React from 'react'
import { PRODUCTS } from '../products'

interface LearnTemplateProps {
  themeColor: string
  learnOpen: number
  learnStep: number
  onLearnOpenChange: (index: number) => void
  onLearnStepChange: (step: number) => void
}

const LearnTemplate: React.FC<LearnTemplateProps> = ({
  themeColor,
  learnOpen,
  learnStep,
  onLearnOpenChange,
  onLearnStepChange,
}) => {
  const product = PRODUCTS[learnOpen]
  const steps = product.learnSteps
  const current = steps[learnStep]
  if (!current) return null
  const isFirst = learnStep === 0
  const isLast = learnStep === steps.length - 1

  return (
    <div className="morph-learn">
      <div className="learn-container">
        {/* Product selector */}
        <div className="learn-product-selector" style={{ marginBottom: 16 }}>
          {PRODUCTS.map((p, i) => (
            <button
              key={p.id}
              className={`browse-chip${i === learnOpen ? ' active' : ''}`}
              onClick={() => {
                onLearnOpenChange(i)
                onLearnStepChange(0)
              }}
              style={
                i === learnOpen
                  ? { background: themeColor, borderColor: themeColor, color: '#0a0a0f' }
                  : undefined
              }
              aria-pressed={i === learnOpen}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Progress indicator */}
        <div
          className="learn-progress"
          role="progressbar"
          aria-valuenow={learnStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Step ${learnStep + 1} of ${steps.length}`}
        >
          {steps.map((_, i) => {
            let cls = ''
            if (i < learnStep) cls = 'done'
            else if (i === learnStep) cls = 'active'
            return (
              <div className="learn-progress-step" key={i}>
                {i > 0 && (
                  <div className={`learn-step-line${i <= learnStep ? ' done' : ''}`} />
                )}
                <div
                  className={`learn-step-dot ${cls}`}
                  aria-current={i === learnStep ? 'step' : undefined}
                >
                  {i + 1}
                </div>
              </div>
            )
          })}
        </div>

        {/* Content */}
        <div className="learn-content">
          <div
            className="learn-image"
            style={{ background: product.imageGradient }}
            role="img"
            aria-label={product.name}
          >
            <span className="learn-image-icon">{product.imageIcon}</span>
          </div>
          <div className="learn-text">
            <h3 className="learn-step-title" style={{ color: themeColor }}>
              {current.title}
            </h3>
            <p className="learn-step-body">{current.body}</p>
          </div>
        </div>

        {/* Nav */}
        <div className="learn-nav">
          <button
            className="learn-nav-btn"
            onClick={() => {
              if (learnStep > 0) onLearnStepChange(learnStep - 1)
            }}
            disabled={isFirst}
            aria-label="Previous step"
          >
            ← Back
          </button>
          <span className="learn-nav-counter">
            {learnStep + 1} of {steps.length}
          </span>
          <button
            className={`learn-nav-btn primary`}
            style={{ background: themeColor, borderColor: themeColor, color: '#fff' }}
            onClick={() => {
              if (learnStep < steps.length - 1) onLearnStepChange(learnStep + 1)
            }}
            disabled={isLast}
            aria-label="Next step"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(LearnTemplate)
