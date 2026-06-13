import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    // Look for the user session email in browser memory
    const userEmail = localStorage.getItem('userEmail')
    
    // If no email is stored, it means they have not logged in
    if (!userEmail) {
        // Redirect them back to the login screen and replace history state
        return <Navigate to="/" replace />
    }
    
    // If they are logged in, allow them to view the page
    return children
}

export default ProtectedRoute
