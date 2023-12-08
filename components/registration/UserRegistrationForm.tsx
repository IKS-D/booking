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
import LoadingSpinner from "../LoadingSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function UserRegistrationForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(UserRegistrationSchema),
  }); 

  const onSubmit = async (data: UserRegistrationFormData) => {
    setLoading(true);
    console.log(data)

    const response = await fetch("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await (response.json() as Promise<AuthError>);
      toast.error(error.message);

      // Set the errors to display on the form
      setError("email", {
        type: "manual",
        message: error.message,
      });

      setError("password", {
        type: "manual",
        message: error.message,
      });

      setError("confirmPassword", {
        type: "manual",
        message: error.message,
      });

      setLoading(false);
      return;
    }

    setLoading(false);
    toast.success("User registered successfully!");

    // Navigate to profile registration
    // router.push("/registration/profile");
    // router.refresh();

    //reset();
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <form
        className="flex flex-col items-center rounded-lg border-2 border-neutral-700 p-4 w-1/3"
        onSubmit={handleSubmit((e) => onSubmit(e))}
      >

        <p className="text-md font-bold mb-4">Sign up using email and password</p>

        <Input
          className="max-w-md h-[75px] mb-2"
          {...register("email")}
          errorMessage={errors.email && (errors.email.message as string)}
          isInvalid={errors.email ? true : false}
          disabled={isSubmitting}
          label="Email"
          name="email"
          placeholder="Enter your email"
          variant="bordered"
        />

        <Input
          className="max-w-md h-[75px] mb-2"
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
          {...register("password")}
          errorMessage={errors.password && (errors.password.message as string)}
          isInvalid={errors.password ? true : false}
          disabled={isSubmitting}
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="bordered"
          placeholder="Enter your password"
        />

        <Input
          className="max-w-md h-[75px] mb-2"
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword && (errors.confirmPassword.message as string)}
          isInvalid={errors.confirmPassword ? true : false}
          disabled={isSubmitting}
          label="Repeat password"
          name="confirmPassword"
          type="password"
          variant="bordered"
          placeholder="Confirm your password"
        />

        <Button 
          type="submit"
          color="primary"
          className="w-full max-w-md flex gap-2"
          disabled={isSubmitting}
        >
          Sign up with email
        </Button>

        <div className="flex flex-col items-center">
          <p className="text-md font-bold mb-4">Or</p>
        </div>

        <OAuthForm />
      </form>
    </>
  );
}
