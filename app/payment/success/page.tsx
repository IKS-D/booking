"use client";

import { subtitle, title } from "@/components/primitives";
import { decodePayseraData } from "@/lib/payseraAPI";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const SuccessPayment = () => {
  const searchParams = useSearchParams();
  const data = decodePayseraData(
    searchParams.get("data")!,
    searchParams.get("ss1")!,
    searchParams.get("ss2")!
  );

  const parsedData =
    data &&
    data.map((item) => {
      const [name, value] = item.split("=");
      return { name, value };
    });

  // create map of data
  const dataMap = new Map<string, string>();
  parsedData &&
    parsedData.map((item) => {
      dataMap.set(item.name, item.value);
    });

  return (
    <div className="flex flex-col w-screen items-center justify-center text-center">
      <label className={title()}>Successful Payment</label>
      <label className={subtitle()}>
        Thank you for your payment. Your payment was successful.
      </label>

      <div className="flex flex-col gap-3 mt-12">
        <label className={title({ size: "sm" })}>Payment details</label>
        <Input
          label="Reservation ID"
          value={dataMap.get("orderid")}
          readOnly
          disabled
          variant="bordered"
        />

        <Input
          label="Payment amount"
          value={`${Number(dataMap.get("amount")) / 100} ${dataMap.get(
            "currency"
          )}`}
          readOnly
          disabled
          variant="bordered"
        />

        <Input
          label="Email"
          value={dataMap.get("p_email")}
          readOnly
          disabled
          variant="bordered"
        />
      </div>

      <Button variant="flat" className="mt-12" color="primary">
        <Link href="/reservations">Go to reservations page</Link>
      </Button>
    </div>
  );
};

export default SuccessPayment;
