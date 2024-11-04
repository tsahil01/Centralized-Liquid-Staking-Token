"use client";

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
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ArrowDownUp, ArrowRight, Coins } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenValue, setTokenValue] = useState(0); // in USD
  const [tokenType, setTokenType] = useState("POP");

  const [nativeAmount, setNativeAmount] = useState(0);
  const [nativeValue, setNativeValue] = useState(0); // in USD
  const [nativeType, setNativeType] = useState("SOL");
  const [apy, setApy] = useState(0);

  useEffect(() => {
    async function fetchApy() {
      const response = await fetch("/api/apy");
      const data = await response.json();
      setApy(data.apy);
    }

    fetchApy();
  }, [])

  const [up, setUp] = useState(tokenType);

  const handleSwap = () => {
    if (up == tokenType) {
      setNativeAmount(tokenAmount);
      setTokenAmount(0);
      setUp(nativeType);
    } else {
      setTokenAmount(nativeAmount);
      setNativeAmount(0);
      setUp(tokenType);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center min-h-screen w-full mx-auto p-5">
        <WalletMultiButton />
        <Card className="p-6 rounded-lg shadow-lg ">
          <CardHeader>
            <CardTitle className="text-4xl font-bold ">Stake Tokens</CardTitle>
            <CardDescription className="">
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

                  <div className="px-5 py-2 font-bold flex flex-col my-auto justify-end">
                    <Input
                      className="text-right text-3xl focus:outline-none focus:ring-0 focus:border-transparent outline-none focus:border-0 ring-0"
                      value={up === tokenType ? tokenAmount : nativeAmount}
                      onChange={(e) => {
                        if (up === tokenType) {
                          setTokenAmount(parseFloat(e.target.value));
                        } else {
                          setNativeAmount(parseFloat(e.target.value));
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
                className="mx-auto bg-primary/30 rounded-full"
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
            <Button className="" size={"lg"} variant={"default"}>
              <p className="font-bold">{"Stake"}</p>
              <ArrowRight className="w-9 h-9 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

import React from "react";
import type { SVGProps } from "react";

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
