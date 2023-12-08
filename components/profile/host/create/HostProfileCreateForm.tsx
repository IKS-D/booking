"use client"

import React, { useState } from "react";
import { Button, Input, Link } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditIcon } from "@/components/Icons";
import { HostRegistrationFormData, HostRegistrationSchema } from "@/lib/validations/registerHost";
import { insertHost } from "@/actions/users/usersQueries";
import { User } from "@supabase/supabase-js";

interface HostProfileCreateFormProps {
  user: User;
}

export default function HostProfileCreateForm({ user, } : HostProfileCreateFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<HostRegistrationFormData>({
    personalCode: "",
    bankAccount: "",
  });

  const [error, setError] = useState<{
    personalCode?: string[] | undefined;
    bankAccount?: string[] | undefined;
  }>();

  
  const validateForm = (formData: HostRegistrationFormData) => {
    const result = HostRegistrationSchema.safeParse(formData);

    if (!result.success) {
      //console.log("False in validate form")
      setError(result.error.flatten().fieldErrors);
      //console.log(result.error.flatten().fieldErrors);
      return false;
    }

    setError(undefined);
    return true;
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    const formValid = validateForm(formData);

    if (!formValid) {
      //console.log("Form is not valid")
      return;
    }

    const { host, error } = await insertHost({
      userId: user.id,
      personalCode: formData.personalCode,
      bankAccount: formData.bankAccount,
    });

    if (error) {
      console.error(error);
      toast.error("Something went wrong");
      return;
    }

    toast.success("Host profile created successfully!");

    // Navigate to profile page
    router.push("/profile");
    router.refresh();
  };

  return (
    <form onSubmit={handleOnSubmit} className="w-full flex flex-col items-center justify-centerp-4">
      <Input
        className="max-w-md h-[75px]"
        label="Personal code"
        name="personalCode"
        placeholder="Enter your personal code"
        variant="bordered"
        value={formData.personalCode}
          onChange={(event) => {
            setFormData({ ...formData, personalCode: event.target.value });
            setError({ personalCode: undefined });
          }}
          errorMessage={error?.personalCode}
      />

      <Input
        className="max-w-md h-[75px]"
        label="Bank account"
        name="bankAccount"
        placeholder="Enter your bank account"
        variant="bordered"
        value={formData.bankAccount}
          onChange={(event) => {
            setFormData({ ...formData, bankAccount: event.target.value });
            setError({ bankAccount: undefined });
          }}
          errorMessage={error?.bankAccount}
      />

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 mt-4">
      <Button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
      >
        <div className="flex items-center justify-left gap-1">
        <EditIcon/><p className="text-md">Create host profile</p>
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
