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
import { DeleteIcon, EyeIcon } from "../Icons";
import { IoMdCheckmark as CheckmarkIcon } from "react-icons/io";
import ReservationDetailsModal from "./ReservationDetailsModal";
import { format } from "date-fns";
import { ReservationWithDetails as Reservation } from "@/actions/getReservations";
import { title } from "../primitives";

const columns = [
  { name: "ID", uid: "name" },
  { name: "LISTING", uid: "listing" },
  { name: "GUEST", uid: "guest" },
  { name: "START DATE", uid: "start_date" },
  { name: "END DATE", uid: "end_date" },
  { name: "TOTAL PRICE", uid: "price" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  confirmed: "success",
  canceled: "danger",
  pending: "warning",
};

interface PendingReservationTableProps {
  pendingReservations: Reservation[];
  onConfirm: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
}

export default function PendingReservationTable({
  pendingReservations,
  onConfirm,
  onCancel,
}: PendingReservationTableProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(pendingReservations.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return pendingReservations.slice(start, end);
  }, [page, pendingReservations]);

  const detailsModal = useDisclosure();
  const [reservationModal, setReservation] = React.useState<Reservation | null>(
    null
  );

  const renderCell = React.useCallback(
    (reservation: Reservation, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize w-8">
                {reservation.id}
              </p>
            </div>
          );
        case "listing":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {reservation.listing?.title}
              </p>
            </div>
          );
        case "guest":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {reservation.guest?.first_name} {reservation.guest?.last_name}
              </p>
            </div>
          );
        case "start_date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {format(new Date(reservation.start_date), "PP")}
              </p>
            </div>
          );
        case "end_date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {format(new Date(reservation.end_date), "PP")}
              </p>
            </div>
          );

        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {reservation.total_price / 100} €
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[reservation.status.name]}
              size="sm"
              variant="flat"
            >
              {reservation.status.name}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <ReservationDetailsModal
                reservation={reservation!}
                isOpen={detailsModal.isOpen}
                onOpenChange={detailsModal.onOpenChange}
              />
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <>
                    <EyeIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setReservation(reservation);
                        detailsModal.onOpenChange();
                      }}
                    />
                  </>
                </span>
              </Tooltip>
              <Tooltip content="Confirm reservation">
                <span className="text-lg text-success cursor-pointer active:opacity-50">
                  <CheckmarkIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirm(reservation);
                    }}
                  />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Cancel reservation">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(reservation);
                    }}
                  />
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
      {reservationModal && (
        <ReservationDetailsModal
          reservation={reservationModal}
          isOpen={detailsModal.isOpen}
          onOpenChange={detailsModal.onOpenChange}
        />
      )}

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
    </>
  );
}
