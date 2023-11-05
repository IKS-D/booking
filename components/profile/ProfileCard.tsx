import { EditIcon, DeleteIcon } from "../Icons";
import { Input, Avatar, Link, } from "@nextui-org/react";
import { User } from "@/types";

export default async function ProfileCard() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Avatar alt="Your profile picture" className="mb-4 h-[100px] w-[100px]" />

      <div className="text-lg font-bold mb-4">Your profile information</div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <div>
          <Input
            label="First name"
            value="Adminas"
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="Last name"
            value="Adminauskas"
            readOnly
            disabled
            variant="bordered"
          />
        </div>

        <div>
          <Input
            type="date"
            label="Date of birth"
            value="2000-01-01"
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="Phone number"
            value="+37061111111"
            readOnly
            disabled
            variant="bordered"
          />
        </div>

        <div>
          <Input
            label="Country"
            value="Lithuania"
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="City"
            value="Kaunas"
            readOnly
            disabled
            variant="bordered"
          />
        </div>
      </div>
    </div>
  );

}