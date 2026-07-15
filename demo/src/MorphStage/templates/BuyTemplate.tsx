import React, { useCallback, useState } from 'react'
import { PRODUCTS } from '../products'
import type { Product } from '../types'

interface BuyTemplateProps {
  themeColor: string
}

const BuyTemplate: React.FC<BuyTemplateProps> = ({ themeColor }) => {
  const [index, setIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState(0)

  const product: Product = PRODUCTS[index]
  const isFirst = index === 0
  const isLast = index === PRODUCTS.length - 1

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1)
      setQty(1)
      setSelectedColor(0)
    }
  }, [index])

  const goNext = useCallback(() => {
    if (index < PRODUCTS.length - 1) {
      setIndex((i) => i + 1)
      setQty(1)
      setSelectedColor(0)
    }
  }, [index])

  const decQty = useCallback(() => setQty((q) => Math.max(1, q - 1)), [])
  const incQty = useCallback(() => setQty((q) => Math.min(99, q + 1)), [])

  return (
    <div className="morph-buy">
      <div className="buy-layout">
        {/* Gallery */}
        <div className="buy-gallery">
          <div
            className="buy-main-image"
            style={{ background: product.imageGradient }}
            role="img"
            aria-label={`${product.name} product image`}
          >
            <span className="buy-main-icon">{product.imageIcon}</span>
          </div>
          <div className="buy-thumbnails">
            {product.colors.map((c, i) => (
              <div
                key={i}
                className={`buy-thumb${i === selectedColor ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => setSelectedColor(i)}
                role="radio"
                aria-checked={i === selectedColor}
                aria-label={`Color variant ${i + 1}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedColor(i)
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="buy-info">
          <h2 className="buy-product-name">{product.name}</h2>
          <div className="buy-rating">
            <span aria-label={`Rating: ${product.rating} out of 5 stars`}>
              {'★'.repeat(Math.floor(product.rating))}
              {product.rating % 1 !== 0 ? '½' : ''} {product.rating}/5
            </span>
          </div>
          <div className="buy-price-large" style={{ color: themeColor }}>
            {product.price}
            {product.currency}
          </div>
          <p className="buy-description">{product.description}</p>

          {/* Color swatches */}
          <div>
            <div className="buy-variants-label">Color</div>
            <div className="buy-color-swatches" role="radiogroup" aria-label="Color selection">
              {product.colors.map((c, i) => (
                <div
                  key={i}
                  className={`buy-swatch${i === selectedColor ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(i)}
                  role="radio"
                  aria-checked={i === selectedColor}
                  aria-label={`Color ${i + 1}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedColor(i)
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="buy-qty-row">
            <button
              className="buy-qty-btn"
              onClick={decQty}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="buy-qty-value" aria-live="polite">
              {qty}
            </span>
            <button
              className="buy-qty-btn"
              onClick={incQty}
              disabled={qty >= 99}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* CTA */}
          <button
            className="buy-cta"
            style={{ background: themeColor }}
            aria-label={`Add ${product.name} to cart for ${(product.price * qty).toFixed(2)}${product.currency}`}
          >
            🛒 Add to Cart — {(product.price * qty).toFixed(2)}
            {product.currency}
          </button>

          {/* Nav */}
          <div className="buy-nav">
            <button
              className="buy-nav-btn"
              onClick={goPrev}
              disabled={isFirst}
              aria-label="Previous product"
            >
              ← Prev
            </button>
            <span className="buy-nav-counter">
              {index + 1} / {PRODUCTS.length}
            </span>
            <button
              className="buy-nav-btn"
              onClick={goNext}
              disabled={isLast}
              aria-label="Next product"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(BuyTemplate)
