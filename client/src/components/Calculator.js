import React, { useState, useEffect } from 'react';
import { calculateArbitrage } from '../api';
import './Calculator.css';

function Calculator() {
  const [formData, setFormData] = useState({
    itemName: '',
    tf2BuyKeys: 0,
    tf2BuyRef: 0,
    websiteSellPrice: 0,
    websiteBuybackPrice: 0,
    keyToRefRate: 63
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [buybackPercentage, setBuybackPercentage] = useState(97); // 97% is typical for many trading sites

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error loading history:', err);
      }
    }

    // Load saved buyback percentage
    const savedPercentage = localStorage.getItem('buybackPercentage');
    if (savedPercentage) {
      setBuybackPercentage(parseFloat(savedPercentage));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  // Save buyback percentage to localStorage
  useEffect(() => {
    localStorage.setItem('buybackPercentage', buybackPercentage.toString());
  }, [buybackPercentage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = name === 'itemName' ? value : parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));

    // Auto-calculate buyback price when sell price changes
    if (name === 'websiteSellPrice' && numValue > 0) {
      const calculatedBuyback = (numValue * buybackPercentage) / 100;
      setFormData(prev => ({
        ...prev,
        websiteBuybackPrice: parseFloat(calculatedBuyback.toFixed(2))
      }));
    }
  };

  const handleBuybackPercentageChange = (e) => {
    const newPercentage = parseFloat(e.target.value) || 0;
    setBuybackPercentage(newPercentage);

    // Recalculate buyback price if sell price is already set
    if (formData.websiteSellPrice > 0) {
      const calculatedBuyback = (formData.websiteSellPrice * newPercentage) / 100;
      setFormData(prev => ({
        ...prev,
        websiteBuybackPrice: parseFloat(calculatedBuyback.toFixed(2))
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await calculateArbitrage(formData);
      setResult(response.data);

      // Add to history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        ...formData,
        profit: response.data.profitInKeys
      };

      setHistory(prev => [historyEntry, ...prev].slice(0, 20)); // Keep last 20 entries
    } catch (err) {
      setError(err.response?.data?.error || 'Error calculating arbitrage');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry) => {
    setFormData({
      itemName: entry.itemName,
      tf2BuyKeys: entry.tf2BuyKeys,
      tf2BuyRef: entry.tf2BuyRef,
      websiteSellPrice: entry.websiteSellPrice,
      websiteBuybackPrice: entry.websiteBuybackPrice,
      keyToRefRate: entry.keyToRefRate
    });
    setShowHistory(false);
  };

  const deleteHistoryEntry = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all history? This cannot be undone.')) {
      setHistory([]);
    }
  };

  return (
    <div className="calculator">
      <h2>📊 Arbitrage Calculator</h2>

      {/* Buyback Percentage Settings */}
      <div className="buyback-settings">
        <div className="buyback-info">
          <label>⚙️ Website Buyback Percentage</label>
          <p className="buyback-description">
            Enter the percentage of the sell price that the website pays when you sell items to them.
            (e.g., 97% means they pay you $97 when they sell for $100)
          </p>
        </div>
        <div className="buyback-input-group">
          <input
            type="number"
            value={buybackPercentage}
            onChange={handleBuybackPercentageChange}
            step="0.1"
            min="0"
            max="100"
            className="buyback-percentage-input"
          />
          <span className="percentage-symbol">%</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g., Veteran's Attire"
              required
            />
          </div>

          <div className="form-group">
            <label>TF2 Buy Price (Keys)</label>
            <input
              type="number"
              name="tf2BuyKeys"
              value={formData.tf2BuyKeys}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>TF2 Buy Price (Ref)</label>
            <input
              type="number"
              name="tf2BuyRef"
              value={formData.tf2BuyRef}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Website Sell Price ($) 💰</label>
            <input
              type="number"
              name="websiteSellPrice"
              value={formData.websiteSellPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="Enter price - buyback will auto-calculate"
            />
          </div>

          <div className="form-group auto-calculated">
            <label>Website Buyback Price ($) 🤖 AUTO</label>
            <div className="auto-calculated-input">
              <input
                type="number"
                name="websiteBuybackPrice"
                value={formData.websiteBuybackPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                readOnly
                className="buyback-readonly"
              />
              <span className="auto-badge">AUTO-CALCULATED</span>
            </div>
            <small className="auto-hint">
              Calculated as: ${formData.websiteSellPrice.toFixed(2)} × {buybackPercentage}%
            </small>
          </div>

          <div className="form-group">
            <label>Key to Ref Rate</label>
            <input
              type="number"
              name="keyToRefRate"
              value={formData.keyToRefRate}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Profit'}
          </button>
          <button type="reset">Clear</button>
          <button 
            type="button" 
            onClick={() => setShowHistory(!showHistory)}
            className="history-button"
          >
            ⏱️ History ({history.length})
          </button>
        </div>
      </form>

      {/* History Section */}
      {showHistory && (
        <div className="history-section">
          <div className="history-header">
            <h3>📜 Recent Calculations</h3>
            {history.length > 0 && (
              <button onClick={clearAllHistory} className="clear-all-button">
                🗑️ Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="history-empty">No history yet. Calculate some items first!</p>
          ) : (
            <div className="history-list">
              {history.map(entry => (
                <div key={entry.id} className="history-item">
                  <div className="history-item-header">
                    <div className="history-item-info">
                      <h4>{entry.itemName}</h4>
                      <span className="history-timestamp">{entry.timestamp}</span>
                    </div>
                    <div className={`history-profit ${entry.profit >= 0 ? 'profitable' : 'loss'}`}>
                      {entry.profit >= 0 ? '+' : ''}{entry.profit.toFixed(2)} keys
                    </div>
                  </div>

                  <div className="history-item-details">
                    <span>Cost: {entry.tf2BuyKeys}k {entry.tf2BuyRef > 0 && `+ ${entry.tf2BuyRef}ref`}</span>
                    <span>Sell: ${entry.websiteSellPrice.toFixed(2)}</span>
                    <span>Buyback: ${entry.websiteBuybackPrice.toFixed(2)}</span>
                  </div>

                  <div className="history-item-actions">
                    <button 
                      onClick={() => loadFromHistory(entry)}
                      className="load-button"
                    >
                      📥 Load
                    </button>
                    <button 
                      onClick={() => deleteHistoryEntry(entry.id)}
                      className="delete-button"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="results" style={{ borderColor: '#ef4444' }}>
          <p className="error">❌ Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="results">
          <div className="result-row">
            <div className="result-item">
              <div className="result-label">Item Name</div>
              <div className="result-value">{result.itemName}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Cost in Keys</div>
              <div className="result-value">{result.costInKeys}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Cost in USD</div>
              <div className="result-value">${result.costInUSD}</div>
            </div>
            <div className="result-item">
              <div className="result-label">USD Received</div>
              <div className="result-value">${result.usdReceived}</div>
            </div>
          </div>

          <div className="result-row">
            <div className="result-item">
              <div className="result-label">Profit in Keys</div>
              <div className={`result-value ${result.profitInKeys >= 0 ? 'profitable' : 'loss'}`}>
                {result.profitInKeys}
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Profit in Ref</div>
              <div className={`result-value ${result.profitInRef >= 0 ? 'profitable' : 'loss'}`}>
                {result.profitInRef}
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Profit in USD</div>
              <div className={`result-value ${result.profitInUSD >= 0 ? 'profitable' : 'loss'}`}>
                ${result.profitInUSD}
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">Profit Margin</div>
              <div className={`result-value ${result.profitInUSD >= 0 ? 'profitable' : 'loss'}`}>
                {result.profitMargin}
              </div>
            </div>
          </div>

          <div className="result-row">
            <div className="result-item">
              <div className="result-label">Status</div>
              {result.isProfitable ? (
                <span className="profitable-badge">✓ PROFITABLE</span>
              ) : (
                <span className="not-profitable-badge">✗ NOT PROFITABLE</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
