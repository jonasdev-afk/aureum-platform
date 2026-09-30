const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "AUREUM Market API"
  });
});

app.get("/api/markets", async (req, res) => {
  try {
    const apiKey = process.env.CMC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "CoinMarketCap API key is not configured"
      });
    }

    const url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest" +
      "?symbol=BTC,ETH,BNB,XRP,SOL,TRX,USDT,USDC" +
      "&convert=USD";

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve market data"
    });
  }
});

app.listen(PORT, () => {
  console.log(`AUREUM Market API running on port ${PORT}`);
});
