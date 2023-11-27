import { Spinner } from "@nextui-org/spinner";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center justify-center gap-2 p-4">
        <Spinner size="lg" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
