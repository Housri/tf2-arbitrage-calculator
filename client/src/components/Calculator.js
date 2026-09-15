import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'itemName' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await calculateArbitrage(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error calculating arbitrage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator">
      <h2>📊 Arbitrage Calculator</h2>
      
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
            <label>Website Sell Price ($)</label>
            <input
              type="number"
              name="websiteSellPrice"
              value={formData.websiteSellPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Website Buyback Price ($)</label>
            <input
              type="number"
              name="websiteBuybackPrice"
              value={formData.websiteBuybackPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
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
        </div>
      </form>

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