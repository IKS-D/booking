import { cookies } from "next/headers";
import ProfileCard from "@/components/profile/ProfileCard";
import OwnerProfileCard from "@/components/profile/OwnerProfileCard";
import getCurrentUser from "@/actions/users/usersQueries";
import { EditIcon, DeleteIcon } from "@/components/Icons";
import { Link } from "@nextui-org/react";

export default async function Profile() {
  const cookieStore = cookies();
  const user = getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">
        Welcome to your profile page, Adminas!
      </div>

      <ProfileCard />
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href="/profile/edit"
          className="bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
        >
          <div className="flex items-center justify-left gap-1">
            <EditIcon />
            <p className="text-md">Edit profile</p>
          </div>
        </Link>
        <Link
          href="/profile/delete"
          className="bg-danger hover:bg-danger-dark text-white font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
        >
          <div className="flex items-center justify-left gap-1">
            <DeleteIcon />
            <p className="text-md">Delete profile</p>
          </div>
        </Link>
      </div>

      <OwnerProfileCard />
      <Link
        href="/profile/owner/edit"
        className="m-2 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
      >
        <div className="flex items-center justify-center gap-1">
          <EditIcon />
          <p className="text-md">Edit owner profile</p>
        </div>
      </Link>

      <Link
        href="/profile/owner/create"
        className="m-2 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
      >
        <div className="flex items-center justify-center gap-1">
          <p className="text-lg font-bold">+</p>
          <p className="text-md">Create owner profile</p>
        </div>
      </Link>
    </div>
  );
}
