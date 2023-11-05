import EditOwnerForm from "@/components/profile/owner/EditOwnerForm"

export default async function EditOwnerProfile() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-foreground">
        <div className="text-2xl font-bold mb-2">
            Edit your owner profile
        </div>

        <div className="text-lg font-bold mb-4">Update your owner profile information</div>
        <EditOwnerForm />
    </div>
  );
  
}
