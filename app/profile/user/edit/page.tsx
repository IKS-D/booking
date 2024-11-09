import getCurrentUser, { getUserProfileById } from "@/actions/users/usersQueries";
import UserProfileEditForm from "@/components/profile/user/edit/UserProfileEditForm";

export default async function UserProfileEditPage() {
  const user = await getCurrentUser();
  const { data: userProfile } = await getUserProfileById(user!.id);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="text-2xl font-bold mb-2">
        Update your profile information
      </div>

      <UserProfileEditForm user={user!} userProfile={userProfile!}/>
    </div>
  );
}
