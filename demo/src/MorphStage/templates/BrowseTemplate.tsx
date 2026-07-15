import React, { useCallback, useMemo, useState } from 'react'
import type { Product } from '../types'
import { ALL_CATEGORIES } from '../types'
import { PRODUCTS } from '../products'

interface BrowseTemplateProps {
  themeColor: string
}

const BrowseTemplate: React.FC<BrowseTemplateProps> = ({ themeColor }) => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const filtered = useMemo<Product[]>(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = !category || p.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [],
  )

  const handleCategoryClick = useCallback((cat: string | null) => {
    setCategory(cat)
  }, [])

  return (
    <div className="morph-browse">
      {/* Search + Filters */}
      <div className="browse-filters">
        <input
          type="search"
          className="browse-search"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          aria-label="Search products"
        />
        <div className="browse-chips" role="group" aria-label="Filter by category">
          <button
            className={`browse-chip${!category ? ' active' : ''}`}
            onClick={() => handleCategoryClick(null)}
            aria-pressed={!category}
            style={!category ? { background: themeColor, borderColor: themeColor, color: '#0a0a0f' } : undefined}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`browse-chip${category === cat ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
              aria-pressed={category === cat}
              style={
                category === cat
                  ? { background: themeColor, borderColor: themeColor, color: '#0a0a0f' }
                  : undefined
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <div className="browse-empty" role="status">
          <div className="browse-empty-icon">📭</div>
          <p>No products match your filters.</p>
        </div>
      ) : (
        <div className="browse-grid" role="list" aria-label="Products">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="browse-card"
              role="listitem"
              tabIndex={0}
              aria-label={`${p.name}, ${p.price}${p.currency}`}
            >
              <div className="browse-card-image" style={{ background: p.imageGradient }}>
                <span className="browse-card-icon">{p.imageIcon}</span>
                <span className="browse-card-badge">{p.category}</span>
              </div>
              <div className="browse-card-name">{p.name}</div>
              <div className="browse-card-price" style={{ color: themeColor }}>
                {p.price}
                {p.currency}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(BrowseTemplate)
