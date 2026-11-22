# SpecSense

![React 18](https://img.shields.io/badge/React-18-087EA4?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-3C873A?logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-sql.js-003B57?logo=sqlite&logoColor=white)

SpecSense compares electronics across retailers and helps shoppers decide whether to buy now or set a price alert. The demo generates **4,320 price observations**: 16 products × 3 retailers × 90 days. Its catalog, price histories and flash sales are simulated, so you can explore the full workflow locally without retailer accounts or API keys.

## 🚀 Features

- **Compare two or three products.** View specifications side by side, highlight differences and export the comparison as a PDF.
- **Explore price history.** Chart retailer quotes over 30, 60 or 90 days and see how the current price compares with recent averages.
- **Understand a recommendation.** Inspect the price deviation and historical low behind a buy, wait or fair-price recommendation. A separate value score weighs specifications by product category.
- **Try a price alert.** Set a target, simulate a price drop and see qualifying alerts change from active to triggered.

## 🛠 Tech Stack

| Layer | Technologies | Role |
| --- | --- | --- |
| Interface | React 18, Vite, Tailwind CSS, Recharts | Product comparison, interactive price charts and alerts |
| API | Node.js, Express, Zod | REST endpoints and alert input validation |
| Storage | SQLite via sql.js | Relational catalog, price history, alerts and sale events |
| Reporting | html2canvas, jsPDF | Exportable product comparison reports |

## 📂 Project Structure

```text
PricePilot_AI/
├── backend/
│   ├── algorithms/       # Price metrics, timing recommendations and value scores
│   ├── controllers/      # Product, comparison, price and alert handlers
│   ├── database/         # Schema, demo seed and SQLite persistence
│   ├── middleware/       # API error handling
│   ├── routes/           # Express route definitions
│   ├── test/             # Price analytics regression tests
│   └── server.js         # API entry point and static frontend host
├── frontend/
│   ├── src/
│   │   ├── components/   # Comparison table, charts, alert form and navigation
│   │   ├── context/      # Shared alert state
│   │   ├── pages/        # Catalog, tracker, comparisons and alerts
│   │   ├── services/     # API client
│   │   └── utils/        # PDF export
│   └── vite.config.js
└── package.json          # Commands for both applications
```

## ⚡ Getting Started

### Prerequisites

Install Git, Node.js 22 or 24, and npm. The backend writes its SQLite file to the repository, so use a writable checkout.

### Installation

```bash
git clone https://github.com/balaji049/PricePilot_AI.git
cd PricePilot_AI
npm ci --prefix backend
npm ci --prefix frontend
npm run seed
```

The seed creates the demo database at `backend/database/specsense.sqlite`. **Reseeding resets the database**, including saved alerts. Stop the server before running the seed again.

### Running the Project

To serve the UI and API from one process, run these commands from the repository root:

```bash
npm run build
npm start
```

Open [the local app](http://localhost:5000). To check the backend separately, open [the health endpoint](http://localhost:5000/api/health).

For frontend development, run `npm run dev:backend` in one terminal and `npm run dev:frontend` in another. Open [the Vite dev server](http://localhost:5173).

## 🔧 Environment Variables

The default settings work on localhost. To have the browser request the API from the same origin as the UI, create `frontend/.env.local`:

```dotenv
VITE_API_URL=/api
```

Vite proxies `/api` to port 5000 during development. Express serves that path directly in the combined build. Restart Vite or rebuild the frontend after changing this setting.

The backend reads `PORT` from the process environment. For an alternative to exporting it in your shell, create a `.env` file at the repository root:

```dotenv
PORT=5001
```

Start the backend with `node --env-file=.env backend/server.js` to load that file explicitly. If you change the backend port during split-server development, set `VITE_API_URL` to the full API address, such as `http://localhost:5001/api`.

## 📸 Screenshots

| View | Screenshot placeholder |
| --- | --- |
| Product comparison | *OnePlus 12 and Pixel 8 side by side with specification differences highlighted.* |
| Price tracker | *Three retailer price histories for one product over 90 days.* |

## 🎯 Usage

1. Open **Compare Specs**, select the OnePlus 12 and Google Pixel 8, and turn on **Differences Only**. Choose **Export PDF Report** to save the comparison.
2. Open **Price Tracker**, select a product and switch between time windows. Compare the retailer lines with the historical average and low.
3. Open **Price Alerts** and try the flash-drop demo. The simulator reduces the selected product’s price by 10%, checks active targets and displays the result in the app.

To inspect the same data through the API, run:

```bash
curl 'http://localhost:5000/api/products'
curl 'http://localhost:5000/api/prices/1/history?days=30'
curl 'http://localhost:5000/api/compare?ids=1,2'
```

## 🏗 Architecture Overview

The seed script loads products and retailers, then writes one price per product, retailer and day. Each observation links to both a product and a retailer. An index on product and date supports history queries. [Database schema](backend/database/schema.sql)

The React client requests data from Express. For a retailer comparison, the API selects each retailer’s latest available quote. For a moving average, it averages the quotes on each observed day, then averages those daily values within the calendar window. A missing day contributes no value, and a day with three quotes carries the same weight as a day with one. [Price controller](backend/controllers/priceController.js) · [Price analytics](backend/algorithms/priceAnalytics.js)

## 🤝 Contributing

Create a branch for your change and keep the pull request focused. For a calculation change, include a small price history with the expected result. For a UI change, include a screenshot of the affected view. Run the analytics tests and build the frontend before opening the pull request:

```bash
node --test backend/test/priceAnalytics.test.js
npm run build
```

## 📝 License

The root [package manifest](package.json) declares MIT. The repository does not currently include a standalone license file.

## 👨‍💻 Author

**Bhairwad Balaji** · [GitHub](https://github.com/balaji049) · [LinkedIn](https://www.linkedin.com/in/balaji-bhairwad/)
