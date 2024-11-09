import getCurrentUser, {
  getHostProfileById,
} from "@/actions/users/usersQueries";
import HostProfileEditForm from "@/components/profile/host/edit/HostProfileEditForm";

export default async function HostProfileEditPage() {
  const user = await getCurrentUser();
  const { data: hostProfile } = await getHostProfileById(user!.id);

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
      <div className="text-2xl font-bold mb-2">Edit your owner profile</div>

      <div className="text-lg font-bold mb-4">
        Update your owner profile information
      </div>
      <HostProfileEditForm user={user!} hostProfile={hostProfile!} />
    </div>
  );
}
