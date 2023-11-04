import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface CreateNewListingButtonProps {
}

const CreateNewListingButton: React.FC<CreateNewListingButtonProps> = () => {

    const router = useRouter();

    return (
        <Button onClick={() => {
            router.push("/listings/personal/create");
          }}>Create new listing</Button>
      );
};

export default CreateNewListingButton;
