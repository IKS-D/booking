import {
  getListingById,
  getChartInformation,
} from "@/actions/listings/listingsQueries";
import { Image } from "@nextui-org/react";
import Head from "next/head";
import { useEffect, useMemo, useRef } from "react";
import ListingContent from "../../../components/listings/ListingContent";
import ListingChart from "../../../components/listings/ListingChart";

export default async function ListingPage({
  params,
}: {
  params: { id: number };
}) {
  const { data: average, error: chartError } = await getChartInformation(
    params.id
  );

  const id = params.id; // Extract the 'id' from the URL

  const { data: listing, error } = await getListingById(params.id);

  if (!listing) {
    return (
      <label className="text-lg font-semibold">
        Such listing does not exist
      </label>
    );
  }

  return (
    <div
      className="
                mx-auto
                xl:px-20 
                md:px-10
                sm:px-2
                px-4
                justify-center
            "
    >
      <Head>
        <script
          type="text/javascript"
          src="https://www.gstatic.com/charts/loader.js"
        ></script>
      </Head>
      <div>
        <ListingContent listing={listing} />
        <ListingChart average={average ?? {}} />
      </div>
    </div>
  );
}
