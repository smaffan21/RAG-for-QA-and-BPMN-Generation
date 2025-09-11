import React, { useState } from 'react';
import StatusModule from './StatusModule';
import { GitBranch, Send, Download, Copy, Check, ExternalLink } from 'lucide-react';
import axios from 'axios';

function BPMNInterface() {
  const [description, setDescription] = useState('');
  const [mermaidScript, setMermaidScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/bpmn', { description });
      setMermaidScript(response.data.mermaid_script);
    } catch (error) {
      console.error('Error:', error);
      setMermaidScript('// Error: Could not generate BPMN diagram. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mermaidScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadScript = () => {
    const blob = new Blob([`\`\`\`mermaid\n${mermaidScript}\n\`\`\``], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'process.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openInMermaidLive = () => {
    const encodedScript = encodeURIComponent(mermaidScript);
    window.open(`https://mermaid.live/edit#pako:${encodedScript}`, '_blank');
  };

  const clearAll = () => {
    setDescription('');
    setMermaidScript('');
  };

  return (
    <div className="interface-container">
      <div className="interface-header">
        <h1 className="interface-title">
          BPMN Generator
        </h1>
        <p className="interface-description">
          Generate business process models using Mermaid syntax based on your process descriptions and regulatory context
        </p>
      </div>

      <div className="chat-container">
        <form onSubmit={handleSubmit} className="chat-input">
          <div className="input-group">
            <label htmlFor="description">Process Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the process you want to model. For example: 'First, the system receives a request for a new train path. Then, it checks for any conflicting requests in the timetable. If there are no conflicts, the path is allocated. If there are conflicts, a coordination process is initiated.'"
              rows={5}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!description.trim() || isLoading}
            style={{ width: '100%' }}
          >
            <Send size={16} />
            {isLoading ? 'Generating BPMN...' : 'Generate BPMN Diagram'}
          </button>
        </form>

        {isLoading && (
          <div className="loading-message">
            <div className="spinner"></div>
            <span>Retrieving regulations and generating diagram...</span>
          </div>
        )}

        {mermaidScript && !isLoading && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Generated Mermaid Script</h3>
              <div className="bpmn-actions">
                <button
                  onClick={copyToClipboard}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button
                  onClick={downloadScript}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  <Download size={14} />
                  Download
                </button>
                
                <button
                  onClick={openInMermaidLive}
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem' }}
                >
                  <ExternalLink size={14} />
                  Open in Mermaid Live
                </button>
              </div>
            </div>
            
            <div className="bpmn-output">
              {mermaidScript}
            </div>

            <button 
              onClick={clearAll}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Generate Another Diagram
            </button>
          </div>
        )}
      </div>

      {/* Tips and Examples */}
      <div className="tip-box">
        <h4>💡 Tips for Better BPMN Generation</h4>
        <ul style={{ marginLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>Describe the process step by step in chronological order</li>
          <li>Include decision points and alternative paths</li>
          <li>Mention any regulatory constraints or conditions</li>
          <li>Use clear, specific language about tasks and outcomes</li>
        </ul>
      </div>

      {/* Example Processes */}
      <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Example Process Descriptions</h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
            <strong>Train Path Allocation:</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>
              "First, the system receives a request for a new train path. Then, it checks for any conflicting requests in the timetable. If there are no conflicts, the path is allocated. If there are conflicts, a coordination process is initiated."
            </p>
            <button
              onClick={() => setDescription("First, the system receives a request for a new train path. Then, it checks for any conflicting requests in the timetable. If there are no conflicts, the path is allocated. If there are conflicts, a coordination process is initiated.")}
              className="btn btn-secondary"
              style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              Use This Example
            </button>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
            <strong>Safety Certificate Verification:</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>
              "The system receives a safety certificate application. It validates the documentation. If valid, it checks compliance with regulations. If compliant, the certificate is issued. If not compliant, feedback is provided and the application is returned for revision."
            </p>
            <button
              onClick={() => setDescription("The system receives a safety certificate application. It validates the documentation. If valid, it checks compliance with regulations. If compliant, the certificate is issued. If not compliant, feedback is provided and the application is returned for revision.")}
              className="btn btn-secondary"
              style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              Use This Example
            </button>
          </div>
        </div>
      </div>
      <StatusModule />
    </div>
  );
}

export default BPMNInterface;
