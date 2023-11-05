import { cookies } from "next/headers";
import EditProfileForm from "@/components/profile/edit/EditProfileForm"
import getCurrentUser from "@/actions/getCurrentUser";

export default async function EditProfile() {
  const cookieStore = cookies();
  const user = getCurrentUser();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold mb-2">
            Edit your profile information
        </div>
        <EditProfileForm/>
    </div>
  );
  
}
