"use client";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "@/app/styles/MarketCapChart.css";
import Loading from "./Loading";
import { useSelector } from "react-redux"; // Import useSelector

// Register the necessary components
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MarketCryptoChart = () => {
  const [chartData, setChartData] = useState(null);
  const theme = useSelector((state) => state.watchlist.theme); // Get theme from Redux store
  const isDarkMode = theme === "dark"; // Determine if dark mode is active

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "bitcoin,ethereum,litecoin",
              order: "market_cap_desc",
              per_page: 3,
              page: 1,
              sparkline: true,
              x_cg_demo_api_key: process.env.NEXT_PUBLIC_API_KEY
            },
            headers:{
              accept: 'application/json',
              'x-cg-demo-api-key': process.env.NEXT_PUBLIC_API_KEY
            }
          }
        );
        
        const data = response.data;
        const btcPrices = data.find((coin) => coin.id === "bitcoin")
          .sparkline_in_7d.price;
        const ethPrices = data.find((coin) => coin.id === "ethereum")
          .sparkline_in_7d.price;
        const ltcPrices = data.find((coin) => coin.id === "litecoin")
          .sparkline_in_7d.price;

        setChartData({
          labels: btcPrices.map((_, index) => new Date().setHours(index)),
          datasets: [
            {
              label: "BTC",
              data: btcPrices,
              borderColor: "#FF6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "ETH",
              data: ethPrices,
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "LTC",
              data: ltcPrices,
              borderColor: "#FFCE56",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error(
          "Error fetching the data from CoinGecko API. Using dummy data.",
          error
        );
        
      }
    };

    fetchData();
  });
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = "black";
    } else {
      document.body.style.backgroundColor = "white";
    }
  }, [isDarkMode]);
  if (!chartData) {
    // window.location.reload();
    return <Loading />;
  }

  return (
    <div
      className="chart-container"
      style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
    >
      <div
        className="market-header"
        style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
      >
        <h2 style={{ color: isDarkMode ? "#fff" : "#000" }}>Market Chart</h2>
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "hour",
                tooltipFormat: "ll HH:mm",
              },
              title: {
                display: true,
                text: "Time",
                color: isDarkMode ? "#ddd" : "#000",
              },
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: true,
                text: "Price (USD)",
                color: isDarkMode ? "#ddd" : "#000",
              },
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: isDarkMode ? "#ddd" : "#000",
                usePointStyle: true,
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          elements: {
            point: {
              radius: 0,
            },
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          // Set canvas background color
          responsive: true,
          maintainAspectRatio: false,
          backgroundColor: isDarkMode ? "#000" : "#fff",
        }}
        style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
      />
    </div>
  );
};

export default MarketCryptoChart;
