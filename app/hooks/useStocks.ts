// hooks/useStocks.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { StockData } from "../types/stock";

export default function useStocks() {
  const [stocksData, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<StockData[]>("/api/stocks").then((res) => {
      setStocks(res.data);
      setLoading(false);
    });
  }, []);

  return { stocksData, loading };
}
