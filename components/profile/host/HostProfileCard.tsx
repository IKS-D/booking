import { User } from "@supabase/supabase-js";
import { EditIcon } from "../../Icons";
import { Input, Link, } from "@nextui-org/react";
import { HostProfile } from "@/actions/users/usersQueries";

interface HostProfileCardProps {
  user: User;
  hostProfile: HostProfile | null;
}

export default async function HostProfileCard({ user, hostProfile, }: HostProfileCardProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="text-lg font-bold mb-4">Your host profile</div>
      {hostProfile !== null ? (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <div>
            <Input
              label="Personal code"
              value={hostProfile.personal_code}
              readOnly
              disabled
              variant="bordered"
            />
          </div>
          <div>
            <Input
              label="Bank account"
              value={hostProfile.bank_account}
              readOnly
              disabled
              variant="bordered"
            />
          </div>
          <Link
            href="/profile/host/edit"
            className="w-full col-span-2 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
          >
            <div className="flex items-center justify-center gap-1">
              <EditIcon />
              <p className="text-md">Edit host profile</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <Link
            href="/profile/host/create"
            className="w-full col-span-2 bg-primary hover:bg-primary-dark text-black font-semibold py-2 px-4 rounded-md inline-block transition duration-300 ease-in-out"
          >
            <div className="flex items-center justify-center gap-1">
              <p className="text-lg font-bold">+</p>
              <p className="text-md">Create host profile</p>
            </div>
          </Link>
        </div>
      )}

    </div>
  );
}
