"use client"

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  ChipProps,
  Pagination,
  useDisclosure,
} from "@nextui-org/react";
import { Report } from "@/types";
import { EyeIcon } from "../Icons";
import ReportDetailsModal from "@/components/reports/ReportDetailsModal";
import CreateNewRerportButton from "@/components/reports/CreateNewReportButton";

import { DeleteIcon } from "../Icons";
import { Reservation } from "@/types";
import { IoMdCheckmark as CheckmarkIcon } from "react-icons/io";
import { format } from "date-fns";
import { toast } from "sonner";
import { report } from "process";

const columns = [
  { name: "ID", uid: "name" },
  { name: "LISTING TITLE", uid: "title" },
  { name: "DATE OF CREATION", uid: "create_date" },
  { name: "FROM", uid: "start_date" },
  { name: "TO", uid: "end_date"},
  { name: "DETAILS", uid: "actions" },
];

interface ReportsTableProps {
  reports: Report[];
}

export default function ReportsTable({
  reports,
}: ReportsTableProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(reports.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reports.slice(start, end);
  }, [page, reports]);


  const detailsModal = useDisclosure();
  const newModal = useDisclosure();
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(null);

  const renderCell = React.useCallback(
    (report: Report, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize w-8">
                {report.id}
              </p>
            </div>
          );
        case "title":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {report.title}
              </p>
            </div>
          );
        case "create_date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {format(report.created_at, "PP")}
              </p>
            </div>
          );
        case "start_date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
              {format(report.start_date, "PP")}
              </p>
            </div>
          );
        case "end_date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
              {format(report.end_date, "PP")}
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50 ml-4">
                  <>
                    <EyeIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                        detailsModal.onOpenChange();
                      }}
                    />
                  </>
                </span>
              </Tooltip>
            </div>
          );

        default:
          return <></>;
      }
    },
    []
  );

  return (
    <>
      <ReportDetailsModal  
        isOpen={detailsModal.isOpen}
        onOpenChange={detailsModal.onOpenChange}
        report={selectedReport}
      />
      <Table
        aria-label="Example table with custom cells"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[372px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center mt-10">
        <CreateNewRerportButton
          onOpenChange={newModal.onOpenChange}
        />
      </div>   
    </>
  );
}
