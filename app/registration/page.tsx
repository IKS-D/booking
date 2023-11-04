import React from 'react'
import RegistrationForm from "@/components/registration/RegistrationForm"

export default function RegistrationPage() {
  return (
    <>
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <RegistrationForm/>
    </div>
    </>
  )
}