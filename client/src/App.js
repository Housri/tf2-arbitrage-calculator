import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calculator from './components/Calculator';
import ItemsList from './components/ItemsList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    // Try to connect to backend on load
    fetch('/api/health')
      .catch(() => console.warn('Backend not running on localhost:5000'));
  }, []);

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            🧮 Calculator
          </button>
          <button 
            className={`tab ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            📋 Saved Items
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'calculator' && <Calculator />}
          {activeTab === 'items' && <ItemsList />}
        </div>
      </div>

      <footer className="footer">
        <p>Made with ❤️ for TF2 traders | Find profitable arbitrage opportunities instantly</p>
      </footer>
    </div>
  );
}

export default App;