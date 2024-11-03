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
import { useState } from "react";

export default function Home() {
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenValue, setTokenValue] = useState(0); // in USD
  const [tokenType, setTokenType] = useState("mSOL");

  const [nativeAmount, setNativeAmount] = useState(0);
  const [nativeValue, setNativeValue] = useState(0); // in USD
  const [nativeType, setNativeType] = useState("SOL");

  const [up, setUp] = useState(tokenType);

  const handleSwap = () => {
    if (up == tokenType) {
      setUp(nativeType);
      setNativeAmount(tokenAmount);
      setTokenAmount(0);
    } else {
      setUp(tokenType);
      setTokenAmount(nativeAmount);
      setNativeAmount(0);
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
                <div className="flex font-bold">{"You're Selling"}</div>

                <div className="flex flex-row gap-2 justify-between">
                  <div className="rounded-xl bg-primary/20 border px-5 py-2 font-bold flex flex-row my-auto">
                    <Coins className="w-6 h-6 mr-2" />
                    {up === tokenType ? tokenType : nativeType}
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
                <div className="flex font-bold">{"You're Receiving"}</div>

                <div className="flex flex-row gap-2 justify-between">
                  <div className="rounded-xl bg-primary/20 border px-5 py-2 font-bold flex flex-row my-auto">
                    <Coins className="w-6 h-6 mr-2" />
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
