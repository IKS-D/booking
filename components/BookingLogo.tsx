import clsx from "clsx";
import React from "react";

interface BookingLogoProps {
  className?: string;
}

// TODO Change BookingLogo component
export default function BookingLogo({ className }: BookingLogoProps) {
  return (
    <div>
      <p className={clsx("text-2xl font-bold text-primary", className)}>
        BOOKING
      </p>
    </div>
  );
}
