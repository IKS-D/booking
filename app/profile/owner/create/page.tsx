import CreateOwnerForm from "@/components/profile/owner/CreateOwnerForm"

export default async function CreateOwnerProfile() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
        <div className="text-2xl font-bold mb-2">
            Create your owner profile!
        </div>

        <div className="text-sm font-bold mb-4">Fill out this information to create an owner profile and start posting listings:</div>
        <CreateOwnerForm />
    </div>
  );
  
}
