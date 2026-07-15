import React, { useCallback, useState } from 'react'
import { PRODUCTS } from '../products'

interface LearnTemplateProps {
  themeColor: string
}

const LearnTemplate: React.FC<LearnTemplateProps> = ({ themeColor }) => {
  // Default to first product's learn steps
  const product = PRODUCTS[0]
  const steps = product.learnSteps
  const [step, setStep] = useState(0)
  const current = steps[step]
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  const goPrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1)
  }, [step])

  const goNext = useCallback(() => {
    if (step < steps.length - 1) setStep((s) => s + 1)
  }, [step, steps.length])

  return (
    <div className="morph-learn">
      <div className="learn-container">
        {/* Progress indicator */}
        <div
          className="learn-progress"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Step ${step + 1} of ${steps.length}`}
        >
          {steps.map((_, i) => {
            let cls = ''
            if (i < step) cls = 'done'
            else if (i === step) cls = 'active'
            return (
              <div className="learn-progress-step" key={i}>
                {i > 0 && (
                  <div className={`learn-step-line${i <= step ? ' done' : ''}`} />
                )}
                <div
                  className={`learn-step-dot ${cls}`}
                  aria-current={i === step ? 'step' : undefined}
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
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Previous step"
          >
            ← Back
          </button>
          <span className="learn-nav-counter">
            {step + 1} of {steps.length}
          </span>
          <button
            className={`learn-nav-btn primary`}
            style={{ background: themeColor, borderColor: themeColor, color: '#fff' }}
            onClick={goNext}
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
