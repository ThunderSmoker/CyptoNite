"use client";
import React from "react";
import Home from "./pages/Home";
import store from "@/app/store/store";
import { Provider } from "react-redux";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
const page = () => {
  
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <Provider store={store}>
          <Home />
        </Provider>
      </body>
    </html>
  );
};

export default page;
