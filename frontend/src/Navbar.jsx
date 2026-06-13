import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import { useLanguage } from './LanguageContext'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { language, setLanguage, t } = useLanguage()

    const hideNavbarPaths = ['/', '/signup', '/register']
    if (hideNavbarPaths.includes(location.pathname)) {
        return null
    }

    const handleLogout = () => {
        // Clear login session details
        localStorage.removeItem('userEmail')
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
                <span className="logo-icon">🌿</span> AgriGrow
            </div>
            
            <div className="navbar-links">
                <button 
                    className={`nav-btn ${location.pathname === '/dashboard' ? 'active-nav-btn' : ''}`} 
                    onClick={() => navigate("/dashboard")}
                >
                    {t('dashboard')}
                </button>
                <button 
                    className={`nav-btn ${location.pathname === '/market' ? 'active-nav-btn' : ''}`} 
                    onClick={() => navigate("/market")}
                >
                    {t('market')}
                </button>
                <button 
                    className={`nav-btn ${location.pathname === '/voiceassistant' ? 'active-nav-btn' : ''}`} 
                    onClick={() => navigate("/voiceassistant")}
                >
                    {t('voiceAssistant')}
                </button>
                <button 
                    className={`nav-btn ${location.pathname === '/calculator' ? 'active-nav-btn' : ''}`} 
                    onClick={() => navigate("/calculator")}
                >
                    {t('calculator')}
                </button>
            </div>
            
            <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="dropdown">
                    <select name="language" className="lang-select" onChange={(e)=>setLanguage(e.target.value)} value={language}>
                        <option value="English">English</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Hindi">Hindi</option>
                    </select>
                </div>
                
                <button className="logout-btn" onClick={handleLogout}>
                    🔑 {t('logout')}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
