"use client";
import React from "react";
import { useDrag } from "react-dnd";
import styles from "@/app/styles/DraggableCoin.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";

const DraggableCoinForExplore = ({ coin, isWatchlist }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COIN",
    item: { coin },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get the current theme from the Redux store
  const theme = useSelector((state) => state.watchlist.theme);
  const isDarkMode = theme === "dark";
  const formatMarketCap = (value) => {
    
    if (Math.abs(value) >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (Math.abs(value) >= 1_000_000) {
      return `${(Math.abs(value) / 1_000_000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }
    return value.toLocaleString();
  };
  return (
    <tr
      key={coin.id}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={isDarkMode ? styles.darkMode : ""}
      
    >
      <td
        className={`${
          isDarkMode ? styles["text-data"] : styles["text-data"]
        } flex flex-row font-bold`}
        
      >
        <img src={coin.image} alt={coin.name} className={styles.coinImage} />
        <Link href={`/${coin.id}`}className={styles.coin_name}>{coin.name}</Link>
      </td>
      <td className={isDarkMode ? styles["text-data"] : styles["text-data"]}>
        ${coin.current_price.toLocaleString()}
      </td>
      <td
        className={
          coin.price_change_percentage_1h_in_currency>= 0
            ? isDarkMode
              ? styles["positive-change"]
              : styles["positive-change"]
            : isDarkMode
            ? styles["negative-change"]
            : styles["negative-change"]
        }
      >
        {coin.price_change_percentage_1h_in_currency >= 0 ? "▲" : "▼"}
        {coin.price_change_percentage_1h_in_currency.toFixed(2)}%
      </td>
      <td
        className={
          coin.price_change_24h >= 0
            ? isDarkMode
              ? styles["positive-change"]
              : styles["positive-change"]
            : isDarkMode
            ? styles["negative-change"]
            : styles["negative-change"]
        }
      >
        {coin.price_change_24h >= 0 ? "▲" : "▼"}
        {formatMarketCap(coin.price_change_24h.toFixed(2))}
      </td>
      {!isWatchlist && (
        <td
          className={
            coin.market_cap_change_24h >= 0
              ? isDarkMode
                ? styles["positive-change"]
                : styles["positive-change"]
              : isDarkMode
              ? styles["negative-change"]
              : styles["negative-change"]
          }
        >
          {coin.market_cap_change_24h >= 0 ? "▲" : "▼"}
          {formatMarketCap(coin.market_cap_change_24h)}
        </td>
      )}
      <td className={isDarkMode ? styles["text-data"] : styles["text-data"]}>
        {" "}
        ${formatMarketCap(coin.market_cap)}
      </td>
    </tr>
  );
};

export default DraggableCoinForExplore;
