import { Report } from "@/types";

export async function getReports() {
    const reports = Array(20).fill(mockReport);
  
    return reports;
  }


  const mockReport: Report = {
    id: "1",
    title: "January report",
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
  };