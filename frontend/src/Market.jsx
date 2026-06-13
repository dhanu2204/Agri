import React from 'react'
import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageContext' 
import PriceChart from './PriceChart'

const fallbackMandiData = [
  { commodity: "Rice (Basmati)", market: "Karnal", state: "Haryana", min_price: "3500", max_price: "4200", modal_price: "3900", arrival_date: "13/06/2026" },
  { commodity: "Wheat", market: "Khanna", state: "Punjab", min_price: "2100", max_price: "2350", modal_price: "2275", arrival_date: "13/06/2026" },
  { commodity: "Onion", market: "Lasalgaon", state: "Maharashtra", min_price: "1200", max_price: "1800", modal_price: "1550", arrival_date: "13/06/2026" },
  { commodity: "Tomato", market: "Kolar", state: "Karnataka", min_price: "800", max_price: "1500", modal_price: "1100", arrival_date: "13/06/2026" },
  { commodity: "Potato", market: "Agra", state: "Uttar Pradesh", min_price: "950", max_price: "1400", modal_price: "1200", arrival_date: "13/06/2026" },
  { commodity: "Cotton", market: "Rajkot", state: "Gujarat", min_price: "6000", max_price: "7500", modal_price: "6800", arrival_date: "13/06/2026" },
  { commodity: "Turmeric", market: "Erode", state: "Tamil Nadu", min_price: "7200", max_price: "8500", modal_price: "7900", arrival_date: "13/06/2026" }
]

const Market = () => {
  const [crops, setCrops] = useState("")
  const [marketData, setMarketData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFallback, setIsFallback] = useState(false)
  
  const[selectedCropIndex, setSelectedCropIndex] = useState(null)
  const { t } = useLanguage()

  const api = import.meta.env.VITE_DATA_GOV_API_KEY

  useEffect(() => {
    const fetchMarketRates = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 seconds timeout

      try {
        const response = await fetch(
          `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${api}&format=json&limit=100`,
          { signal: controller.signal }
        )
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error('Failed to fetch market rates')
        }
        const data = await response.json()
        setMarketData(data.records || [])
        setIsFallback(false)
        setLoading(false)
      } catch (err) {
        clearTimeout(timeoutId)
        console.error("Gov API fetch failed. Using fallback mandi rates data:", err)
        setMarketData(fallbackMandiData)
        setIsFallback(true)
        setLoading(false)
      }
    }
    fetchMarketRates()
  }, [])
  

   const generatePriceTrend = (min, max) => {
    const minPrice = parseFloat(min) || 1000
    const maxPrice = parseFloat(max) || 1200
    const diff = maxPrice - minPrice || 200
    return [
      minPrice,
      minPrice + diff * 0.2 + (Math.random() - 0.5) * 50,
      minPrice + diff * 0.45 + (Math.random() - 0.5) * 50,
      minPrice + diff * 0.35 + (Math.random() - 0.5) * 50,
      minPrice + diff * 0.7 + (Math.random() - 0.5) * 50,
      minPrice + diff * 0.85 + (Math.random() - 0.5) * 50,
      maxPrice
    ]
  }

  const handleCardClick = (index) => {
    setSelectedCropIndex(selectedCropIndex === index ? null : index)
  }

  const filteredCrops = marketData.filter(item => 
    item.commodity.toLowerCase().includes(crops.toLowerCase()) ||
    item.market.toLowerCase().includes(crops.toLowerCase()) ||
    item.state.toLowerCase().includes(crops.toLowerCase())
  )

   return (
    <div style={{ padding: '20px' }}>
      <h1>{t('mandiRates')}</h1>
      
      {isFallback && (
        <div style={{
          background: 'rgba(82, 183, 136, 0.1)',
          border: '1.5px solid rgba(82, 183, 136, 0.25)',
          color: 'var(--text-h)',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <span>💡</span> {t('fallbackNotice')}
        </div>
      )}

      <input 
        type="text" 
        placeholder={t('searchCrop')} 
        value={crops} 
        onChange={(e) => setCrops(e.target.value)} 
        style={{ padding: '8px', width: '250px', marginBottom: '20px' }}
      />
      {loading && <p>{t('loading')}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        {filteredCrops.map((crop, index) => (
          <div 
            key={index} 
            onClick={() => handleCardClick(index)}
            style={{ 
              border: '1px solid #ddd', 
              margin: '10px 0', 
              padding: '16px', 
              borderRadius: '12px', 
              textAlign: 'left',
              cursor: 'pointer',
              background: selectedCropIndex === index ? '#f2f9f5' : '#f9f9f9',
              borderColor: selectedCropIndex === index ? '#52b788' : '#ddd',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{crop.commodity}</h3>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {selectedCropIndex === index ? '▲ Click to close' : '▼ Click for trend'}
              </span>
            </div>
            
            <p><strong>{t('market')}: </strong> {crop.market}</p>
            <p><strong>{t('minRate')}: </strong> ₹{crop.min_price} / quintal</p>
            <p><strong>{t('maxRate')}: </strong> ₹{crop.max_price} / quintal</p>
            <p><strong>{t('modalRate')}: </strong> ₹{crop.modal_price} / quintal</p>
            <p><strong>{t('date')}: </strong> {crop.arrival_date}</p>
            {selectedCropIndex === index && (
              <PriceChart priceData={generatePriceTrend(crop.min_price, crop.max_price)} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Market