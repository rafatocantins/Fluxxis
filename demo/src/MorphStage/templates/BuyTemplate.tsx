import React from 'react'
import { PRODUCTS } from '../products'
import type { Product } from '../types'

interface BuyTemplateProps {
  themeColor: string
  buyIndex: number
  buyQty: number
  buyColor: number
  onIndexChange: (index: number) => void
  onQtyChange: (qty: number) => void
  onColorChange: (color: number) => void
}

const BuyTemplate: React.FC<BuyTemplateProps> = ({
  themeColor,
  buyIndex,
  buyQty,
  buyColor,
  onIndexChange,
  onQtyChange,
  onColorChange,
}) => {
  const product: Product = PRODUCTS[buyIndex]
  const isFirst = buyIndex === 0
  const isLast = buyIndex === PRODUCTS.length - 1

  const goPrev = () => {
    if (buyIndex > 0) {
      onIndexChange(buyIndex - 1)
      onQtyChange(1)
      onColorChange(0)
    }
  }

  const goNext = () => {
    if (buyIndex < PRODUCTS.length - 1) {
      onIndexChange(buyIndex + 1)
      onQtyChange(1)
      onColorChange(0)
    }
  }

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
                className={`buy-thumb${i === buyColor ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => onColorChange(i)}
                role="radio"
                aria-checked={i === buyColor}
                aria-label={`Color variant ${i + 1}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onColorChange(i)
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
                  className={`buy-swatch${i === buyColor ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => onColorChange(i)}
                  role="radio"
                  aria-checked={i === buyColor}
                  aria-label={`Color ${i + 1}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onColorChange(i)
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
              onClick={() => onQtyChange(Math.max(1, buyQty - 1))}
              disabled={buyQty <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="buy-qty-value" aria-live="polite">
              {buyQty}
            </span>
            <button
              className="buy-qty-btn"
              onClick={() => onQtyChange(Math.min(99, buyQty + 1))}
              disabled={buyQty >= 99}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* CTA */}
          <button
            className="buy-cta"
            style={{ background: themeColor }}
            aria-label={`Add ${product.name} to cart for ${(product.price * buyQty).toFixed(2)}${product.currency}`}
          >
            🛒 Add to Cart — {(product.price * buyQty).toFixed(2)}
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
              {buyIndex + 1} / {PRODUCTS.length}
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
