"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

// Constants
const BRANDS = ["TKC", "M&H"];
const AVAILABILITY_OPTIONS = [
  { id: 1, isAvailable: true, text: "Available", icon: "✓" },
  { id: 2, isAvailable: false, text: "Out of Stock", icon: "✗" },
];

export default function ShopFilter({ setProducts }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
  
  // State management
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState([]);

  // Memoized filtered products count for performance
  const productCounts = useMemo(() => {
    const availableCounts = {};
    const brandCounts = {};
    
    AVAILABILITY_OPTIONS.forEach(availability => {
      availableCounts[availability.isAvailable] = allProducts.filter(
        p => p.isAvailable === availability.isAvailable
      ).length;
    });
    
    BRANDS.forEach(brand => {
      brandCounts[brand] = allProducts.filter(p => p.brand === brand).length;
    });
    
    return { availableCounts, brandCounts };
  }, [allProducts]);

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/product-categories`),
      ]);

      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Network response was not ok');
      }

      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
      ]);

      const productsWithMetadata = productsData.map(product => ({
        ...product,
        brand: product.brand || "TKC", // Default brand if not provided
        isAvailable: product.stock_quantity > 0,
      }));

      setAllProducts(productsWithMetadata);
      setProducts(productsWithMetadata);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load filter data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, setProducts]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter handlers with improved logic
  const handleBrandToggle = useCallback((brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  }, []);

  const handleAvailabilityToggle = useCallback((availability) => {
    setSelectedAvailabilities(prev =>
      prev.includes(availability)
        ? prev.filter(a => a !== availability)
        : [...prev, availability]
    );
  }, []);

  // Apply filters with optimized logic
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }

    // Apply availability filter
    if (selectedAvailabilities.length > 0) {
      const selectedAvailabilityStates = selectedAvailabilities.map(a => a.isAvailable);
      filtered = filtered.filter(product =>
        selectedAvailabilityStates.includes(product.isAvailable)
      );
    }

    setProducts(filtered);
  }, [selectedBrands, selectedAvailabilities, allProducts, setProducts]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedAvailabilities([]);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = selectedBrands.length > 0 || selectedAvailabilities.length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
        <div className="canvas-wrapper">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            padding: '2rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
        <div className="canvas-wrapper">
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            margin: '1rem',
            borderRadius: '8px'
          }}>
            {error}
            <button 
              onClick={fetchData}
              style={{
                display: 'block',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #dc2626',
                color: '#dc2626',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="offcanvas offcanvas-start canvas-filter" id="filterShop">
      <div className="canvas-wrapper">
        {/* Enhanced Header */}
        <header style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '20px' }}>🔍</span>
            <span style={{ fontWeight: '600', fontSize: '16px' }}>Filters</span>
            {hasActiveFilters && (
              <span style={{
                background: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}>
                {selectedBrands.length + selectedAvailabilities.length}
              </span>
            )}
          </div>
          <button
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </header>

        <div style={{ padding: 0, height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
          {/* Categories Section */}
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div
              style={{
                padding: '1rem',
                cursor: 'pointer',
                background: '#f9fafb',
                fontWeight: '500',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>📂 Product Categories</span>
              <span>⌄</span>
            </div>
            <div>
              <ul style={{ 
                listStyle: 'none', 
                margin: 0, 
                padding: '1rem',
                paddingTop: 0 
              }}>
                {categories.map((category) => (
                  <li key={category.category_id} style={{ marginBottom: '0.5rem' }}>
                    <Link 
                      href={`/shop-category/${category.category_id}`}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        color: '#374151',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li style={{ 
                    color: '#6b7280', 
                    fontStyle: 'italic',
                    padding: '0.5rem'
                  }}>
                    No categories available
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Filters Section */}
          <div>
            {/* Availability Filter */}
            <div style={{ borderBottom: '1px solid #e5e7eb' }}>
              <div
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  background: '#f9fafb',
                  fontWeight: '500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>📦 Availability</span>
                <span>⌄</span>
              </div>
              <div>
                <ul style={{ 
                  listStyle: 'none', 
                  margin: 0, 
                  padding: '1rem',
                  paddingTop: 0 
                }}>
                  {AVAILABILITY_OPTIONS.map((availability) => (
                    <li
                      key={availability.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleAvailabilityToggle(availability)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAvailabilities.includes(availability)}
                        onChange={() => {}} // Handled by parent onClick
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <label style={{
                        flex: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{
                            color: availability.isAvailable ? '#10b981' : '#ef4444'
                          }}>
                            {availability.icon}
                          </span>
                          <span>{availability.text}</span>
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                          ({productCounts.availableCounts[availability.isAvailable] || 0})
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <div
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  background: '#f9fafb',
                  fontWeight: '500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>🏷️ Brand</span>
                <span>⌄</span>
              </div>
              <div>
                <ul style={{ 
                  listStyle: 'none', 
                  margin: 0, 
                  padding: '1rem',
                  paddingTop: 0 
                }}>
                  {BRANDS.map((brand) => (
                    <li
                      key={brand}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleBrandToggle(brand)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => {}} // Handled by parent onClick
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <label style={{
                        flex: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontWeight: '500' }}>{brand}</span>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                          ({productCounts.brandCounts[brand] || 0})
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Clear Filter Button */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            background: 'white',
            position: 'sticky',
            bottom: 0
          }}>
            <button
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: hasActiveFilters 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : '#e5e7eb',
                color: hasActiveFilters ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              🗑️ Clear All Filters
              {hasActiveFilters && (
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {selectedBrands.length + selectedAvailabilities.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}