"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { Toaster } from "react-hot-toast";
import store from '@/app/store/store';
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
        <Toaster position="bottom-center" />
          {children}
        </Provider>
      </body>
    </html>
  );
}
