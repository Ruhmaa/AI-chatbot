import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { sendPasswordResetEmail } from "firebase/auth";
import './App.css'; 

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for a password reset link!");
    } catch (err) {
      setError("Failed to send reset email. Please check the address.");
    }
  };

  return (
    <div className="main-wrapper signup-container">
      <div className="orb orb-1"></div>
      <div className="signup-card">
        <button className="back-btn-styled" onClick={() => navigate('/login')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="logo" style={{ textAlign: 'center', marginBottom: '10px' }}>AI-Chatbot</div>
        <h2>Reset Password</h2>
        <p>Enter your email and we'll send you a link to get back into your account.</p>

        {message && <p style={{ color: '#4BB543', fontSize: '14px', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: '#ff4d4d', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

        <form className="signup-form" onSubmit={handleReset}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-dark-lg" style={{ width: '100%', marginTop: '10px' }}>
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}