import React from 'react'
import { PRODUCTS } from '../products'
import { FEATURE_LABELS } from '../types'
import type { ProductFeatures } from '../types'

interface CompareTemplateProps {
  themeColor: string
}

const featureKeys = Object.keys(FEATURE_LABELS) as (keyof ProductFeatures)[]

const CompareTemplate: React.FC<CompareTemplateProps> = ({ themeColor }) => {
  return (
    <div className="morph-compare">
      <div className="compare-wrap">
        <table className="compare-table" aria-label="Product comparison table">
          <thead>
            <tr>
              <th>Spec</th>
              {PRODUCTS.map((p) => (
                <th key={p.id}>
                  <div style={{ fontWeight: 700 }}>
                    {p.name.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <div style={{ color: themeColor, fontSize: '0.8rem', fontWeight: 600 }}>
                    {p.price}
                    {p.currency}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr>
              <td>Price</td>
              {PRODUCTS.map((p) => (
                <td key={p.id} className="compare-price-cell" style={{ color: themeColor }}>
                  {p.price}
                  {p.currency}
                </td>
              ))}
            </tr>
            {/* Rating */}
            <tr>
              <td>Rating</td>
              {PRODUCTS.map((p) => (
                <td key={p.id}>★ {p.rating}</td>
              ))}
            </tr>
            {/* Category */}
            <tr>
              <td>Category</td>
              {PRODUCTS.map((p) => (
                <td key={p.id}>{p.category}</td>
              ))}
            </tr>
            {/* Colors */}
            <tr>
              <td>Colors</td>
              {PRODUCTS.map((p) => (
                <td key={p.id}>
                  <div className="compare-colors">
                    {p.colors.map((c, i) => (
                      <span
                        key={i}
                        className="compare-color-dot"
                        style={{ background: c }}
                        aria-label={`Color ${i + 1}`}
                      />
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            {/* Feature rows */}
            {featureKeys.map((fk) => (
              <tr key={fk}>
                <td>{FEATURE_LABELS[fk]}</td>
                {PRODUCTS.map((p) => (
                  <td key={p.id}>
                    {p.features[fk] ? (
                      <span className="compare-check" style={{ color: 'var(--flux-green, #4ADE80)' }}>
                        ✓
                      </span>
                    ) : (
                      <span className="compare-cross" style={{ color: 'var(--flux-red, #F87171)' }}>
                        ✗
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default React.memo(CompareTemplate)
