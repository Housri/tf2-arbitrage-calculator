import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">🔄</div>
          <div>
            <h1>TF2 Arbitrage Calculator</h1>
            <p className="tagline">Find Profitable Trades Instantly</p>
          </div>
        </div>
        <div className="info-section">
          <div className="exchange-rate">
            <span className="rate-label">Current Rate:</span>
            <span className="rate-value">1 Key = 63 Ref</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;