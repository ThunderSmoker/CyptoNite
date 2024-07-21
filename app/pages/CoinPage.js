"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Line } from "react-chartjs-2";
import Plus from "@/app/images/plus.png";
import Tick from "@/app/images/tick.png";
import styles from "@/app/styles/CoinPage.module.css";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { addCoin, removeCoin } from "../store/watchlistSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
const intervals = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "1Y": 365,
  "5Y": 1825,
  ALL: "max",
};

const ChartSection = ({
  chartData,
  timeInterval,
  setTimeInterval,
  isDarkMode,
}) => {
  const data = {
    labels:
      chartData?.prices?.map((price) => {
        const date = new Date(price[0]);
        switch (timeInterval) {
          case "1D":
            return date.toLocaleTimeString();
          case "1W":
          case "1M":
            return date.toLocaleDateString();
          case "1Y":
          case "5Y":
          case "ALL":
            return date.toLocaleDateString("default", {
              month: "short",
              year: "numeric",
            });
          default:
            return date.toLocaleDateString();
        }
      }) || [],
    datasets: [
      {
        label: "Price",
        data: chartData?.prices?.map((price) => price[1]) || [],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <div className={styles["time-intervals"]}>
        {Object.keys(intervals).map((interval) => (
          <button
            key={interval}
            className={timeInterval === interval ? "active" : ""}
            onClick={() => setTimeInterval(interval)}
            style={{
              color: isDarkMode ? "#fff" : "#000",
              border:
                timeInterval === interval
                  ? "2px solid #02588e"
                  : "2px solid grey",
            }}
          >
            {interval}
          </button>
        ))}
      </div>
      <Line data={data} />
    </div>
  );
};

const CoinSummary = ({ coin, isAdded, setIsAdded }) => {
  const dispatch = useDispatch();
  const isPositive = coin?.market_data?.price_change_percentage_24h >= 0;
  // console.log("here"+isAdded);

  const handletoggle = () => {
    // console.log("ther"+isAdded);
    if (!isAdded) {
      dispatch(addCoin(coin));
      toast.success("Coin added to watchlist");
    } else {
      console.log(coin);
      dispatch(removeCoin(coin.id));
      toast.error("Coin removed from watchlist");
    }
    setIsAdded(!isAdded);
  };
  return (
    <div className={styles.coinSummary}>
      <div className={styles.coinIcon}>
        {coin?.image?.small && (
          <Image
            src={coin.image.small}
            alt={`${coin?.name} icon`}
            width={40}
            height={40}
          />
        )}
      </div>
      <div className={styles.coinInfo}>
        <span className={styles.coinName}>{coin?.name}</span>
        <span className={styles.coinPrice}>
          ${coin?.market_data?.current_price?.usd?.toLocaleString()}
          <button onClick={handletoggle} className={styles.button_plus}>
            {isAdded ? (
              <Image src={Tick} alt="Added" />
            ) : (
              <Image src={Plus} alt="Add to Watchlist" />
            )}
          </button>
        </span>
        <div className={styles.priceChange}>
          <span
            className={
              isPositive ? styles.positiveChange : styles.negativeChange
            }
          >
            {isPositive ? "↑" : "↓"}{" "}
            {Math.abs(coin?.market_data?.price_change_percentage_24h).toFixed(
              4
            )}
            %
          </span>
          <span className={styles.priceChangeValue}>
            {coin?.market_data?.price_change_24h?.toFixed(4)} Today
          </span>
        </div>
      </div>
    </div>
  );
};

const PerformanceSection = ({ coinData }) => {
  const getBarWidth = (low, high, value) =>
    ((value - low) / (high - low)) * 100;

  const todayLow = coinData?.market_data?.low_24h?.usd;
  const todayHigh = coinData?.market_data?.high_24h?.usd;
  const yearlyLow = coinData?.market_data?.atl?.usd;
  const yearlyHigh = coinData?.market_data?.ath?.usd;
  const currentPrice = coinData?.market_data?.current_price?.usd;

  return (
    <div className={styles.performance}>
      <h2 className={styles.headerTitle}>Performance</h2>
      <div className={styles.performanceBar}>
        <span>
          Today's Low <br /> <b>{todayLow}</b>{" "}
        </span>
        <div className={styles.barWrapper}>
          <div
            className={styles.bar}
            style={{
              width: `${getBarWidth(todayLow, todayHigh, currentPrice) || 0}%`,
            }}
          ></div>
          <span
            className={styles.marker}
            style={{
              left: `${getBarWidth(todayLow, todayHigh, currentPrice) || 0}%`,
            }}
          >
            &#x25B2;
          </span>
        </div>
        <span>
          Today's High <br /> <b>{todayHigh}</b>
        </span>
      </div>
      <div className={styles.performanceBar}>
        <span>
          52W Low <br /> <b>{yearlyLow}</b>
        </span>
        <div className={styles.barWrapper}>
          <div
            className={styles.bar}
            style={{
              width: `${
                getBarWidth(yearlyLow, yearlyHigh, currentPrice) || 0
              }%`,
            }}
          ></div>
          <span
            className={styles.marker}
            style={{
              left: `${getBarWidth(yearlyLow, yearlyHigh, currentPrice) || 0}%`,
            }}
          >
            &#x25B2;
          </span>
        </div>
        <span>
          52W High <br /> <b>{yearlyHigh}</b>
        </span>
      </div>
    </div>
  );
};

const FundamentalsSection = ({ coinData }) => (
  <div className={styles.fsection}>
    <h2 className={styles.header_title}>Fundamentals</h2>
    <div className={styles.fundamentals}>
      <div className={styles.item}>
        <span className={styles.label}>Market Cap</span>
        <span className={styles.value}>
          ${formatMarketCap(coinData?.market_data?.market_cap?.usd)}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Fully Diluted Valuation</span>
        <span className={styles.value}>
          $
          {formatMarketCap(coinData?.market_data?.fully_diluted_valuation?.usd)}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>24 Hour Trading Vol</span>
        <span className={styles.value}>
          ${formatMarketCap(coinData?.market_data?.total_volume?.usd)}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Circulating Supply</span>
        <span className={styles.value}>
          {coinData?.market_data?.circulating_supply?.toLocaleString()}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Total Supply</span>
        <span className={styles.value}>
          {coinData?.market_data?.total_supply?.toLocaleString()}
        </span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Max Supply</span>
        <span className={styles.value}>
          {coinData?.market_data?.max_supply?.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

const AboutSection = ({ coinData }) => (
  <div className={styles.about}>
    <h2 className={styles.header_title}>About {coinData?.name}</h2>
    <p
      className={styles.abtp}
      dangerouslySetInnerHTML={{
        __html: (coinData?.description?.en || "").replace(/'/g, "&#39;"),
      }}
    ></p>
  </div>
);

const formatMarketCap = (value) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)} K`;
  }
  return value.toLocaleString();
};

const CoinPage = () => {
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [timeInterval, setTimeInterval] = useState("1Y");
  const pathname = usePathname();
  const id = pathname;
  const { watchlist = [], theme } = useSelector((state) => state.watchlist);
  const isDarkMode = theme === "dark";
  const [isAdded, setIsAdded] = useState(
    watchlist.some((coin) => coin.id === id.substring(1))
  );
  // console.log(watchlist,isAdded);

  const fetchCoinData = async (id) => {
    try {
      const coinResponse = await axios.get(
        `https://api.coingecko.com/api/v3/coins${id}`,
        {
          params: {
            x_cg_pro_api_key: process.env.API_KEY, // Use NEXT_PUBLIC_API_KEY for client-side
          },
        }
      );
      setCoinData(coinResponse.data);
    } catch (error) {
      console.error("Error fetching coin data:", error);
    }
  };

  const fetchChartData = async (id, interval) => {
    try {
      const days = intervals[interval];
      const chartResponse = await axios.get(
        `https://api.coingecko.com/api/v3/coins${id}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days,
            x_cg_pro_api_key: process.env.API_KEY, // Use NEXT_PUBLIC_API_KEY for client-side
          },
        }
      );
      setChartData(chartResponse.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCoinData(id);
      fetchChartData(id, timeInterval);
    }
    if (isDarkMode) {
      document.body.style.backgroundColor = "black";
    } else {
      document.body.style.backgroundColor = "white";
    }
  }, [id, timeInterval, isDarkMode]);

  if (!coinData || !chartData) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div
        className={`${styles.container} ${isDarkMode ? styles.darkMode : ""}`}
      >
        <CoinSummary
          coin={coinData}
          isAdded={isAdded}
          setIsAdded={setIsAdded}
        />
        <div style={{ height: "2rem" }}></div>
        <ChartSection
          chartData={chartData}
          timeInterval={timeInterval}
          setTimeInterval={setTimeInterval}
          isDarkMode={isDarkMode}
        />
        <PerformanceSection coinData={coinData} />
        <FundamentalsSection coinData={coinData} />
        <AboutSection coinData={coinData} />
      </div>
    </>
  );
};

export default CoinPage;
