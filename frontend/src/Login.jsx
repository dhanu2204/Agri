import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
            const response=await fetch(`${backendUrl}/api/auth/login`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password})
            })
            const data=await response.json();
            if(response.ok){
                // Save the user email to localStorage so we can identify them and fetch their history
                localStorage.setItem('userEmail', email)
                navigate('/dashboard');
            }
            else{
                alert(data.message);
            }
        }
        catch(err){
            console.log(err);
            alert("Something went wrong");
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
            <div className="auth-card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px' }}>🌿</span>
                    <h2 style={{ margin: '12px 0 6px 0', fontSize: '26px' }}>Welcome back to AgriGrow</h2>
                    <p style={{ color: 'var(--text)', fontSize: '14px' }}>Please log in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="name@domain.com" />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Password</label>
                        <input type="password" id="password" name="password" required placeholder="••••••••" />
                    </div>
                    
                    <button type="submit" style={{ marginTop: '8px', padding: '14px', fontSize: '16px' }}>
                        Login
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text)' }}>
                        Don't have an account?{' '}
                        <span 
                            onClick={() => navigate('/signup')} 
                            style={{ color: 'var(--accent)', fontWeight: '600', cursor: 'pointer', hover: { color: 'var(--accent-hover)' } }}
                        >
                            Sign Up
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login