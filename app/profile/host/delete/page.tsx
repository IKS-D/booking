import HostProfileDeleteForm from "@/components/profile/host/delete/HostProfileDeleteForm"
import getCurrentUser, { getUserProfileById } from "@/actions/users/usersQueries";

export default async function HostProfileDeletePage() {
  const user = await getCurrentUser();
  const listingCount = 0
  // TODO: Implement listing check

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">
        Delete your profile
      </div>
      <HostProfileDeleteForm user={user!} listingCount={listingCount!}/>
    </div>
  );
}
