"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector to access the theme
import axios from "axios";
import styles from "@/app/styles/TrendingMarket.module.css"; // Import the CSS module
import Link from "next/link";
import DraggableCoinForHome from "./DraggableCoinForHome";

const TrendingMarket = () => {
  const [marketData, setMarketData] = useState([]);
  const theme = useSelector((state) => state.watchlist.theme); // Get the current theme
  const isDarkMode = theme === "dark"; // Determine if dark mode is active

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 5,
              page: 1,
              x_cg_pro_api_key: process.env.API_KEY,
            },
          }
        );
        setMarketData(response.data);
        console.log("Market data:", response.data);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div
      className={`${styles.marketContainer} ${
        isDarkMode ? styles.darkMode : ""
      }`}
      style={{ backgroundColor: isDarkMode ? "#000" : "#f0f0f0" }}
    >
      <div className={styles.marketHeader}>
        <h2>Trending Market</h2>
        <Link href="/explore" className={styles.viewMore}>
          View more coins
        </Link>
      </div>
      <table className={styles.marketTable}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>1D Price %</th>
            <th>1D MCap %</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {marketData.map((coin) => (
            <DraggableCoinForHome key={coin.id} coin={coin} isWatchlist={false} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendingMarket;
