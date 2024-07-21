"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";

const Loading = () => {
  const [showReloadMessage, setShowReloadMessage] = useState(false);
  const { theme } = useSelector((state) => state.watchlist);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReloadMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex items-center justify-center">
        <PacmanLoader color={isDarkMode ? "#fff" : "#000"} />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Loading...</p>
      {showReloadMessage && (
        <p className="mt-4 text-red-500">
          The page is taking too long to load. Please{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 underline hover:text-blue-700"
          >
            reload
          </button>.
        </p>
      )}
    </div>
  );
};

export default Loading;
