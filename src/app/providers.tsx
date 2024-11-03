"use client"

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint =
    "https://devnet.helius-rpc.com/?api-key=5ee90506-9542-4e79-aa66-a9280837284a";

  const wallets = useMemo(() => [], [network]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
