"use client";

import { decodePayseraData } from "@/lib/payseraAPI";
import { headers } from "next/headers";
import { useSearchParams } from "next/navigation";
import React from "react";

const SuccessPayment = () => {
  const searchParams = useSearchParams();
  const data = decodePayseraData(
    searchParams.get("data")!,
    searchParams.get("ss1")!,
    searchParams.get("ss2")!
  );

  return (
    <div className="flex flex-col w-screen">
      <h1>Success Payment</h1>
      <br></br>
      {data && data.map((item) => <p className="break-all">{item}</p>)}
    </div>
  );
};

export default SuccessPayment;
