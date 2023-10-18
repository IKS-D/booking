"use client";

import React, { useState, useEffect } from "react";
import BookingLogo from "./BookingLogo";
import { Spacer, Spinner } from "@nextui-org/react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // delay(() => setHasMounted(true), 1000);
    setHasMounted(true);
  }, []);

  if (!hasMounted)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-1.5rem)]">
        <div className="">
          <BookingLogo className={"w-40 h-40 animate-spin"} />
        </div>
        <Spacer y={5} />
        <Spinner size="md" />
      </div>
    );

  return <>{children}</>;
};

export default ClientOnly;
