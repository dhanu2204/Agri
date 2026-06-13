import React, { useState, useEffect } from 'react'
import { useLanguage } from './LanguageContext'
import './VoiceAssistant.css'

const VoiceAssistant = () => {
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("") 
  const [isListening, setIsListening] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false) 
  
  // History states
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  
  const { language, t } = useLanguage()

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY

  // Get logged-in user email
  const userEmail = localStorage.getItem('userEmail') || 'guest@agrigrow.com'

  const getLanguageLocale = (lang) => {
    switch (lang) {
      case 'Kannada':
        return 'kn-IN'
      case 'Hindi':
        return 'hi-IN'
      case 'English':
      default:
        return 'en-US'
    }
  }

  // Fetch voice query history from MongoDB backend
  const fetchQueryHistory = async () => {
    setHistoryLoading(true)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
    try {
      const response = await fetch(`${backendUrl}/api/queries?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      }
    } catch (err) {
      console.error("Failed to load history:", err)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Save new query to backend MongoDB
  const saveQueryToHistory = async (queryText, aiResponse) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
    try {
      await fetch(`${backendUrl}/api/queries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail,
          queryText,
          aiResponse
        })
      })
      // Refresh history list if it is currently visible
      if (showHistory) {
        fetchQueryHistory()
      }
    } catch (err) {
      console.error("Failed to save query history:", err)
    }
  }

  // Fetch the response from the Sarvam AI Chat API
  const getAIAnswer = async (userQuery) => {
    if (!SARVAM_API_KEY) {
      setAiResponse("AI Key is missing in your .env file.")
      return
    }

    setIsAiLoading(true)
    setAiResponse("")

    try {
      const response = await fetch("/api-sarvam/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": SARVAM_API_KEY 
        },
        body: JSON.stringify({
          model: "sarvam-30b",
          messages: [
            {
              role: "system",
              content: `You are AgriBot, a helpful agricultural expert. Keep answers short, simple, and explain farming in 2-3 sentences. Always reply in the language the user asked in (English, Hindi, or Kannada).`
            },
            {
              role: "user",
              content: userQuery
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AgriBot")
      }

      const data = await response.json()
      const botReply = data.choices[0].message.content
      setAiResponse(botReply)
      
      // Speak the AI's reply out loud
      speakText(botReply)

      // Save to database queries table
      saveQueryToHistory(userQuery, botReply)
    } catch (err) {
      console.error(err)
      setAiResponse("Sorry, I couldn't connect to AgriBot. Please try again.")
    } finally {
      setIsAiLoading(false)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel() 

      const utterance = new SpeechSynthesisUtterance(text) 
      
      utterance.lang = getLanguageLocale(language) 
      window.speechSynthesis.speak(utterance)
    }
  } 

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("your browser does not support voice recognition. please try in Google Chrome.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.lang = getLanguageLocale(language) 

    setIsListening(true)
    setTranscript("") 
    recognition.start()

    recognition.onresult = (event) => {
      const voiceresult = event.results[0][0].transcript
      setTranscript(voiceresult)
      getAIAnswer(voiceresult)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  // Load history when panel is toggled open
  useEffect(() => {
    if (showHistory) {
      fetchQueryHistory()
    }
  }, [showHistory])

  // Custom Localized labels for Voice History
  const historyLabels = {
    English: {
      showHist: "Show Search History",
      hideHist: "Hide Search History",
      title: "Your Query Logs",
      empty: "No query history found.",
      time: "Time"
    },
    Kannada: {
      showHist: "ಹುಡುಕಾಟದ ಇತಿಹಾಸ ನೋಡಿ",
      hideHist: "ಇತಿಹಾಸವನ್ನು ಮರೆಮಾಡಿ",
      title: "ನಿಮ್ಮ ಹುಡುಕಾಟದ ವಿವರಗಳು",
      empty: "ಯಾವುದೇ ಇತಿಹಾಸ ಕಂಡುಬಂದಿಲ್ಲ.",
      time: "ಸಮಯ"
    },
    Hindi: {
      showHist: "सर्च इतिहास देखें",
      hideHist: "इतिहास छिपाएं",
      title: "आपका सर्च इतिहास",
      empty: "कोई पुराना इतिहास नहीं मिला।",
      time: "समय"
    }
  }

  const labels = historyLabels[language] || historyLabels['English']

  return (
    <div className="voice-wrapper">
      <div className="voice-card">
        <h2>🎙️ {t('voiceAssistant')}</h2>
        <p style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '15px' }}>
          Speak in {language} to ask farming queries (e.g. crop diseases, fertilizer methods)
        </p>
        
        {/* Speak Button */}
        <button 
          onClick={startListening} 
          disabled={isListening || isAiLoading}
          className={`btn-primary speak-btn ${isListening ? 'listening-active' : ''}`}
        >
          {isListening ? `🎙️ ${t('listening')}` : `🗣️ ${t('speakNow')}`}
        </button>
        
        {/* What you said box */}
        <div className="transcript-box">
          <strong>{t('youSaid')}:</strong> 
          <p className="voice-text">
            {transcript || t('startTalking')}
          </p>
        </div>

        {/* AgriBot Reply box */}
        <div className="reply-box">
          <strong>AgriBot:</strong> 
          {isAiLoading ? (
            <p className="voice-loading">Thinking...</p>
          ) : (
            <p className="voice-reply-text">
              {aiResponse || "Waiting for your question..."}
            </p>
          )}
        </div>

        {/* History Toggle Button */}
        <button 
          className="history-toggle-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? `🙈 ${labels.hideHist}` : `⏳ ${labels.showHist}`}
        </button>
      </div>

      {/* Query History Panel */}
      {showHistory && (
        <div className="history-panel card">
          <h3>⏳ {labels.title}</h3>
          
          {historyLoading ? (
            <div className="history-loading-spinner">Loading logs...</div>
          ) : history.length === 0 ? (
            <p className="history-empty">{labels.empty}</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item._id} className="history-item">
                  <div className="history-item-header">
                    <span className="history-user-icon">👤 {item.email}</span>
                    <span className="history-time-stamp">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="history-item-body">
                    <div className="history-query">
                      <strong>Q:</strong> {item.queryText}
                    </div>
                    <div className="history-response">
                      <strong>A:</strong> {item.aiResponse}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VoiceAssistant
