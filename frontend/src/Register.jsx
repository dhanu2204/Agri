import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmpassword: "",
        phone: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
            const response = await fetch(`${backendUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (response.ok) {
                navigate('/')
            } else {
                alert(data.message)
            }
        } catch (err) {
            console.log(err)
            alert("Something went wrong")
        }
    }

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh',
            padding: '20px' 
        }}>
            <div className="auth-card" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px' }}>🌾</span>
                    <h2 style={{ margin: '12px 0 6px 0', fontSize: '26px' }}>Join AgriGrow</h2>
                    <p style={{ color: 'var(--text)', fontSize: '14px' }}>Register to connect with smart farming tools</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                        <label htmlFor="fullname" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Full Name</label>
                        <input 
                          type="text" 
                          id="fullname"
                          placeholder="Full Name" 
                          required
                          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
                        <input 
                          type="email" 
                          id="email"
                          placeholder="name@domain.com" 
                          required
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Phone Number</label>
                        <input 
                          type="number" 
                          id="phone"
                          placeholder="Phone Number" 
                          required
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Password</label>
                        <input 
                          type="password" 
                          id="password"
                          placeholder="••••••••" 
                          required
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmpassword" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Confirm Password</label>
                        <input 
                          type="password" 
                          id="confirmpassword"
                          placeholder="••••••••" 
                          required
                          onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
                        />
                    </div>
                    
                    <button type="submit" style={{ marginTop: '8px', padding: '14px', fontSize: '16px' }}>
                        Register
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text)' }}>
                        Already have an account?{' '}
                        <span 
                            onClick={() => navigate('/')} 
                            style={{ color: 'var(--accent)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Log In
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
