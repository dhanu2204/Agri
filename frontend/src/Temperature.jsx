import React, { useState, useEffect } from 'react'
import './Temperature.css'
import { useLanguage } from './LanguageContext'

const Temperature = () => {
    const [cityName, setCityName] = useState('Locating...')
    const [error, setError] = useState(null)
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // 1. Storage drawers for the AI Advisory text and loading state
    const [advisory, setAdvisory] = useState({ doText: '', dontText: '' })
    const [advisoryLoading, setAdvisoryLoading] = useState(false)

    const { language, t } = useLanguage()

    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
    const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY

    const fetchAIAdvisory = async (weatherData) => {
      if (!SARVAM_API_KEY) return

      setAdvisoryLoading(true)
      try {
        const response = await fetch("/api-sarvam/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": SARVAM_API_KEY
          },
          body: JSON.stringify({
            model: "sarvam-30b",
            temperature: 0.1, // lower temperature prevents the AI from looping/rambling
            messages: [
              {
                role: "user",
                content: `You are an agricultural expert. Based on the weather details provided, write exactly one DO (thing to do) and one DONT (thing to avoid) for farmers. You must output exactly two lines, starting with the prefixes 'DO:' and 'DONT:' respectively in English, but write the advice details in the language: ${language}. Keep the advice brief, clear, and complete under one sentence.
                
Weather details: Location: ${weatherData.name}, Temp: ${weatherData.main.temp}°C, Humidity: ${weatherData.main.humidity}%, Wind: ${weatherData.wind.speed} m/s, Description: ${weatherData.weather[0].description}.`
              }
            ]
          })
        })

        if (!response.ok) {
          throw new Error("Failed to load AI advisory")
        }

        const data = await response.json()
        
        // Check both content and reasoning_content to support thinking models
        const replyText = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning_content || null
        
        if (!replyText) {
          throw new Error("AI returned empty content. Server Response: " + JSON.stringify(data))
        }

        // Reverse the lines list to search from the bottom up. 
        // This extracts the final, most refined answer from the reasoning process.
        const lines = replyText.split('\n')
        const doLine = [...lines].reverse().find(l => l.toUpperCase().trim().startsWith('DO:'))?.replace(/DO:/i, '').trim() || ''
        const dontLine = [...lines].reverse().find(l => l.toUpperCase().trim().startsWith('DONT:'))?.replace(/DONT:/i, '').trim() || ''

        setAdvisory({ doText: doLine, dontText: dontLine })
      } catch (err) {
        console.error(err)
        setAdvisory({ 
          doText: 'Failed to generate advice. ' + err.message, 
          dontText: 'Failed to generate advice. ' + err.message 
        })
      } finally {
        setAdvisoryLoading(false)
      }
    }

    const fetchWeatherByCity = async (city) => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`
        )
        if (!response.ok) {
          throw new Error('City not found')
        }
        const data = await response.json()
        setWeather(data)
        setCityName(data.name)
        setLoading(false)
        fetchAIAdvisory(data)
      } catch (err) {
        setError(err.message || "Failed to fetch weather data")
        setLoading(false)
      }
    }

    const handleSearchSubmit = (e) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        fetchWeatherByCity(searchQuery.trim())
      }
    }

    useEffect(() => {
        let isCancelled = false;
        let timeoutId = setTimeout(() => {
          if (!isCancelled) {
            console.warn("Geolocation permission prompt timed out. Falling back to Bengaluru.");
            fetchWeatherByCity('Bengaluru');
          }
        }, 3000); // 3 seconds timeout for geolocation prompt/response

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              clearTimeout(timeoutId);
              if (isCancelled) return;
              
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              
              try {
                const response = await fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
                )
                
                if (!response.ok) {
                  throw new Error('Failed to fetch weather data')
                }
                
                const data = await response.json()
                setWeather(data)
                setCityName(data.name)
                setLoading(false)
                
                // Once weather is loaded, trigger the AI request
                fetchAIAdvisory(data)
              } catch (fetchError) {
                fetchWeatherByCity('Bengaluru')
              }
            },
            (err) => {
              clearTimeout(timeoutId);
              if (!isCancelled) {
                fetchWeatherByCity('Bengaluru')
              }
            }
          )
        } else {
          clearTimeout(timeoutId);
          fetchWeatherByCity('Bengaluru')
        }

        return () => {
          isCancelled = true;
          clearTimeout(timeoutId);
        };
    }, [language])

    const getWeatherEmoji = (desc) => {
      if (!desc) return '☀️'
      const lower = desc.toLowerCase()
      if (lower.includes('cloud')) return '☁️'
      if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️'
      if (lower.includes('thunder')) return '⛈️'
      if (lower.includes('snow')) return '❄️'
      if (lower.includes('mist') || lower.includes('fog')) return '🌫️'
      return '☀️'
    }

    return (
        <div className='weather-container'>
          {/* City Search Bar */}
          <form onSubmit={handleSearchSubmit} className="weather-search-form" style={{ display: 'flex', gap: '10px', marginBottom: '25px', width: '100%', maxWidth: '500px', margin: '0 auto 25px auto' }}>
            <input
              type="text"
              placeholder={t('searchCity') || "Search city..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--card-bg)',
                color: 'var(--text-h)',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              className="btn-accent"
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              🔍
            </button>
          </form>

          {error && (
            <div className='weather-error' style={{ margin: '15px auto', maxWidth: '500px', padding: '16px', background: 'rgba(217, 56, 56, 0.1)', color: '#d93838', borderRadius: '12px', border: '1px solid rgba(217, 56, 56, 0.2)', textAlign: 'center', fontWeight: '500' }}>
              <span>⚠️</span> Error: {error}
            </div>
          )}

          {loading ? (
            <div className='weather-loading' style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: 'var(--text)' }}>
              <span style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }}>🔄</span> {t('loading')}
            </div>
          ) : (
            weather && (
              <>
                {/* Main Weather Card */}
                <div className='weather-card'>
                  <div className='weather-header'>
                    <div className='location-container'>
                      <span className="location-icon">📍</span> {t('location')}: {cityName}, {weather?.sys?.country}
                    </div>
                    <div className='weather-main-icon'>
                      {getWeatherEmoji(weather?.weather[0]?.description)}
                    </div>
                  </div>
                  
                  <div className='weather-body'>
                    <div className='temperature-container'>
                      <span className='temp-number'>{Math.round(weather?.main?.temp)}</span>
                      <span className='temp-unit'>°C</span>
                    </div>
                    <div className='description-container'>
                      {t('condition')}: {weather?.weather[0]?.description}
                    </div>
                  </div>

                  <div className='weather-stats'>
                    <div className='stat-item humidity-container'>
                      <span className='stat-icon'>💧</span>
                      <div className='stat-info'>
                        <span className='stat-label'>{t('humidity')}</span>
                        <span className='stat-value'>{weather?.main?.humidity}%</span>
                      </div>
                    </div>
                    <div className='stat-item wind-speed-container'>
                      <span className='stat-icon'>💨</span>
                      <div className='stat-info'>
                        <span className='stat-label'>{t('windSpeed')}</span>
                        <span className='stat-value'>{weather?.wind?.speed} m/s</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic AI Advisory Box */}
                <div className='advisory-container' style={{ marginTop: '24px' }}>
                  <h3 className='advisory-title' style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                    <span>🌾</span> {t('advisoryTitle')}
                  </h3>
                  {advisoryLoading ? (
                    <p style={{ color: 'var(--text)', opacity: 0.7, fontStyle: 'italic', margin: 0 }}>
                      <span style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }}>🔄</span> {t('loadingAdvisory')}
                    </p>
                  ) : (
                    <div className='advisory-sections'>
                      <div className='advisory-section'>
                        <span className='advisory-subtitle subtitle-do'>✅ {t('dos')}</span>
                        <p className='advisory-item'>{advisory.doText || 'No DO advisory generated.'}</p>
                      </div>
                      <div className='advisory-section'>
                        <span className='advisory-subtitle subtitle-dont'>❌ {t('donts')}</span>
                        <p className='advisory-item'>{advisory.dontText || 'No DONT advisory generated.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          )}
        </div>
    )
}

export default Temperature
