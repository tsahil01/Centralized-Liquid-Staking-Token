"use client";

import React from "react";
import type { SVGProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ArrowDownUp, ArrowRight, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { OWNER_PUBLIC_KEY, TOKEN_MINT } from "@/lib/accounts";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

export default function Home() {
  const { toast } = useToast();
  const wallet = useWallet();
  const { connection } = useConnection();

  const ownerSolAddress = new PublicKey(OWNER_PUBLIC_KEY);
  const tokenMintAddress = new PublicKey(TOKEN_MINT);

  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenValue] = useState(0); // in USD
  const [tokenType] = useState("TP");

  const [nativeAmount, setNativeAmount] = useState(1);
  const [nativeValue] = useState(0); // in USD
  const [nativeType] = useState("SOL");
  const [apy, setApy] = useState({ apy: 0, earnedAmount: 0 });

  const [fetching, setFetching] = useState(false);
  const [up, setUp] = useState(nativeType);

  useEffect(() => {
    fetchApy(LAMPORTS_PER_SOL);
  }, []);

  async function fetchApy(amount: number) {
    setFetching(true);
    toast({
      title: "Fetching APY",
      description: "Fetching APY from the server...",
    });

    try {
      const response = await fetch(`/api/apy?amount=${amount}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("APY: ", JSON.stringify(data.apy));
      setApy(data.apy);

      if (up === tokenType) {
        setNativeAmount(
          (LAMPORTS_PER_SOL * tokenAmount +
            tokenAmount * data.apy.earnedAmount) /
            LAMPORTS_PER_SOL
        );
      } else {
        setTokenAmount(
          (nativeAmount * LAMPORTS_PER_SOL -
            nativeAmount * data.apy.earnedAmount) /
            LAMPORTS_PER_SOL
        );
      }
    } catch (error) {
      console.error("Failed to fetch APY:", error);
    } finally {
      setFetching(false);
    }
  }

  const handleSwap = () => {
    fetchApy(LAMPORTS_PER_SOL);

    if (up === tokenType) {
      setNativeAmount(tokenAmount);
      setUp(nativeType);
    } else {
      setTokenAmount(nativeAmount);
      setUp(tokenType);
    }
  };

  async function stakeNow() {
    if (!wallet.publicKey) {
      console.error("Wallet public key is null");
      return;
    }

    if (wallet.publicKey) {
      if (up === nativeType) {
        const transaction = await new Transaction();
        transaction.add(
          await SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: ownerSolAddress,
            lamports: Math.floor(nativeAmount * LAMPORTS_PER_SOL),
          })
        );
        const send = await wallet.sendTransaction(transaction, connection);
        console.log(send);
        toast({
          title: "Transaction Success",
          description: `Transaction of ${nativeAmount} SOL was successful. Tx: ${send}`,
        });
      } else {
        console.log("Token mint address: ", tokenMintAddress.toString());
        console.log("Owner SOL address: ", ownerSolAddress.toString());
        console.log("Wallet public key: ", wallet.publicKey.toString());

        try {
          const fromTokenAccount = await getAssociatedTokenAddress(
            tokenMintAddress,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID
          );
          console.log("From token account: ", fromTokenAccount.toString());

          const toTokenAccount = await getAssociatedTokenAddress(
            tokenMintAddress,
            ownerSolAddress,
            false,
            TOKEN_2022_PROGRAM_ID
          );
          console.log("To token account: ", toTokenAccount.toString());

          const transaction = await new Transaction().add(
            createTransferInstruction(
              fromTokenAccount,
              toTokenAccount,
              wallet.publicKey,
              Math.floor(tokenAmount * LAMPORTS_PER_SOL),
              [],
              TOKEN_2022_PROGRAM_ID
            )
          );
          console.log("Transaction: ", transaction);

          const send = await wallet.sendTransaction(transaction, connection);
          console.log(send);

          toast({
            title: "Transaction Success",
            description: `Transaction of ${tokenAmount} TP was successful. Tx: ${send}`,
          });

          const dataToSend = [
            {
              type: "TOKENTRANSFER",
              from: wallet.publicKey.toString(),
              to: ownerSolAddress.toString(),
              amount: Math.floor(tokenAmount * LAMPORTS_PER_SOL),
            },
          ];

          const response = await fetch(`/api/webhook`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: dataToSend,
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Webhook response: ", data);
          
        } catch (error) {
          console.error("Failed to stake tokens:", error);
          toast({
            title: "Transaction Failed",
            description: `Failed to stake tokens: ${error}`,
          });
        }
      }
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center min-h-screen w-full mx-auto p-5">
        <div className="flex flex-row gap-4 w-auto">
          <WalletMultiButton />
          <Button
            className="mx-auto rounded-full my-auto"
            size={"lg"}
            variant={"link"}
            onClick={() => {
              fetchApy(LAMPORTS_PER_SOL);
            }}
          >
            Refetch APY
          </Button>
        </div>

        <Card className="p-6 rounded-lg shadow-lg ">
          <CardHeader>
            <CardTitle className="text-4xl font-bold ">Stake Tokens</CardTitle>
            <CardDescription>
              {"Stake your tokens to earn rewards"}
            </CardDescription>
          </CardHeader>

          <CardContent className="my-4">
            <div className="flex flex-col gap-6 mx-auto">
              <div className="rounded-xl border flex flex-col gap-6 p-4 bg-primary/10">
                <p className="font-bold">{"You're Selling"}</p>

                <div className="flex flex-row gap-2 justify-between">
                  <div className="rounded-xl bg-primary/20 border px-5 py-2 font-bold flex flex-row my-auto gap-2">
                    {up === tokenType ? (
                      <Coins className="w-6 h-6 mr-2" />
                    ) : (
                      <SimpleIconsSolana className="my-auto mr-2" />
                    )}
                    <p className="my-auto">
                      {up === tokenType ? tokenType : nativeType}
                    </p>
                  </div>

                  <div className="px-5 py-2 font-bold flex flex-col my-auto justify-end border-0">
                    <Input
                      className="text-right text-3xl border-0 ring-0 bg-none shadow-none focus:border-0 focus:ring-0 focus:bg-none focus:shadow-none"
                      value={up === tokenType ? tokenAmount : nativeAmount}
                      disabled={fetching}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isValidNumber = /^\d*\.?\d{0,2}$/.test(value);
                        if (isValidNumber) {
                          const parsedValue = parseFloat(value) || 0;

                          if (up === tokenType) {
                            setTokenAmount(parsedValue);
                            setNativeAmount(
                              (LAMPORTS_PER_SOL * parsedValue +
                                parsedValue * apy.earnedAmount) /
                                LAMPORTS_PER_SOL
                            );
                          } else {
                            setNativeAmount(parsedValue);
                            setTokenAmount(
                              (parsedValue * LAMPORTS_PER_SOL -
                                parsedValue * apy.earnedAmount) /
                                LAMPORTS_PER_SOL
                            );
                          }
                        }
                      }}
                    />
                    {(up === tokenType ? tokenAmount : nativeAmount) > 0 && (
                      <p className="text-sm text-primary/40 text-right">
                        {`$ ${up === tokenType ? tokenValue : nativeValue}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="mx-auto rounded-full"
                size={"lg"}
                variant={"outline"}
                onClick={handleSwap}
              >
                <ArrowDownUp className="w-9 h-9 font-bold " />
              </Button>

              <div className="rounded-xl border flex flex-col gap-6 p-4 bg-primary/10">
                <p className="font-bold">{"You're Receiving"}</p>

                <div className="flex flex-row gap-2 justify-between">
                  <div className="rounded-xl bg-primary/20 border px-5 py-2 font-bold flex flex-row my-auto gap-2">
                    {up === tokenType ? (
                      <SimpleIconsSolana className="my-auto mr-2" />
                    ) : (
                      <Coins className="w-6 h-6 mr-2" />
                    )}
                    {up === tokenType ? nativeType : tokenType}
                  </div>

                  <div className="px-5 py-2 font-bold flex flex-col my-auto justify-end">
                    <p className="text-3xl text-right">
                      {up === tokenType ? nativeAmount : tokenAmount}
                    </p>
                    {(up === tokenType ? nativeAmount : tokenAmount) > 0 && (
                      <p className="text-sm text-primary/40 text-right">
                        {`$ ${up === tokenType ? nativeValue : tokenValue}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              className=""
              size={"lg"}
              variant={"default"}
              onClick={stakeNow}
            >
              <p className="font-bold">{"Stake"}</p>
              <ArrowRight className="w-9 h-9 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

function SimpleIconsSolana(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m23.876 18.031l-3.962 4.14a.9.9 0 0 1-.306.21a.9.9 0 0 1-.367.074H.46a.47.47 0 0 1-.252-.073a.45.45 0 0 1-.17-.196a.44.44 0 0 1-.031-.255a.44.44 0 0 1 .117-.23l3.965-4.139a.9.9 0 0 1 .305-.21a.9.9 0 0 1 .366-.075h18.78a.47.47 0 0 1 .252.074a.45.45 0 0 1 .17.196a.44.44 0 0 1 .031.255a.44.44 0 0 1-.117.23m-3.962-8.335a.9.9 0 0 0-.306-.21a.9.9 0 0 0-.367-.075H.46a.47.47 0 0 0-.252.073a.45.45 0 0 0-.17.197a.44.44 0 0 0-.031.254a.44.44 0 0 0 .117.23l3.965 4.14a.9.9 0 0 0 .305.21a.9.9 0 0 0 .366.074h18.78a.47.47 0 0 0 .252-.073a.45.45 0 0 0 .17-.196a.44.44 0 0 0 .031-.255a.44.44 0 0 0-.117-.23zM.46 6.723h18.782a.9.9 0 0 0 .367-.075a.9.9 0 0 0 .306-.21l3.962-4.14a.44.44 0 0 0 .117-.23a.44.44 0 0 0-.032-.254a.45.45 0 0 0-.17-.196a.47.47 0 0 0-.252-.073H4.76a.9.9 0 0 0-.366.074a.9.9 0 0 0-.305.21L.125 5.97a.44.44 0 0 0-.117.23a.44.44 0 0 0 .03.254a.45.45 0 0 0 .17.196a.47.47 0 0 0 .252.074z"
      ></path>
    </svg>
  );
}
