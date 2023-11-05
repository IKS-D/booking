import { EditIcon} from "../Icons";
import { Input, Link, } from "@nextui-org/react";

export default async function OwnerProfileCard() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="text-lg font-bold mb-4">Your owner profile</div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div>
          <Input
            label="Personal code"
            value="111111111"
            readOnly
            disabled
            variant="bordered"
          />
        </div>
        <div>
          <Input
            label="Bank account"
            value="SE4550000000058398257466"
            readOnly
            disabled
            variant="bordered"
          />
        </div>
      </div>
    </div>
  );

}
