import React, { useState } from 'react';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { signInWithEmailAndPassword } from "firebase/auth"; 

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/chat'); 
    } catch (err) {
      // Direct feedback for common login issues
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="main-wrapper signup-container">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="signup-card">
        <button className="back-btn-styled" onClick={() => navigate('/')} title="Go Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        
        <div className="logo" style={{ textAlign: 'center', marginBottom: '10px' }}>
          AI-Chatbot
        </div>
        
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your dashboard.</p>

        {error && <p style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

        <form className="signup-form" onSubmit={handleLogin}>
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
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                {/* UPDATED: Navigates to the Forgot Password page */}
                <span 
                  className="purple-text" 
                  style={{ fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => navigate('/forgot-password')}
                >
                    Forgot Password?
                </span>
            </div>
          </div>

          <button type="submit" className="btn-dark-lg" style={{ width: '100%', marginTop: '10px' }}>
            Log In
          </button>
        </form>
        
        <p className="footer-text">
          Don't have an account? <span className="purple-text" onClick={() => navigate('/signup')} style={{cursor:'pointer', fontWeight: '600', marginLeft: '5px'}}>Sign up</span>
        </p>
      </div>
    </div>
  );
}