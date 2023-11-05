import ProfileCard from "@/components/profile/ProfileCard";
import OwnerProfileCard from "@/components/profile/OwnerProfileCard";
import DeleteProfileForm from "@/components/profile/delete/DeleteProfileForm"

export default async function DeleteProfile() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">
        Are you sure you want to delete your profile?
      </div>
      <div className="text-lg font-bold mb-4">The profile that will be deleted:</div>
      <ProfileCard />
      <OwnerProfileCard />
      <DeleteProfileForm />
    </div>
  );
}
