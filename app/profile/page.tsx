import UserProfileCard from "@/components/profile/user/UserProfileCard";
import HostProfileCard from "@/components/profile/host/HostProfileCard";
import getCurrentUser, {
  getHostProfileById,
  getUserProfileById,
  hostProfileExists,
} from "@/actions/users/usersQueries";
import { EditIcon, DeleteIcon } from "@/components/Icons";
import { Link } from "@nextui-org/react";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const { data: userProfile, error: profileError } = await getUserProfileById(
    user!.id
  );
  var hostProfile;
  if (await hostProfileExists(user!.id)) {
    const { data: recvHostProfile, error: hostError } =
      await getHostProfileById(user!.id);
    hostProfile = recvHostProfile;
  } else {
    hostProfile = null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">
        Welcome to your profile page,{" "}
        {userProfile?.first_name + " " + userProfile?.last_name}!
      </div>

      <UserProfileCard user={user!} userProfile={userProfile!} />
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

      <HostProfileCard user={user!} hostProfile={hostProfile} />
    </div>
  );
}
