"use client"

import React, { useState } from "react";
import { User } from "@/types";
import { Button, Link } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteIcon } from "@/components/Icons";

export default function DeleteProfileForm() {
  const router = useRouter();

  // Form errors
  const [errors, setErrors] = React.useState<Partial<User>>({});

  const handleOnSubmit = () => {
    router.push("/");
    toast.success("User profile successfully deleted");
  };

  return (
    <form method='POST' action='/profile' className="w-full flex flex-col items-center justify-center m-4">
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 mt-4">
      <Button
        onClick={() => {
          if (true/*validateStep()*/) {
            handleOnSubmit();
        }}}
        className="bg-danger hover:bg-danger-dark text-white font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
      >
        <div className="flex items-center justify-left gap-1">
          <DeleteIcon/><p className="text-md">Confirm</p>
        </div>
      </Button>

      <Link href="/profile" className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out">
        <div className="flex items-center justify-left gap-1">
          <p className="text-md">Cancel</p>
        </div>
      </Link>
      </div>
    </form>
  );
}
