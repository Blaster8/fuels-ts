import "@/styles/globals.css";
// #region wallet-sdk-react-provider
import { defaultConnectors } from '@fuels/connectors';
import { FuelProvider } from "@fuels/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import React from "react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <FuelProvider fuelConfig={{ connectors: defaultConnectors({ devMode: true }) }}>
          <Component { ...pageProps } />
        </FuelProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
// #endregion wallet-sdk-react-provider


