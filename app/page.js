"use client";
import React, { useEffect } from "react";
import Home from "./pages/Home";
import store from "@/app/store/store";
import { Provider, useSelector } from "react-redux";
import { Inter } from "next/font/google";
import Logo from "@/app/images/cryptob.png";
const inter = Inter({ subsets: ["latin"] });
const page = () => {
  const { theme } = useSelector((state) => state.watchlist);
  console.log(theme);
  const isDarkMode = theme === "dark";
  
  useEffect(() => {
    function toggleDarkMode(mode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.toggle("dark");
    }
    if (isDarkMode) {
      toggleDarkMode(theme);
    }
  }, [theme]);
  return (
    <html lang="en">
      <link rel="icon" href={Logo} sizes="any" />
      <body className={inter.className}>
        <Provider store={store}>
          <Home />
        </Provider>
      </body>
    </html>
  );
};

export default page;
