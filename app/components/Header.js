"use client";

import { useState, useEffect } from "react";
import styles from "@/app/styles/Header.module.css";
import "../globals.css"; // Import the CSS module
import Sun from "@/app/images/icons8-sun-50.png";
import Moon from "@/app/images/icons8-moon-50.png";
import Image from "next/image";
import Logob from "@/app/images/cryptob.png";
import Logow from "@/app/images/cryptow.png";
import { toggleTheme } from "../store/watchlistSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.watchlist);
  const isDarkMode = theme === "dark";
  

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search?query=${query}`,
        {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );
      setSuggestions(response.data.coins || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (coin) => {
    setSearchQuery(coin.name);
    setSuggestions([]);
  };

  return (
    <header
      className={`${styles.header} ${isDarkMode ? styles.dark : ""}`}
      style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
    >
      <a href="/">
        <div className={styles.logo}>
          {isDarkMode ? (
            <Image src={Logob} alt="Logo" />
          ) : (
            <Image src={Logow} alt="Logo" />
          )}
        </div>
      </a>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((coin) => (
              <li
                key={coin.id}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(coin)}
              >
                <a href={`/${coin.id}`}>
                  <Image
                    src={coin.thumb}
                    alt={coin.name}
                    width={20}
                    height={20}
                    className={styles.suggestionImage}
                  />
                  {coin.name} ({coin.symbol})
                </a>
              </li>
            ))}
          </ul>
        )}
        {suggestions.length === 0 && searchQuery.length >=3 && (
          <ul className={styles.suggestions}>
            <li className={styles.suggestionItem}>No Data Found!</li>
          </ul>
        )}
      </div>
      <div className={styles.themeToggle} onClick={toggleDarkMode}>
        {isDarkMode ? (
          <Image src={Sun} alt="Light Mode" />
        ) : (
          <Image src={Moon} alt="Dark Mode" />
        )}
      </div>
    </header>
  );
};

export default Header;
