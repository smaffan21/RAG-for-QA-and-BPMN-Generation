import React, { useState } from 'react';
import StatusModule from './StatusModule';
import { Send, MessageCircle, Bot, User, Copy, Check } from 'lucide-react';
import axios from 'axios';

function QAInterface() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage = { type: 'question', content: question, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/qa', { question });
      const answerMessage = { 
        type: 'answer', 
        content: response.data.answer, 
        context: response.data.context,
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, answerMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        type: 'error', 
        content: 'Sorry, there was an error processing your question. Please make sure the backend is running.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="interface-container">
      <div className="interface-header">
        <h1 className="interface-title">
          Q&A System
        </h1>
        <p className="interface-description">
          Ask questions about Dutch railway transport regulations based on the Network Statement document
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Ask a question to get started!</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Try: "What is the email address for submitting complaints about services offered by ProRail?"
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="message">
                <div className="message-label">
                  {message.type === 'question' ? (
                    <>
                      <User size={16} />
                      <span>Your Question</span>
                    </>
                  ) : message.type === 'answer' ? (
                    <>
                      <Bot size={16} />
                      <span>AI Answer</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#ef4444' }}>Error</span>
                    </>
                  )}
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
                    className="copy-button"
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <div className={`message-content ${message.type === 'answer' ? 'answer' : ''}`}>
                  {message.type === 'answer' 
                    ? message.content
                        .split('\n')
                        .map((line, i) => {
                          // Handle section titles (lines starting with *)
                          if (line.trim().startsWith('*')) {
                            return (
                              <div key={i} className="answer-section-title">
                                {line.trim().replace(/^\*+\s*/, '')}
                              </div>
                            );
                          }
                          // Regular text lines
                          return <div key={i} className="answer-text">{line}</div>;
                        })
                    : message.content
                  }
                </div>
                {message.type === 'answer' && message.context && (
                  <details style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                      View Source Context
                    </summary>
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '0.75rem', 
                      background: '#f9fafb', 
                      borderRadius: '0.375rem',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message.context}
                    </div>
                  </details>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="loading-message">
              <div className="spinner"></div>
              <span>Processing your question...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <div className="input-group">
            <label htmlFor="question">Your Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question about railway regulations... (Press Enter to send)"
              rows={3}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!question.trim() || isLoading}
            style={{ width: '100%' }}
          >
            <Send size={16} />
            {isLoading ? 'Processing...' : 'Send Question'}
          </button>
          
          {messages.length > 0 && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                type="button"
                onClick={clearMessages}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem' }}
              >
                Clear Messages
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Tips */}
      <div className="tip-box">
        <h4>💡 Tips for Better Results</h4>
        <ul style={{ marginLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>Be specific in your questions</li>
          <li>Ask about specific regulations, procedures, or requirements</li>
          <li>Use keywords related to railway operations</li>
          <li>Check source citations for verification</li>
        </ul>
      </div>
      <StatusModule />
    </div>
  );
}

export default QAInterface;
