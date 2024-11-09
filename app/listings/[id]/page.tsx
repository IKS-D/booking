import {
  getListingById,
  getChartInformation,
} from "@/actions/listings/listingsQueries";
import Head from "next/head";
import ListingContent from "../../../components/listings/ListingContent";
import ListingChart from "../../../components/listings/ListingChart";

export default async function ListingPage(props: {
  params: Promise<{ id: number }>;
}) {
  const params = await props.params;
  const { data: average } = await getChartInformation(params.id);

  const { data: listing } = await getListingById(params.id);

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
          async
        ></script>
      </Head>
      <div>
        <ListingContent listing={listing} />
        <ListingChart average={average ?? {}} />
      </div>
    </div>
  );
}
