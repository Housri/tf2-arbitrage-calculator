const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * Calculate arbitrage profit for a single item
 * 
 * Formula:
 * 1. Convert item cost (keys + ref) to total ref
 * 2. Get website sell price in USD
 * 3. Calculate website buyback price (usually less than sell price)
 * 4. With USD earned, buy items back at website rates
 * 5. Calculate profit in keys/ref
 */
router.post('/calculate', (req, res) => {
  const {
    itemName,
    tf2BuyKeys,
    tf2BuyRef,
    websiteSellPrice,
    websiteBuybackPrice,
    keyToRefRate = 63,
    itemWebsiteSellPrice // What the website sells similar items for
  } = req.body;

  try {
    // Validate inputs
    if (
      itemName === undefined ||
      tf2BuyKeys === undefined ||
      tf2BuyRef === undefined ||
      websiteSellPrice === undefined ||
      websiteBuybackPrice === undefined
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert total cost to ref
    const totalCostInRef = tf2BuyKeys * keyToRefRate + tf2BuyRef;

    // Cost in keys for reference
    const totalCostInKeys = tf2BuyKeys + tf2BuyRef / keyToRefRate;

    // When you sell to website, you get websiteBuybackPrice (in USD)
    const usdReceived = websiteBuybackPrice;

    // Calculate how much you paid per dollar
    const costPerDollar = totalCostInKeys / websiteSellPrice;

    // How many keys worth of value you get back
    const keysWorthOfUSD = usdReceived / (websiteSellPrice / totalCostInKeys);

    // More accurate: if website sells at certain price, you get buyback price
    // Profit calculation
    const profitInKeys = keysWorthOfUSD - totalCostInKeys;
    const profitInRef = profitInKeys * keyToRefRate;
    const profitInUSD = usdReceived - websiteSellPrice;

    // Check if profitable
    const isProfitable = profitInKeys > 0;

    res.json({
      itemName,
      costInKeys: totalCostInKeys.toFixed(2),
      costInRef: totalCostInRef.toFixed(2),
      costInUSD: websiteSellPrice.toFixed(2),
      usdReceived: usdReceived.toFixed(2),
      profitInKeys: profitInKeys.toFixed(2),
      profitInRef: profitInRef.toFixed(2),
      profitInUSD: profitInUSD.toFixed(2),
      isProfitable,
      profitMargin: ((profitInUSD / websiteSellPrice) * 100).toFixed(2) + '%'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Batch calculate multiple items
 */
router.post('/batch', (req, res) => {
  const { items, keyToRefRate = 63 } = req.body;

  try {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const results = items.map(item => {
      const totalCostInKeys = item.tf2BuyKeys + item.tf2BuyRef / keyToRefRate;
      const usdReceived = item.websiteBuybackPrice;
      const profitInKeys = (usdReceived / (item.websiteSellPrice / totalCostInKeys)) - totalCostInKeys;
      const profitInRef = profitInKeys * keyToRefRate;
      const profitInUSD = usdReceived - item.websiteSellPrice;

      return {
        itemName: item.itemName,
        costInKeys: totalCostInKeys.toFixed(2),
        profitInKeys: profitInKeys.toFixed(2),
        profitInRef: profitInRef.toFixed(2),
        profitInUSD: profitInUSD.toFixed(2),
        isProfitable: profitInKeys > 0,
        profitMargin: ((profitInUSD / item.websiteSellPrice) * 100).toFixed(2) + '%'
      };
    });

    // Sort by profit
    results.sort((a, b) => parseFloat(b.profitInKeys) - parseFloat(a.profitInKeys));

    res.json({
      total: results.length,
      profitableItems: results.filter(r => r.isProfitable).length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
