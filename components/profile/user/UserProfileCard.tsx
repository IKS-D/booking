import { UserProfile } from "@/actions/users/usersQueries";
import { Input, Avatar, } from "@nextui-org/react";
import { User } from "@supabase/supabase-js";

interface UserProfileCardProps {
  user: User;
  userProfile: UserProfile;
}

export default async function UserProfileCard({ userProfile, }: UserProfileCardProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Avatar className="mb-4 h-[100px] w-[100px]" 
      src={userProfile.photo}
      alt="Your profile photo" />

      <div className="text-lg font-bold mb-4">Your user profile</div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <div>
          <Input
            label="First name"
            value={userProfile.first_name}
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="Last name"
            value={userProfile.last_name}
            readOnly
            disabled
            variant="bordered"
          />
        </div>

        <div>
          <Input
            type="date"
            label="Date of birth"
            value={userProfile.birth_date}
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="Phone number"
            value={userProfile.phone}
            readOnly
            disabled
            variant="bordered"
          />
        </div>

        <div>
          <Input
            label="Country"
            value={userProfile.country}
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="City"
            value={userProfile.city}
            readOnly
            disabled
            variant="bordered"
          />
        </div>
      </div>
    </div>
  );

}