import { getReports } from "@/actions/getReports";
import ReportsTable from "../../../components/reports/ReportsTable";
import ReportCreationForm from "../../../components/reports/ReportCreationForm";
import CreateNewReportButton from "../../../components/reports/CreateNewReportButton";

const ReportCreatePage = async () => {
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
      
    <ReportCreationForm/>
    </div>
  );
};

export default ReportCreatePage;
