import React from 'react'

const PriceChart = ({ priceData, color = '#52b788' }) => {
  if (!priceData || priceData.length === 0) return null

  const width = 500
  const height = 150
  const padding = 20

  const maxVal = Math.max(...priceData)
  const minVal = Math.min(...priceData)
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal

  const points = priceData.map((val, index) => {
    const x = padding + (index * (width - 2 * padding)) / (priceData.length - 1)
    const y = height - padding - ((val - minVal) * (height - 2 * padding)) / range
    return { x, y, val }
  })

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaData = `
    ${pathData} 
    L ${points[points.length - 1].x} ${height - padding} 
    L ${points[0].x} ${height - padding} Z
  `

  return (
    <div style={{ marginTop: '16px', background: 'rgba(255, 255, 255, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(82, 183, 136, 0.1)' }}>
      <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#555' }}>
        7-Day Price Trend (per quintal)
      </p>
      
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(0,0,0,0.05)" strokeDasharray="4" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(0,0,0,0.05)" strokeDasharray="4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(0,0,0,0.05)" strokeDasharray="4" />

        <path d={areaData} fill="url(#chartGradient)" />

        <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
            {(i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) && (
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="10" fill="#555" fontWeight="bold">
                ₹{Math.round(p.val)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default PriceChart
