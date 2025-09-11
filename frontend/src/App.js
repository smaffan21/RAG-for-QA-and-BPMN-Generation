import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MessageCircle, GitBranch, Home, Github, Linkedin } from 'lucide-react';
import HomePage from './components/HomePage';
import QAInterface from './components/QAInterface';
import BPMNInterface from './components/BPMNInterface';
import './App.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/qa', icon: MessageCircle, label: 'Q&A System' },
    { path: '/bpmn', icon: GitBranch, label: 'BPMN Generator' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a 
          href="https://ab-ovo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-brand"
        >
          <img 
            src="/ab-ovo-logo-dark.webp" 
            alt="Ab Ovo" 
            className="brand-logo"
          />
        </a>
        
        <div className="nav-links">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/syed-m-affan"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://github.com/smaffan21/RAG-for-QA-and-BPMN-Generation"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/qa" element={<QAInterface />} />
            <Route path="/bpmn" element={<BPMNInterface />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Railway RAG System. Built by Syed Affan for Ab Ovo.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
