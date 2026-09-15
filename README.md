# TF2 Arbitrage Calculator

A web application to calculate profitable TF2 item arbitrage opportunities between in-game currency (keys/refined metal) and third-party trading websites.

## 📊 How It Works

The calculator helps you identify profitable trades:

1. **Buy items in TF2** using keys and refined metal (ref)
2. **Sell to a trading website** and get USD
3. **Use USD to buy items back** at website rates
4. **Calculate your profit** in keys/ref

### Example Profit Calculation

- Buy item for: **12 keys** from TF2 market
- Website sells same item for: **$61.50**
- Website buyback price: **$60.00** (when you sell them the item)
- With $60, you can buy **~18.75 keys worth** of items at $3.20/key
- **Profit: 6.75 keys** (18.75 - 12)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Housri/tf2-arbitrage-calculator.git
cd tf2-arbitrage-calculator
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 📝 API Endpoints

### Calculate Single Item Arbitrage
**POST** `/api/calculator/calculate`

Request body:
```json
{
  "itemName": "Veteran's Attire",
  "tf2BuyKeys": 1,
  "tf2BuyRef": 55,
  "websiteSellPrice": 3.67,
  "websiteBuybackPrice": 3.50,
  "keyToRefRate": 63
}
```

Response:
```json
{
  "itemName": "Veteran's Attire",
  "costInKeys": "1.87",
  "costInRef": "118.00",
  "costInUSD": "3.67",
  "usdReceived": "3.50",
  "profitInKeys": "-0.05",
  "profitInRef": "-3.15",
  "profitInUSD": "-0.17",
  "isProfitable": false,
  "profitMargin": "-4.63%"
}
```

### Batch Calculate Multiple Items
**POST** `/api/calculator/batch`

Request body:
```json
{
  "keyToRefRate": 63,
  "items": [
    {
      "itemName": "Item 1",
      "tf2BuyKeys": 12,
      "tf2BuyRef": 0,
      "websiteSellPrice": 61.50,
      "websiteBuybackPrice": 60.00
    },
    {
      "itemName": "Item 2",
      "tf2BuyKeys": 5,
      "tf2BuyRef": 30,
      "websiteSellPrice": 25.00,
      "websiteBuybackPrice": 24.00
    }
  ]
}
```

### Get All Items
**GET** `/api/items`

### Add Item
**POST** `/api/items`

### Update Item
**PUT** `/api/items/:id`

### Delete Item
**DELETE** `/api/items/:id`

## 🛠️ Project Structure

```
tf2-arbitrage-calculator/
├── server/
│   ├── index.js           # Express server setup
│   ├── database.js        # SQLite database initialization
│   └── routes/
│       ├── calculator.js  # Arbitrage calculation endpoints
│       └── items.js       # Item management endpoints
├── client/                # React frontend (to be created)
├── package.json
└── README.md
```

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Frontend**: React (coming next)
- **APIs**: RESTful API

## 📦 Environment Variables

```
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

This app is ready to be deployed on:
- **Heroku** (free tier available)
- **Railway** (free tier)
- **Render** (free tier)
- **Vercel** + backend on another platform

## 📄 License

MIT

## 🎯 Future Features

- [ ] React frontend UI
- [ ] Real-time price tracking API integration
- [ ] Historical profit tracking
- [ ] Email/Discord notifications for profitable items
- [ ] Advanced filtering and sorting
- [ ] User authentication
- [ ] Price history charts

---

**Made with ❤️ for TF2 traders**
