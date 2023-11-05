"use client"

import React, { useState } from "react";
import { Button, Input, Link } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditIcon } from "@/components/Icons";

export default function EditOwnerForm() {
  const [formData, setFormData] = useState({ personal_id: '111111111', bank_account: 'SE4550000000058398257466'});
  const router = useRouter();

  // Form errors
  const [personalIdError, setPersonalIdError] = React.useState(false);
  const [bankAccountError, setBankAccountError] = React.useState(false);

  const validate = () => {
    // Implement validation
    let hasErrors = false;
    if (!formData.personal_id) {
      setPersonalIdError(true);
      hasErrors = true;
    }
    if (!formData.bank_account) {
      setBankAccountError(true);
      hasErrors = true;
    }
    return !hasErrors;
  };

  const handleOnSubmit = () => {
    router.push("/profile");
    toast.success("User owner profile created successfully");
  };

  return (
    <form method='POST' action='/profile' className="w-full flex flex-col items-center justify-centerp-4">
      <Input
        className="max-w-md h-[75px]"
        label="Personal id"
        name="personal_id"
        placeholder="Enter your personal id"
        variant="bordered"
        value={formData.personal_id}
        onChange={(event) => {
          setFormData({ ...formData, personal_id: event.target.value })
          setPersonalIdError(false)
        }}
        isInvalid={personalIdError}
      />

      <Input
        className="max-w-md h-[75px]"
        label="Bank account"
        name="bank_account"
        placeholder="Enter your bank account"
        variant="bordered"
        value={formData.bank_account}
        onChange={(event) => {
          setFormData({ ...formData, bank_account: event.target.value })
          setBankAccountError(false)
        }}
        isInvalid={bankAccountError}
      />

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 mt-4">
      <Button
        onClick={() => {
          if (validate()) {
            handleOnSubmit();
        }}}
        className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
      >
        <div className="flex items-center justify-left gap-1">
        <EditIcon/><p className="text-md">Save changes</p>
        </div>
      </Button>

      <Link href="/profile" className="bg-danger hover:bg-danger-dark text-white font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out">
        <div className="flex items-center justify-left gap-1">
          <p className="text-md">Cancel</p>
        </div>
      </Link>
      </div>
    </form>
  );
}
