import React from 'react'
import ProfileRegistrationForm from '@/components/registration/ProfileRegistrationForm'
import getCurrentUser from '@/actions/users/usersQueries';

export default async function ProfileRegistrationPage() {
  const user = await getCurrentUser();
  
  return (
    <>
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <ProfileRegistrationForm user={user!}/>
    </div>
    </>
  )
}
