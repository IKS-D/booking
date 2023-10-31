"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";
import {
  RegisterCredentialsFormData,
  registerCredentialsSchema,
} from "@/lib/validations/registerCredentials";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Icons";
import { useRouter } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";

export default function AccountCredentialsForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterCredentialsFormData>({
    resolver: zodResolver(registerCredentialsSchema),
  });

  const onSubmit = async (data: RegisterCredentialsFormData) => {
    // const response = await fetch("/auth/sign-up", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // if (!response.ok) {
    //   const error = await (response.json() as Promise<AuthError>);
    //   toast.error(error.message);

    //   // set errors to display on form
    //   setError("email", {
    //     type: "manual",
    //     message: error.message,
    //   });

    //   setError("password", {
    //     type: "manual",
    //     message: error.message,
    //   });

    //   return;
    // }

    toast.success("Account credential registration successful");

    // coninue to account information page
    router.push("/registration/accountinformation");
    router.refresh();

    reset();
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleSubmit((e) => onSubmit(e))}
      className="flex flex-col justify-center gap-2 text-foreground"
      //   action="/auth/sign-in"
      //   method="post"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <p className="text-sm font-bold mb-4">Sign up using email and password</p>
      </div>
      <Input
        className="max-w-xs h-[75px]"
        {...register("email")}
        errorMessage={errors.email && (errors.email.message as string)}
        isInvalid={errors.email ? true : false}
        isClearable
        label="Email"
        name="email"
        placeholder="Enter your email"
        variant="bordered"
      />
      {/* <Spacer y={1} /> */}

      <Input
        className="max-w-xs h-[75px]"
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
        isInvalid={errors.password ? true : false}
        type={showPassword ? "text" : "password"}
        variant="bordered"
        placeholder="Enter your password"
        {...register("password")}
        errorMessage={errors.password && (errors.password.message as string)}
      />

      <Input
        className="max-w-xs h-[75px]"
        label="Repeat password"
        isInvalid={errors.repeatPassword ? true : false}
        type="password"
        variant="bordered"
        placeholder="Repeat your password"
        {...register("repeatPassword")}
        errorMessage={errors.password && (errors.password.message as string)}
      />

      <Spacer y={3} />
      <Button
        disabled={isSubmitting}
        type="submit"
        color="primary"
        className="max-w-xs"
      >
        Continue
      </Button>

      <div className="flex flex-col items-center">
        <p className="text-sm font-bold mb-4">Or</p>
      </div>
      
      <Button
        color="primary"
        className="max-w-xs"
      >
        Sign up with Google
      </Button>

      {/* or sign up */}
      <Spacer y={1} />
      <div className="flex flex-col items-center">
        <label className="text-md">Already have an a account?</label>
        <Link href="/login">
          <p className="text-md text-primary">Sign in</p>
        </Link>
      </div>
    </form>
  );
}
