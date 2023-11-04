"use client";

import { Listing } from "@/types";
import { User } from "@supabase/supabase-js";
import { subtitle, title } from "@/components/primitives";
import PersonalListingsTable from "./PersonalListingsTable";
import CreateNewListingButton from "./CreateNewListingButton";
import { toast } from "sonner";
import { list } from "postcss";

interface PersonalListingsContentProps {
  listings: Listing[];
  currentUser?: User | null;
}

const PersonalListingsContent: React.FC<PersonalListingsContentProps> = ({
  listings,
  currentUser,
}) => {
  return (
    <div className="max-w-full items-center">
      <label className={title({ size: "sm" })}>Your active listings</label>
      <label className={subtitle({})}>
        All the listings you have created
      </label>

      <PersonalListingsTable
        listings={listings}
      />

      <div className="flex justify-center mt-10">
        <CreateNewListingButton/>
      </div>
    </div>
  );
};

export default PersonalListingsContent;
