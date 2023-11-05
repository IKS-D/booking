"use client"

import React, { useState } from "react";
import { User } from "@/types";
import { Button, Input, Link } from "@nextui-org/react";
import { toast } from "sonner";
import { Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { EditIcon } from "@/components/Icons";

export default function EditProfileForm() {
  const [formData, setFormData] = useState<Partial<User>>({});
  const router = useRouter();

  // Form errors
  const [errors, setErrors] = React.useState<Partial<User>>({});

  // Profile information errors
  const [firstNameError, setFirstNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [dateOfBirthError, setDateOfBirthError] = React.useState(false);
  const [phoneNumberError, setPhoneNumberError] = React.useState(false);
  const [countryError, setCountryError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState(false);

  const validate = () => {
    // Implement validation
    let hasErrors = false;
    if (!formData.first_name) {
      setFirstNameError(true);
      hasErrors = true;
    }
    if (!formData.last_name) {
      setLastNameError(true);
      hasErrors = true;
    }
    if (!formData.date_of_birth) {
      setDateOfBirthError(true);
      hasErrors = true;
    }
    if (!formData.phone_number) {
      setPhoneNumberError(true);
      hasErrors = true;
    }
    if (!formData.country) {
      setCountryError(true);
      hasErrors = true;
    }
    if (!formData.city) {
      setCityError(true);
      hasErrors = true;
    }
    return !hasErrors;
  };

  const handleOnSubmit = () => {
    router.push("/profile");
    toast.success("User profile successfully updated");
  };

  return (
    <form method='POST' action='/profile' className="w-1/3 flex flex-col items-center justify-center rounded-lg border-2 border-neutral-700 p-4">
      <Input
        className="max-w-md h-[75px]"
        label="First name"
        name="first_name"
        placeholder="Enter your first name"
        variant="bordered"
        value={formData.first_name}
        onChange={(event) => {
          setFormData({ ...formData, first_name: event.target.value })
          setFirstNameError(false)
        }}
        isInvalid={firstNameError}
      />

      <Input
        className="max-w-md h-[75px]"
        label="Last name"
        name="last_name"
        placeholder="Enter your last name"
        variant="bordered"
        value={formData.last_name}
        onChange={(event) => {
          setFormData({ ...formData, last_name: event.target.value })
          setLastNameError(false)
        }}
        isInvalid={lastNameError}
      />

      <Input
        className="max-w-md h-[75px]"
        type="date"
        label="Date of birth"
        name="date_of_birth"
        variant="bordered"
        value={formData.date_of_birth ? formData.date_of_birth.toISOString().split('T')[0] : ''}
        onChange={(event) => {
          const inputDate = event.target.value;
          const dateObject = inputDate ? new Date(inputDate) : undefined;
          setFormData({ ...formData, date_of_birth: dateObject });
          setDateOfBirthError(false);
        }}
        isInvalid={dateOfBirthError}
      />

      <Input
        className="max-w-md h-[75px]"
        label="Phone number"
        name="phone_number"
        placeholder="Enter your phone number"
        variant="bordered"
        value={formData.phone_number}
        onChange={(event) => {
          setFormData({ ...formData, phone_number: event.target.value })
          setPhoneNumberError(false)
        }}
        isInvalid={phoneNumberError}
      />

      <Input
        className="max-w-md h-[75px]"
        label="Country"
        name="country"
        placeholder="Enter the name of your country"
        variant="bordered"
        value={formData.country}
        onChange={(event) => {
          setFormData({ ...formData, country: event.target.value })
          setCountryError(false)
        }}
        isInvalid={countryError}
      />

      <Input
        className="max-w-md h-[75px]"
        label="City"
        name="city"
        placeholder="Enter the name of your city"
        variant="bordered"
        value={formData.city}
        onChange={(event) => {
          setFormData({ ...formData, city: event.target.value })
          setCityError(false)
        }}
        isInvalid={cityError}
      />

      <Input
        className="max-w-xs h-[75px]"
        label="Avatar"
        name="avatar"
        placeholder="Enter a URL for your picture"
        variant="bordered"
        value={formData.avatar}
        onChange={(event) => {
          setFormData({ ...formData, avatar: event.target.value })
          setAvatarError(false)
        }}
        isInvalid={avatarError}
      />

      <Avatar
        className="w-[100px] h-[100px]"
        src={formData.avatar ? formData.avatar : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"}
        alt="Avatar"
      />
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 mt-4">
      <Button
        onClick={() => {
          if (true/*validateStep()*/) {
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
