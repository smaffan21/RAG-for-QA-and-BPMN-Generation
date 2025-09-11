import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Server } from 'lucide-react';
import axios from 'axios';

function StatusModule() {
  const [statuses, setStatuses] = useState({
    api: 'checking',
    ollama: 'checking',
    vectorDb: 'checking'
  });

  useEffect(() => {
    checkStatuses();
    // Check statuses every 30 seconds
    const interval = setInterval(checkStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatuses = async () => {
    // Check API Server
    try {
      await axios.get('/api/health');
      setStatuses(prev => ({ ...prev, api: 'online' }));
    } catch (error) {
      setStatuses(prev => ({ ...prev, api: 'offline' }));
    }

    // Check Ollama
    try {
      await axios.get('/api/health/ollama');
      setStatuses(prev => ({ ...prev, ollama: 'online' }));
    } catch (error) {
      setStatuses(prev => ({ ...prev, ollama: 'offline' }));
    }

    // Check Vector DB
    try {
      await axios.get('/api/health/vectordb');
      setStatuses(prev => ({ ...prev, vectorDb: 'online' }));
    } catch (error) {
      setStatuses(prev => ({ ...prev, vectorDb: 'offline' }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 size={14} className="status-icon online" />;
      case 'offline':
        return <XCircle size={14} className="status-icon offline" />;
      default:
        return <AlertCircle size={14} className="status-icon checking" />;
    }
  };

  return (
    <div className="status-module">
      <div className="status-header">
        <Server size={14} />
        <span>System Status</span>
      </div>
      <div className="status-items">
        <div className="status-item">
          {getStatusIcon(statuses.api)}
          <span>API Server</span>
        </div>
        <div className="status-item">
          {getStatusIcon(statuses.ollama)}
          <span>Ollama LLM</span>
        </div>
        <div className="status-item">
          {getStatusIcon(statuses.vectorDb)}
          <span>Vector DB</span>
        </div>
      </div>
    </div>
  );
}

export default StatusModule;
