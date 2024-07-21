"use client";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import {
  addCoin,
  removeCoin,
  setWatchlist,
  toggleTheme,
} from "@/app/store/watchlistSlice";
import styles from "@/app/styles/DroppableWatchlist.module.css";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const DroppableWatchlist = () => {
  const dispatch = useDispatch();
  const { watchlist = [], theme } = useSelector((state) => state.watchlist);
  const isDarkMode = theme === "dark";
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      dispatch(setWatchlist(JSON.parse(savedWatchlist).watchlist));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify({ watchlist, theme }));
  }, [watchlist, theme]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "COIN",
    drop: (item) => {
      const coinExists = watchlist.some((coin) => coin?.id === item.coin?.id);
      if (!coinExists) {
        dispatch(addCoin(item.coin));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleRemove = (id) => {
    dispatch(removeCoin(id));
  };

  const formatMarketCap = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }
    return value?.toLocaleString();
  };

  return (
    <div
      ref={drop}
      className={`${styles.watchlist} ${
        isDarkMode ? styles.darkMode : styles.lightMode
      }`}
      style={{
        backgroundColor: isOver
          ? isDarkMode
            ? "#444"
            : "#f0f0f0"
          : isDarkMode
          ? "#000"
          : "#fff",
      }}
    >
      <div className={styles.market_header}>
        <h2>Watchlist</h2>
        <a href="/explore" className={styles.viewMore}>
          View more coins
        </a>
      </div>
      {watchlist.length > 0 ? (
        <table className={styles.market_table}>
          <thead>
            <tr>
              <th>Token</th>
              <th>Last Price</th>
              <th>24H Change</th>
              <th>Market Cap</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles["table-body"]}>
            {watchlist.map((coin) => (
              <tr key={coin?.id}>
                <td
                  className={`${styles["text_data"]} flex flex-row font-bold`}
                >
                  <Image
                    src={coin?.image}
                    alt={coin?.name}
                    className={styles.coinImage}
                    width={24}
                    height={24}
                  />
                  <a href={`/${coin?.id}`}>{coin?.name}</a>
                </td>
                <td className={styles["text_data"]}>
                  ${coin?.current_price?.toLocaleString()}
                </td>
                <td
                  className={
                    coin?.price_change_percentage_24h >= 0
                      ? styles["positive-change"]
                      : styles["negative-change"]
                  }
                >
                  {coin?.price_change_percentage_24h >= 0 ? "▲" : "▼"}
                  {coin?.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className={styles["text_data"]}>
                  ${formatMarketCap(coin?.market_cap)}
                </td>
                <td className={styles["text_data"]}>
                  <button onClick={() => handleRemove(coin?.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          className="flex flex-col justify-center items-center"
          style={{ color: isDarkMode ? "#a19d9d" : "#000" }}
        >
          WatchList is Empty! <div> Add your favourite coins here 😉</div>
        </div>
      )}
    </div>
  );
};

export default DroppableWatchlist;
