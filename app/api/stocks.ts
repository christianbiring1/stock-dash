// pages/api/stocks.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { StockData } from "../types/stock";
// import { StockData } from "@/types/stock";

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || "76DJUJ5S0GJ7HWGJ"; // Store in .env.local

// Example symbols to fetch
const SYMBOLS = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "TSLA",
  "AMZN",
  "NVDA",
  "META",
  "NFLX",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const results: StockData[] = [];

    for (const symbol of SYMBOLS) {
      // GLOBAL_QUOTE gives price, change, etc.
      const { data } = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "GLOBAL_QUOTE",
          symbol,
          apikey: "76DJUJ5S0GJ7HWGJ",
        },
      });

      const quote = data["Global Quote"];
      if (!quote) continue;

      // You’ll need a way to map symbol → company name + marketCap (AV doesn’t give directly)
      // For demo, I hardcode names + marketCaps (could also call "OVERVIEW")
      const COMPANY_INFO: Record<string, { name: string; marketCap: number }> =
        {
          AAPL: { name: "Apple Inc.", marketCap: 2800000000000 },
          GOOGL: { name: "Alphabet Inc.", marketCap: 1800000000000 },
          MSFT: { name: "Microsoft Corp.", marketCap: 2900000000000 },
          TSLA: { name: "Tesla Inc.", marketCap: 790000000000 },
          AMZN: { name: "Amazon.com Inc.", marketCap: 1500000000000 },
          NVDA: { name: "NVIDIA Corp.", marketCap: 2200000000000 },
          META: { name: "Meta Platforms", marketCap: 1200000000000 },
          NFLX: { name: "Netflix Inc.", marketCap: 190000000000 },
        };

      results.push({
        symbol,
        name: COMPANY_INFO[symbol].name,
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"]),
        volume: parseInt(quote["06. volume"], 10),
        marketCap: COMPANY_INFO[symbol].marketCap,
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
