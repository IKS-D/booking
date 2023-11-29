"use client";

import { subtitle, title } from "@/components/primitives";
import { decodePayseraData } from "@/actions/reservations/payseraAPI";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const SuccessPayment = () => {
  const searchParams = useSearchParams();
  const payment = decodePayseraData(
    searchParams.get("data")!,
    searchParams.get("ss1")!,
    searchParams.get("ss2")!
  );

  return (
    <div className="flex flex-col w-full items-center justify-center text-center">
      <label className={title()}>Successful Payment</label>
      <label className={subtitle()}>
        Thank you for your payment. Your payment was successful.
      </label>

      <div className="flex flex-col gap-3 mt-12">
        <label className={title({ size: "sm" })}>Payment details</label>
        <Input
          label="Reservation ID"
          value={payment.reservation_id.toString()}
          readOnly
          disabled
          variant="bordered"
        />

        <Input
          label="Payment amount"
          value={`${payment.amount / 100} €`}
          readOnly
          disabled
          variant="bordered"
        />

        <Input
          label="Email"
          value={payment.payer_email}
          readOnly
          disabled
          variant="bordered"
        />

        <Input
          label="Payer name and surname"
          value={payment.first_name + " " + payment.last_name}
          readOnly
          disabled
          variant="bordered"
        />

        <Input
          label="Payment method"
          value={payment.payment_method}
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
