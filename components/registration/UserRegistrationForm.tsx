"use client";

import React, { ReactEventHandler, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserRegistrationFormData, UserRegistrationSchema } from "@/lib/validations/registerUser";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Icons";
import OAuthForm from "../OAuthForm";



export default function UserRegistrationForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserRegistrationFormData>({ email: "", password: "", confirm: "" });

  const [error, setError] = useState<{
    email?: string[] | undefined;
    password?: string[] | undefined;
    confirm?: string[] | undefined;
  }>();

  const validateForm = (formData: UserRegistrationFormData) => {
    const result = UserRegistrationSchema.safeParse(formData);

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
    setLoading(true);
    console.log(formData);
    const formValid = validateForm(formData);

    if(!formValid){
      //console.log("Form is not valid")
      setLoading(false);
      return;
    }

    const response = await fetch("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    const responseData = await response.json();

    console.log(responseData);

    if (!response.ok) {
      toast.error(responseData.error);
      setLoading(false);
      return;
    }
    
    toast.success("User registered successfully!");
    setLoading(false);
    
    // Navigate to profile registration
    router.push("/registration/profile");
    router.refresh();
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-neutral-700 p-4 w-1/3">
      <form
        onSubmit={handleOnSubmit}
        className="flex flex-col items-center w-full space-y-6">
        <p className="text-md font-bold mb-4">Sign up using email and password</p>

        <Input
          className="max-w-md h-[75px]"
          label="Email"
          name="email"
          placeholder="Enter your email"
          variant="bordered"
          value={formData.email}
          onChange={(event) => {
            setFormData({ ...formData, email: event.target.value });
            setError({email: undefined});
          }}
          errorMessage={error?.email}
        />

        <Input
          className="max-w-md h-[75px]"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {showPassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="bordered"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(event) => {
            setFormData({ ...formData, password: event.target.value });
          }}
          errorMessage={error?.password}
        />

        <Input
          className="max-w-md h-[75px]"
          label="Repeat password"
          name="confirm"
          type="password"
          variant="bordered"
          placeholder="Confirm your password"
          value={formData.confirm}
          onChange={(event) => {
            setFormData({ ...formData, confirm: event.target.value });
          }}
          errorMessage={error?.confirm}
        />

        <Button type="submit" className="w-full flex gap-2">
          Sign up with email
          <AiOutlineLoading3Quarters className={cn("animate-spin", { "hidden": !loading })} />
        </Button>

        <div className="flex flex-col items-center">
          <p className="text-md font-bold mb-4">Or</p>
        </div>

        <OAuthForm/>
      </form>
    </div>
  );
}
