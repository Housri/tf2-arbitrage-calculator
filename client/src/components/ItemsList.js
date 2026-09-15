import React, { useState, useEffect } from 'react';
import { getItems, addItem, deleteItem } from '../api';
import './ItemsList.css';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tf2BuyKeys: 0,
    tf2BuyRef: 0,
    websiteSellPrice: 0,
    websiteBuybackPrice: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems();
      setItems(response.data || []);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseFloat(value) || 0
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }

    try {
      await addItem(formData);
      setMessage('✓ Item added successfully!');
      setFormData({
        name: '',
        tf2BuyKeys: 0,
        tf2BuyRef: 0,
        websiteSellPrice: 0,
        websiteBuybackPrice: 0
      });
      fetchItems();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setMessage('✓ Item deleted successfully!');
        fetchItems();
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  return (
    <div className="items-list">
      <h2>📋 Saved Items</h2>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">❌ Error: {error}</div>}

      <div className="add-item-form">
        <h3>➕ Add New Item</h3>
        <form onSubmit={handleAddItem}>
          <div className="form-grid">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Mann Co. Crate Key"
              />
            </div>

            <div className="form-group">
              <label>TF2 Buy Keys</label>
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
              <label>TF2 Buy Ref</label>
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
              <label>Website Sell Price</label>
              <input
                type="number"
                name="websiteSellPrice"
                value={formData.websiteSellPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Website Buyback Price</label>
              <input
                type="number"
                name="websiteBuybackPrice"
                value={formData.websiteBuybackPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <button type="submit" className="add-button" disabled={loading}>
            {loading ? 'Adding...' : '➕ Add Item'}
          </button>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items saved yet</p>
          <p style={{ fontSize: '0.9rem' }}>Add your first item above to get started!</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <div className="item-detail">
                <span className="item-detail-label">TF2 Buy Cost:</span>
                <span className="item-detail-value">
                  {item.tf2_buy_keys} keys {item.tf2_buy_ref > 0 && `+ ${item.tf2_buy_ref} ref`}
                </span>
              </div>
              <div className="item-detail">
                <span className="item-detail-label">Website Sell:</span>
                <span className="item-detail-value">${item.website_sell_price?.toFixed(2)}</span>
              </div>
              <div className="item-detail">
                <span className="item-detail-label">Website Buyback:</span>
                <span className="item-detail-value">${item.website_buyback_price?.toFixed(2)}</span>
              </div>

              <div className="item-actions">
                <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemsList;