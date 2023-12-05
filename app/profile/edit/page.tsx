import { cookies } from "next/headers";
import EditProfileForm from "@/components/profile/edit/EditProfileForm";
import getCurrentUser, { getUserProfileById } from "@/actions/users/usersQueries";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default async function ProfileEditPage() {
  const user = await getCurrentUser();
  const { data: userProfile, error } = await getUserProfileById(user!.id);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="text-2xl font-bold mb-2">
        Update your profile information
      </div>

      <ProfileEditForm user={user!} userProfile={userProfile!}/>
    </div>
  );
}
