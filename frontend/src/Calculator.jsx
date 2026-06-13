import React, { useState } from 'react'
import { useLanguage } from './LanguageContext'
import './Calculator.css'

const Calculator = () => {
    const { language, t } = useLanguage()
    const [activeTab, setActiveTab] = useState('fertilizer')

    // Form inputs state
    const [landSize, setLandSize] = useState(1)
    const [crop, setCrop] = useState('wheat')
    
    // Yield/Profit state
    const [expectedYield, setExpectedYield] = useState(15) // quintals per acre
    const [sellingPrice, setSellingPrice] = useState(2275) // Rs per quintal
    const [prodCost, setProdCost] = useState(15000) // Rs per acre

    // Localized Crop Options
    const cropTranslations = {
        English: {
            wheat: "Wheat", paddy: "Paddy (Rice)", maize: "Maize", sugarcane: "Sugarcane", cotton: "Cotton"
        },
        Kannada: {
            wheat: "ಗೋಧಿ", paddy: "ಭತ್ತ (ಅಕ್ಕಿ)", maize: "ಮೆಕ್ಕೆಜೋಳ", sugarcane: "ಕಬ್ಬು", cotton: "ಹತ್ತಿ"
        },
        Hindi: {
            wheat: "गेहूं", paddy: "धान (चावल)", maize: "मक्का", sugarcane: "गन्ना", cotton: "कपास"
        }
    }

    const currentCrops = cropTranslations[language] || cropTranslations['English']

    // 1. Fertilizer Calculation Logic (Bags of 50Kg per acre)
    const getFertilizerCalculation = () => {
        const size = parseFloat(landSize) || 0
        let urea = 0, dap = 0, mop = 0
        
        switch (crop) {
            case 'wheat':
                urea = size * 1.8
                dap = size * 1.1
                mop = size * 0.7
                break
            case 'paddy':
                urea = size * 2.0
                dap = size * 1.2
                mop = size * 0.8
                break
            case 'maize':
                urea = size * 2.2
                dap = size * 1.3
                mop = size * 0.6
                break
            case 'sugarcane':
                urea = size * 3.5
                dap = size * 1.8
                mop = size * 1.5
                break
            case 'cotton':
                urea = size * 1.5
                dap = size * 1.0
                mop = size * 0.5
                break
            default:
                urea = size * 1.5
                dap = size * 1.0
                mop = size * 0.5
        }
        
        return {
            urea: urea.toFixed(1),
            dap: dap.toFixed(1),
            mop: mop.toFixed(1)
        }
    }

    // 2. Seed Calculation Logic (Kg required)
    const getSeedCalculation = () => {
        const size = parseFloat(landSize) || 0
        let seedRate = 0
        
        switch (crop) {
            case 'wheat':
                seedRate = size * 40 // 40 Kg/acre
                break
            case 'paddy':
                seedRate = size * 15 // 15 Kg/acre
                break
            case 'maize':
                seedRate = size * 8  // 8 Kg/acre
                break
            case 'sugarcane':
                seedRate = size * 2000 // 2000 Kg setts/acre
                break
            case 'cotton':
                seedRate = size * 2.5 // 2.5 Kg/acre
                break
            default:
                seedRate = size * 10
        }
        
        return seedRate.toFixed(1)
    }

    // 3. Yield & Profit Calculation Logic
    const getYieldCalculation = () => {
        const size = parseFloat(landSize) || 0
        const yieldPerAcre = parseFloat(expectedYield) || 0
        const pricePerQuintal = parseFloat(sellingPrice) || 0
        const costPerAcre = parseFloat(prodCost) || 0

        const totalYield = size * yieldPerAcre
        const totalRevenue = totalYield * pricePerQuintal
        const totalCost = size * costPerAcre
        const netProfit = totalRevenue - totalCost

        return {
            totalYield: totalYield.toFixed(1),
            totalRevenue: Math.round(totalRevenue).toLocaleString('en-IN'),
            totalCost: Math.round(totalCost).toLocaleString('en-IN'),
            netProfit: Math.round(netProfit).toLocaleString('en-IN'),
            isProfit: netProfit >= 0
        }
    }

    const fertilizerRes = getFertilizerCalculation()
    const seedRes = getSeedCalculation()
    const yieldRes = getYieldCalculation()

    // Localized Headers
    const textDict = {
        English: {
            title: "Agricultural Calculators",
            subtitle: "Optimize your inputs and estimate farm earnings",
            landSize: "Land Size (Acres)",
            cropType: "Select Crop",
            fertTab: "Fertilizer Calculator",
            seedTab: "Seed Calculator",
            profitTab: "Yield & Profit Calculator",
            urea: "Urea (46% N)",
            dap: "DAP (18:46:0)",
            mop: "MOP (Potash)",
            bags: "Bags (50 kg)",
            resultTitle: "Required Inputs",
            seedRequired: "Total Seed Required",
            kg: "kg",
            expYield: "Expected Yield (Quintals/Acre)",
            sellPrice: "Selling Price (₹/Quintal)",
            costPerAcre: "Production Cost (₹/Acre)",
            totalYield: "Total Expected Harvest",
            quintals: "Quintals",
            revenue: "Gross Revenue",
            cost: "Total Expenses",
            netProfit: "Net Profit",
            netLoss: "Net Loss"
        },
        Kannada: {
            title: "ಕೃಷಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
            subtitle: "ನಿಮ್ಮ ಕೃಷಿ ಇಳುವರಿ ಮತ್ತು ವೆಚ್ಚಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ",
            landSize: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)",
            cropType: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            fertTab: "ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
            seedTab: "ಬೀಜ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
            profitTab: "ಲಾಭ ಮತ್ತು ಇಳುವರಿ",
            urea: "ಯೂರಿಯಾ ಗೊಬ್ಬರ",
            dap: "ಡಿಎಪಿ ಗೊಬ್ಬರ",
            mop: "ಪೊಟ್ಯಾಶ್ ಗೊಬ್ಬರ",
            bags: "ಚೀಲಗಳು (೫೦ ಕೆಜಿ)",
            resultTitle: "ಬೇಕಾಗುವ ಗೊಬ್ಬರ",
            seedRequired: "ಬೇಕಾಗುವ ಒಟ್ಟು ಬೀಜ",
            kg: "ಕೆಜಿ",
            expYield: "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ (ಕ್ವಿಂಟಾಲ್/ಎಕರೆ)",
            sellPrice: "ಮಾರಾಟದ ಬೆಲೆ (₹/ಕ್ವಿಂಟಾಲ್)",
            costPerAcre: "ಒಟ್ಟು ಕೃಷಿ ವೆಚ್ಚ (₹/ಎಕರೆ)",
            totalYield: "ಒಟ್ಟು ನಿರೀಕ್ಷಿತ ಬೆಳೆ",
            quintals: "ಕ್ವಿಂಟಾಲ್ಗಳು",
            revenue: "ಒಟ್ಟು ಆದಾಯ",
            cost: "ಒಟ್ಟು ವೆಚ್ಚ",
            netProfit: "ನಿವ್ವಳ ಲಾಭ",
            netLoss: "ನಿವ್ವಳ ನಷ್ಟ"
        },
        Hindi: {
            title: "कृषि कैलकुलेटर",
            subtitle: "अपनी फसल लागत, बीज और खाद का सटीक अनुमान लगाएं",
            landSize: "भूमि का आकार (एकड़)",
            cropType: "फसल चुनें",
            fertTab: "खाद कैलकुलेटर",
            seedTab: "बीज कैलकुलेटर",
            profitTab: "लागत और मुनाफा",
            urea: "यूरिया खाद",
            dap: "डीएपी खाद",
            mop: "म्यूट ऑफ पोटाश",
            bags: "बोरी (50 किलो)",
            resultTitle: "आवश्यक खाद मात्रा",
            seedRequired: "कुल आवश्यक बीज",
            kg: "किलो",
            expYield: "संभावित उपज (क्विंटल/एकड़)",
            sellPrice: "बिक्री मूल्य (₹/क्विंटल)",
            costPerAcre: "उत्पादन लागत (₹/एकड़)",
            totalYield: "कुल संभावित फसल",
            quintals: "क्विंटल",
            revenue: "कुल आय",
            cost: "कुल खर्च",
            netProfit: "शुद्ध मुनाफा",
            netLoss: "कुल नुकसान"
        }
    }

    const dict = textDict[language] || textDict['English']

    return (
        <div className="calculator-wrapper">
            <div className="calc-header-section">
                <h2>📊 {dict.title}</h2>
                <p>{dict.subtitle}</p>
            </div>

            <div className="calc-tabs">
                <button 
                    className={`calc-tab-btn ${activeTab === 'fertilizer' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('fertilizer')}
                >
                    🌱 {dict.fertTab}
                </button>
                <button 
                    className={`calc-tab-btn ${activeTab === 'seed' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('seed')}
                >
                    🌾 {dict.seedTab}
                </button>
                <button 
                    className={`calc-tab-btn ${activeTab === 'yield' ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab('yield')}
                >
                    💰 {dict.profitTab}
                </button>
            </div>

            <div className="calc-layout">
                {/* Inputs Card */}
                <div className="calc-card input-card">
                    <h3>⚙️ Inputs</h3>
                    <div className="input-group">
                        <label>{dict.landSize}</label>
                        <input 
                            type="number" 
                            min="0.1" 
                            step="0.1" 
                            value={landSize} 
                            onChange={(e) => setLandSize(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    <div className="input-group">
                        <label>{dict.cropType}</label>
                        <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                            <option value="wheat">{currentCrops.wheat}</option>
                            <option value="paddy">{currentCrops.paddy}</option>
                            <option value="maize">{currentCrops.maize}</option>
                            <option value="sugarcane">{currentCrops.sugarcane}</option>
                            <option value="cotton">{currentCrops.cotton}</option>
                        </select>
                    </div>

                    {activeTab === 'yield' && (
                        <>
                            <div className="input-group">
                                <label>{dict.expYield}</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={expectedYield} 
                                    onChange={(e) => setExpectedYield(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="input-group">
                                <label>{dict.sellPrice}</label>
                                <input 
                                    type="number" 
                                    min="100" 
                                    value={sellingPrice} 
                                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="input-group">
                                <label>{dict.costPerAcre}</label>
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={prodCost} 
                                    onChange={(e) => setProdCost(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Outputs Card */}
                <div className="calc-card output-card">
                    {activeTab === 'fertilizer' && (
                        <>
                            <h3>📋 {dict.resultTitle}</h3>
                            <div className="results-grid">
                                <div className="result-tile">
                                    <span className="tile-icon">🧪</span>
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.urea}</span>
                                        <span className="tile-value">{fertilizerRes.urea} <small>{dict.bags}</small></span>
                                    </div>
                                </div>
                                <div className="result-tile">
                                    <span className="tile-icon">🧪</span>
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.dap}</span>
                                        <span className="tile-value">{fertilizerRes.dap} <small>{dict.bags}</small></span>
                                    </div>
                                </div>
                                <div className="result-tile">
                                    <span className="tile-icon">🧪</span>
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.mop}</span>
                                        <span className="tile-value">{fertilizerRes.mop} <small>{dict.bags}</small></span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'seed' && (
                        <>
                            <h3>📋 {dict.resultTitle}</h3>
                            <div className="results-grid">
                                <div className="result-tile" style={{ gridColumn: 'span 2' }}>
                                    <span className="tile-icon">🌾</span>
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.seedRequired} ({currentCrops[crop]})</span>
                                        <span className="tile-value">{seedRes} <small>{dict.kg}</small></span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'yield' && (
                        <>
                            <h3>📋 {dict.resultTitle}</h3>
                            <div className="results-grid flex-results">
                                <div className="result-tile">
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.totalYield}</span>
                                        <span className="tile-value">{yieldRes.totalYield} <small>{dict.quintals}</small></span>
                                    </div>
                                </div>
                                <div className="result-tile">
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.revenue}</span>
                                        <span className="tile-value">₹{yieldRes.totalRevenue}</span>
                                    </div>
                                </div>
                                <div className="result-tile">
                                    <div className="tile-info">
                                        <span className="tile-label">{dict.cost}</span>
                                        <span className="tile-value">₹{yieldRes.totalCost}</span>
                                    </div>
                                </div>
                                <div className={`result-tile total-profit-tile ${yieldRes.isProfit ? 'profit-bg' : 'loss-bg'}`}>
                                    <div className="tile-info">
                                        <span className="tile-label" style={{ color: 'white' }}>
                                            {yieldRes.isProfit ? dict.netProfit : dict.netLoss}
                                        </span>
                                        <span className="tile-value" style={{ color: 'white' }}>
                                            ₹{yieldRes.netProfit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Calculator
