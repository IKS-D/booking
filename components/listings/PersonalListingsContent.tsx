"use client";

import { User } from "@supabase/supabase-js";
import { subtitle, title } from "@/components/primitives";
import PersonalListingsTable from "./PersonalListingsTable";
import { Listings } from "@/actions/listings/listingsQueries";
import { Button } from "@nextui-org/react";
import Link from "next/link";

interface PersonalListingsContentProps {
  listings: Listings;
  currentUser?: User | null;
}

const PersonalListingsContent: React.FC<PersonalListingsContentProps> = ({
  listings,
  currentUser,
}) => {
  return (
    <div className="max-w-full items-center">
      <label className={title({ size: "sm" })}>Your active listings</label>
      <label className={subtitle({})}>All the listings you have created</label>

      <PersonalListingsTable listings={listings} />

      <div className="flex justify-center mt-10">
        <Button variant="flat">
          <Link href="/listings/personal/create">Create new listing</Link>
        </Button>
      </div>
    </div>
  );
};

export default PersonalListingsContent;
