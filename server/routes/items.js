const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Get all items
 */
router.get('/', (req, res) => {
  db.all('SELECT * FROM items ORDER BY name ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/**
 * Add a new item
 */
router.post('/', (req, res) => {
  const {
    name,
    tf2BuyKeys,
    tf2BuyRef,
    websiteSellPrice,
    websiteBuybackPrice
  } = req.body;

  if (!name || tf2BuyKeys === undefined || websiteSellPrice === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO items (name, tf2_buy_keys, tf2_buy_ref, website_sell_price, website_buyback_price)
     VALUES (?, ?, ?, ?, ?)`,
    [name, tf2BuyKeys, tf2BuyRef || 0, websiteSellPrice, websiteBuybackPrice],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        tf2BuyKeys,
        tf2BuyRef: tf2BuyRef || 0,
        websiteSellPrice,
        websiteBuybackPrice
      });
    }
  );
});

/**
 * Update an item
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    tf2BuyKeys,
    tf2BuyRef,
    websiteSellPrice,
    websiteBuybackPrice
  } = req.body;

  db.run(
    `UPDATE items SET name = ?, tf2_buy_keys = ?, tf2_buy_ref = ?, website_sell_price = ?, website_buyback_price = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, tf2BuyKeys, tf2BuyRef, websiteSellPrice, websiteBuybackPrice, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, name, tf2BuyKeys, tf2BuyRef, websiteSellPrice, websiteBuybackPrice });
    }
  );
});

/**
 * Delete an item
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Item deleted' });
  });
});

module.exports = router;
