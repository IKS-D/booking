import getCurrentUser from "@/actions/users/usersQueries";
import HostProfileCreateForm from "@/components/profile/host/create/HostProfileCreateForm"

export default async function HostProfileCreatePage() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
        <div className="text-2xl font-bold mb-2">
            Create your owner profile!
        </div>

        <div className="text-sm font-bold mb-4">Fill out this information to create an owner profile and start posting listings:</div>
        <HostProfileCreateForm user={user!}/>
    </div>
  );
  
}
