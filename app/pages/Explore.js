import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { useSelector } from "react-redux";
import DraggableCoinForExplore from "../components/DraggableCoinForExplore";
import DroppableWatchlist from "../components/DroppableWatchlist";
import Loading from "../components/Loading";
import styles from "@/app/styles/Explore.module.css";

const fetchCoins = async (page) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: page,
          price_change_percentage: "1h, 24h, 7d, 1y",
          sparkline: false,
       
        },
        headers:{
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
      }
    );
    console.log("Coin data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching coin data:", error);
    return [];
  }
};

const Explore = () => {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const theme = useSelector((state) => state.watchlist.theme); // Get the current theme
  const isDarkMode = theme === "dark"; // Determine if dark mode is active
  useEffect(() => {
    const getCoins = async () => {
      const coinsData = await fetchCoins(page);
      setCoins(coinsData);
      console.log(coinsData);
    };
    getCoins();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <DndProvider
      backend={HTML5Backend}
      style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
    >
      <div
        className={styles.market_header}
        style={{
          backgroundColor: isDarkMode ? "#000" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <h2 style={{ color: isDarkMode ? "#fff" : "#000" }}>All Coins</h2>
      </div>
      {coins.length > 0 && (
        <div
          className="flex  items-center justify-center pb-2"
          style={{ backgroundColor: isDarkMode ? "#000" : "#fff" }}
        >
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="w-8 h-8 text-white bg-blue-500 rounded-full disabled:bg-gray-300"
          >
            &lt;
          </button>
          <span
            className="mx-4 text-gray-700 font-semibold"
            style={{ color: isDarkMode ? "#f0f0f0" : "#000" }}
          >
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="w-8 h-8 text-white bg-blue-500 rounded-full disabled:bg-gray-300"
          >
            &gt;
          </button>
        </div>
      )}
      <div className={styles.mcontainer}>
        <div
          className={styles.container}
          style={{ backgroundColor: isDarkMode ? "#000" : "#f0f0f0" }}
        >
          {coins.length > 0 ? (
            <table className={styles.market_table}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Last Price</th>
                  <th>1H Price %</th>
                  <th>1D Price</th>
                  <th>1D MCap</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {coins.map((coin) => (
                  <DraggableCoinForExplore
                    key={coin.id}
                    coin={coin}
                    isWatchlist={false}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <Loading />
          )}
        </div>
        <DroppableWatchlist />
      </div>
    </DndProvider>
  );
};

export default Explore;
