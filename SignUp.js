import React, { useState } from 'react';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // --- NEW GMAIL CHECK ---
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError("Only @gmail.com addresses are allowed.");
      return; // Stop the function here
    }
    // -----------------------
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/chat');
    } catch (err) {
      // Firebase provides specific error codes, let's make them readable
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="main-wrapper signup-container">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="signup-card">
        <button className="back-btn-styled" onClick={() => navigate('/')} title="Go Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <div className="logo" style={{ textAlign: 'center', marginBottom: '20px' }}>AI-Chatbot</div>
        <h2>Create your Account</h2>
        
        {/* Error display */}
        {error && (
          <p style={{ 
            color: '#ff4d4d', 
            backgroundColor: 'rgba(255, 77, 77, 0.1)', 
            padding: '10px', 
            borderRadius: '5px', 
            fontSize: '0.8rem',
            textAlign: 'center' 
          }}>
            {error}
          </p>
        )}

        <form className="signup-form" onSubmit={handleSignUp}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>
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
          </div>
          <button type="submit" className="btn-dark-lg" style={{ width: '100%', marginTop: '10px' }}>
            Get Started for Free
          </button>
        </form>
        
        <p className="footer-text">
          Already have an account? 
          <span className="purple-text" onClick={() => navigate('/login')} style={{cursor:'pointer', fontWeight: '600', marginLeft: '5px'}}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}