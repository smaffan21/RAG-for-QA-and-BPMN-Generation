import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, GitBranch, Database, Zap, Shield, Search, Mail, FileText } from 'lucide-react';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Railway RAG System</h1>
          <p className="hero-subtitle">
            AI-powered question answering and BPMN process modeling for Dutch railway transport regulations
          </p>
          <div className="hero-buttons">
            <Link to="/qa" className="btn btn-primary">
              <MessageCircle size={20} />
              Start Q&A Session
            </Link>
            <Link to="/bpmn" className="btn btn-secondary">
              <GitBranch size={20} />
              Generate BPMN
            </Link>
            <a 
              href="http://localhost:8000/NetworkStatement2026.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline"
              onClick={(e) => {
                e.preventDefault();
                window.open('http://localhost:8000/NetworkStatement2026.pdf', '_blank');
              }}
            >
              <FileText size={20} />
              Access Network Statement 2026
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">
              <MessageCircle size={24} />
            </div>
            <h3 className="feature-title">Intelligent Q&A</h3>
            <p className="feature-description">
              Ask questions about Dutch railway regulations and get precise answers based on the Network Statement document with source citations.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <GitBranch size={24} />
            </div>
            <h3 className="feature-title">BPMN Generation</h3>
            <p className="feature-description">
              Generate business process models using Mermaid syntax based on your process descriptions and regulatory context.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <Database size={24} />
            </div>
            <h3 className="feature-title">Vector Database</h3>
            <p className="feature-description">
              Powered by Chroma vector database with Ollama embeddings for efficient semantic search and retrieval.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <Zap size={24} />
            </div>
            <h3 className="feature-title">Fast & Accurate</h3>
            <p className="feature-description">
              Get instant responses powered by Llama 3.2 with context from the most relevant document sections.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <Shield size={24} />
            </div>
            <h3 className="feature-title">Reliable Sources</h3>
            <p className="feature-description">
              All answers are based strictly on the official Network Statement document with proper source citations.
            </p>
          </div>

          <div className="card feature-card">
            <div className="feature-icon">
              <Search size={24} />
            </div>
            <h3 className="feature-title">Semantic Search</h3>
            <p className="feature-description">
              Advanced semantic search finds relevant information even when using different terminology or phrases.
            </p>
          </div>
        </div>

        {/* Example Questions */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#003b68' }}>Try These Example Questions</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
              <strong>Easy:</strong> What is the email address for submitting complaints about services offered by ProRail?
            </div>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
              <strong>Medium:</strong> Is passenger transport allowed on the freight tracks in the Barendrecht underpass?
            </div>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
              <strong>Hard:</strong> What are the different categories of Incidental TCRs?
            </div>
          </div>
        </div>

        {/* BPMN Example */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#003b68' }}>BPMN Process Example</h3>
          <p style={{ marginBottom: '1rem', color: '#64748b' }}>
            Try describing this process in the BPMN generator:
          </p>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', fontStyle: 'italic' }}>
            "First, the system receives a request for a new train path. Then, it checks for any conflicting requests in the timetable. If there are no conflicts, the path is allocated. If there are conflicts, a coordination process is initiated."
          </div>
        </div>

        {/* Contact Section */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Mail size={24} style={{ marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0 }}>Contact Me for More Information</h3>
          </div>
          <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
            Have questions about this Railway RAG system?
          </p>
          <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            Visit <a href="https://ab-ovo.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Ab Ovo</a> to learn more about our sustainable IT solutions.
          </p>
          <a 
            href="mailto:smaffan21@gmail.com" 
            className="btn"
            style={{ 
              backgroundColor: 'white', 
              color: '#ea580c', 
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Mail size={16} />
            smaffan21@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
