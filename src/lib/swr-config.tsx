"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
}

// Default fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }
  return res.json();
};

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        // Don't revalidate on window focus by default (saves bandwidth)
        revalidateOnFocus: false,
        // Do revalidate when connection is restored
        revalidateOnReconnect: true,
        // Dedupe requests within 60 seconds
        dedupingInterval: 60000,
        // Keep previous data while revalidating
        keepPreviousData: true,
        // Error retry configuration
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        // Cache provider (use default in-memory cache)
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  );
}
