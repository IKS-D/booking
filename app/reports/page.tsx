import { getReports } from "@/actions/listings/getReports";
import ReportsTable from "../../components/reports/ReportsTable";
import CreateNewReportButton from "../../components/reports/CreateNewReportButton";

const ReportsPage = async () => {
  const reports = await getReports();

  if (reports.length === 0) {
    return (
      <>
        <label className="text-lg font-semibold">No reports found.</label>
        <div className="flex justify-center mt-10">
          <CreateNewReportButton />
        </div>
      </>
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
      <ReportsTable reports={reports} />
    </div>
  );
};

export default ReportsPage;
