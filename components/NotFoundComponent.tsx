import React from "react";
import { BiError } from "react-icons/bi";
import { title } from "./primitives";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface NotFoundProps {
  title?: string;
  subtitle?: string;
}

const NotFoundComponent = ({ title: header, subtitle }: NotFoundProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <BiError size={90} color="primary" />
      <h2 className={title({ size: "sm" })}>{header || "Not Found"}</h2>
      <p>{subtitle || "Could not find requested resource"}</p>
      <Button href="/" as={Link} variant="flat" color="primary">
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundComponent;
