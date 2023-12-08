import React from "react";
import { BiError } from "react-icons/bi";
import { title } from "./primitives";
import { Button, Link } from "@nextui-org/react";

interface NotFoundProps {
  title?: string;
  subtitle?: string;
}

const NotFoundComponent = ({ title: header, subtitle }: NotFoundProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <BiError size={90} color="primary" />
      <h2 className={title()}>{header || "Not Found"}</h2>
      <p>{subtitle || "Could not find requested resource"}</p>
      <Button variant="flat" color="primary">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundComponent;
