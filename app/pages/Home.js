"use client";
import DroppableWatchlist from "../components/DroppableWatchlist";
import Header from "../components/Header";
import { DndProvider } from "react-dnd";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import store from "@/app/store/store";
const inter = Inter({ subsets: ["latin"] });
import { HTML5Backend } from "react-dnd-html5-backend";
import MarketCryptoChart from "../components/MarketCapChart";
import TrendingMarket from "../components/TrendingMarket";
export default function Home() {
  const mode = localStorage.getItem("mode");
  useEffect(() => {
    function toggleDarkMode(mode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.toggle("dark");
    }
    toggleDarkMode(mode);
  }, [mode]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <DndProvider backend={HTML5Backend}>
            <Header />
            <div>
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-2/3">
                  <MarketCryptoChart />
                  <span style={{ height: "2rem" }}></span>
                  <TrendingMarket />
                </div>
                <DroppableWatchlist className="w-full md:w-1/3" />
              </div>
            </div>
          </DndProvider>
        </Provider>
      </body>
    </html>
  );
}
