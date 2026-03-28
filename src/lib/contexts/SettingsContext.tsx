"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "USD" | "INR";
type DateFormat = "MM/DD/YYYY" | "DD-MM-YYYY";

interface SettingsContextType {
  currency: Currency;
  dateFormat: DateFormat;
  exchangeRate: number; // USD to INR
  setCurrency: (c: Currency) => void;
  setDateFormat: (f: DateFormat) => void;
  formatCurrency: (amountInUSD: number, decimals?: number) => string;
  formatDate: (dateStr: string | Date) => string;
  convertAmount: (amountInUSD: number) => number;
  currencySymbol: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [dateFormat, setDateFormatState] = useState<DateFormat>("DD-MM-YYYY");
  const exchangeRate = 83.5;

  // Load from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("nexora_currency") as Currency;
    const savedDateFormat = localStorage.getItem("nexora_date_format") as DateFormat;
    
    if (savedCurrency === "USD" || savedCurrency === "INR") {
      setCurrencyState(savedCurrency);
    }
    if (savedDateFormat === "MM/DD/YYYY" || savedDateFormat === "DD-MM-YYYY") {
      setDateFormatState(savedDateFormat);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("nexora_currency", c);
  };

  const setDateFormat = (f: DateFormat) => {
    setDateFormatState(f);
    localStorage.setItem("nexora_date_format", f);
  };

  const convertAmount = (amountInUSD: number) => {
    return currency === "USD" ? amountInUSD : amountInUSD * exchangeRate;
  };

  const currencySymbol = currency === "USD" ? "$" : "₹";

  const formatCurrency = (amountInUSD: number, decimals: number = 2) => {
    const converted = convertAmount(amountInUSD);
    const options: Intl.NumberFormatOptions = {
      style: "currency",
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    
    // Use Intl for robust formatting
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", options).format(converted);
  };

  const formatDate = (dateInput: string | Date) => {
    if (!dateInput) return "N/A";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Invalid Date";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    if (dateFormat === "DD-MM-YYYY") {
      return `${day} ${month} ${year}`;
    }
    return `${month}/${day}/${year}`;
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        currency, 
        dateFormat, 
        exchangeRate, 
        setCurrency, 
        setDateFormat, 
        formatCurrency, 
        formatDate,
        convertAmount,
        currencySymbol
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
