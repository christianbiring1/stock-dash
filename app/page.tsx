"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
// Stock data interface
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

// Mock API data - In production, replace with real API calls
const MOCK_STOCKS: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45234567,
    marketCap: 2800000000000,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.56,
    change: -1.23,
    changePercent: -0.85,
    volume: 23456789,
    marketCap: 1800000000000,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.85,
    change: 4.67,
    changePercent: 1.25,
    volume: 34567890,
    marketCap: 2900000000000,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.42,
    change: -5.23,
    changePercent: -2.06,
    volume: 67890123,
    marketCap: 790000000000,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 145.78,
    change: 1.89,
    changePercent: 1.31,
    volume: 45678901,
    marketCap: 1500000000000,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    volume: 56789012,
    marketCap: 2200000000000,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 485.32,
    change: -3.21,
    changePercent: -0.66,
    volume: 23456789,
    marketCap: 1200000000000,
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 425.67,
    change: 8.92,
    changePercent: 2.14,
    volume: 12345678,
    marketCap: 190000000000,
  },
];

// Chart data for demonstration
const CHART_DATA = [
  { time: "09:30", price: 173.28 },
  { time: "10:00", price: 174.15 },
  { time: "10:30", price: 173.89 },
  { time: "11:00", price: 175.43 },
  { time: "11:30", price: 174.92 },
  { time: "12:00", price: 175.67 },
];

export default function StockDashboard() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof StockData>("symbol");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Simulate API call
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStocks(MOCK_STOCKS);
        setFilteredStocks(MOCK_STOCKS);
        setError(null);
      } catch (err) {
        setError("Failed to fetch stock data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Filter stocks based on search term
  useEffect(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchTerm, stocks]);

  // Sort functionality
  const handleSort = (field: keyof StockData) => {
    const direction =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredStocks].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    setFilteredStocks(sorted);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <div
      className={`${raleway.className} min-h-screen bg-background p-4 md:p-6 lg:p-8`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Stock Market Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time stock prices and market data
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Stocks
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredStocks.length}</div>
              <p className="text-xs text-muted-foreground">Active symbols</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gainers</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">
                {filteredStocks.filter((s) => s.change > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">Stocks up today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Losers</CardTitle>
              <TrendingDown className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-5">
                {filteredStocks.filter((s) => s.change < 0).length}
              </div>
              <p className="text-xs text-muted-foreground">Stocks down today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Change</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredStocks.length > 0
                  ? `${(
                      filteredStocks.reduce(
                        (acc, s) => acc + s.changePercent,
                        0
                      ) / filteredStocks.length
                    ).toFixed(2)}%`
                  : "0.00%"}
              </div>
              <p className="text-xs text-muted-foreground">Market average</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AAPL Price Chart</CardTitle>
              <CardDescription>Intraday price movement</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Movers</CardTitle>
              <CardDescription>Biggest changes today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredStocks
                .sort(
                  (a, b) =>
                    Math.abs(b.changePercent) - Math.abs(a.changePercent)
                )
                .slice(0, 5)
                .map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(stock.price)}
                      </p>
                    </div>
                    <Badge
                      variant={stock.change > 0 ? "default" : "destructive"}
                    >
                      {stock.change > 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stock Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Prices</CardTitle>
            <CardDescription>
              Real-time stock data with sorting and filtering capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th
                        className="cursor-pointer px-4 py-3 text-left font-medium hover:text-primary"
                        onClick={() => handleSort("symbol")}
                      >
                        Symbol{" "}
                        {sortField === "symbol" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="cursor-pointer px-4 py-3 text-left font-medium hover:text-primary"
                        onClick={() => handleSort("name")}
                      >
                        Company{" "}
                        {sortField === "name" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="cursor-pointer px-4 py-3 text-right font-medium hover:text-primary"
                        onClick={() => handleSort("price")}
                      >
                        Price{" "}
                        {sortField === "price" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="cursor-pointer px-4 py-3 text-right font-medium hover:text-primary"
                        onClick={() => handleSort("change")}
                      >
                        Change{" "}
                        {sortField === "change" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="cursor-pointer px-4 py-3 text-right font-medium hover:text-primary"
                        onClick={() => handleSort("changePercent")}
                      >
                        Change %{" "}
                        {sortField === "changePercent" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="cursor-pointer px-4 py-3 text-right font-medium hover:text-primary"
                        onClick={() => handleSort("volume")}
                      >
                        Volume{" "}
                        {sortField === "volume" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Market Cap
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <tr
                        key={stock.symbol}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 font-mono font-semibold">
                          {stock.symbol}
                        </td>
                        <td className="px-4 py-3">{stock.name}</td>
                        <td className="px-4 py-3 text-right font-mono">
                          {formatCurrency(stock.price)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-mono ${
                            stock.change > 0
                              ? "text-chart-2"
                              : stock.change < 0
                              ? "text-chart-5"
                              : "text-foreground"
                          }`}
                        >
                          {stock.change > 0 ? "+" : ""}
                          {formatCurrency(stock.change)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-mono ${
                            stock.changePercent > 0
                              ? "text-chart-2"
                              : stock.changePercent < 0
                              ? "text-chart-5"
                              : "text-foreground"
                          }`}
                        >
                          {stock.changePercent > 0 ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                          {formatVolume(stock.volume)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                          {stock.marketCap
                            ? formatMarketCap(stock.marketCap)
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
