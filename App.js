import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Chatbot from './Chatbot';
import SignUp from './SignUp';
import Login from './Login'; // 1. Import Login
import ChatPage from './ChatPage';
import ForgotPassword from './ForgotPassword'

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <nav className="navbar">
        <div className="logo">AI-Chatbot</div>
        <div className="nav-links"></div>
        <div className="nav-buttons">
          <button className="btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
          {/* 3. Added onClick here */}
          <button className="btn-dark" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </nav>

      <div className="container">
        <div className="hero-text">
          <h1>Architecting the Next Era of <span className="purple-text">Digital Autonomy</span></h1>
          <p>This project showcases a custom-built React interface integrated with advanced AI models.</p>
          <div className="hero-btns">
            <button className="btn-dark-lg" onClick={() => navigate('/signup')}>Get started</button>
          </div>
        </div>
        <div className="hero-visual">
          <Chatbot />
        </div>
      </div>
      
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> {/* 2. Add Route */}
        <Route path="/chat" element={<ChatPage />} /> {/* Add this line */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;