import clsx from "clsx";
import React from "react";
import IksdLogo from "public/iksd.svg";

interface BookingLogoProps {
  className?: string;
}

export default function BookingLogo({ className }: BookingLogoProps) {
  return (
    <div>
      {/* <p className={clsx("text-2xl font-bold text-primary", className)}>
        BOOKING
      </p> */}
      <IksdLogo className={clsx("w-10 h-10", className)} />
    </div>
  );
}
