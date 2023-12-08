"use client"

import React, { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteIcon } from "@/components/Icons";
import { User } from "@supabase/supabase-js";
import { deleteUser } from "@/actions/auth/authQueries";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProfileDeleteFormProps {
  user: User;
  reservationCount: number;
  listingCount: number;
}

export default function UserProfileDeleteForm({ user, reservationCount, listingCount, }: ProfileDeleteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const ableToDelete = (reservationCount == 0 && listingCount == 0);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await deleteUser();

    if (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    toast.success("User profile successfully deleted");
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="flex flex-col items-center rounded-lg border-2 border-neutral-700 p-4 w-1/3">
        <form onSubmit={handleOnSubmit} className="w-full flex flex-col items-center justify-center m-4">
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 mt-4">
            <div>
              <p className="text-lg">You have {reservationCount} reservations.</p>
            </div>
            <div>
              <p className="text-lg">You have {listingCount} listings.</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-lg font-semibold">{ableToDelete ? "Are you sure you want to delete your profile?" : "You cannot delete your profile."}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg p-4 mt-4">
            <Button type="submit"
              className="bg-danger text-white font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out hover:bg-danger-dark disabled:bg-black"
              disabled={!ableToDelete}
            >
              <div className="flex items-center justify-left gap-1">
                <DeleteIcon /><p className="text-md">Confirm</p>
              </div>
            </Button>

            <Link href="/profile" className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out">
              <div className="flex items-center justify-left gap-1">
                <p className="text-md">Cancel</p>
              </div>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
