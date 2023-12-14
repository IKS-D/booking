"use client"

import React, { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteIcon } from "@/components/Icons";
import { User } from "@supabase/supabase-js";
import { deleteHost } from "@/actions/users/usersQueries";
import LoadingSpinner from "@/components/LoadingSpinner";

interface HostProfileDeleteFormProps {
  user: User;
  listingCount: number;
}

export default function HostProfileDeleteForm({ user, listingCount, }: HostProfileDeleteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const ableToDelete = (listingCount == 0);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await deleteHost();

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    setLoading(false);
    toast.success("Host profile deleted successfully.");

    // Navigate to profile page
    router.push("/profile");
    router.refresh();
  };

  return (
    <>
    {loading && <LoadingSpinner />}
    <div className="flex flex-col items-center rounded-lg border-2 border-neutral-700 p-4 w-1/3">
      <form onSubmit={handleOnSubmit} className="w-full flex flex-col items-center justify-center m-4">
          <div>
            <p className="text-lg font-semibold">You have {listingCount} listings.</p>
          </div>
        <div className="flex items-center justify-center">
              <p className="text-lg font-semibold">{ ableToDelete ? "Are you sure you want to delete your host profile?" : "You cannot delete your host profile."}</p>
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
