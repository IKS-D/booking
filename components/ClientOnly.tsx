"use client";

import { delay } from "framer-motion";
import React, { useState, useEffect } from "react";
import BookingLogo from "./BookingLogo";
import { Spacer, Spinner } from "@nextui-org/react";
import { title } from "@/components/primitives";

interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    delay(() => setHasMounted(true), 1000);
  }, []);

  if (!hasMounted)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-1.5rem)]">
        <div className="">
          <BookingLogo className={title()} />
        </div>
        <Spacer y={5} />
        <Spinner size="md" />
      </div>
    );

  return <>{children}</>;
};

export default ClientOnly;
