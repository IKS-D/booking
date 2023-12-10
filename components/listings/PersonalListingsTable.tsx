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
import { FaPen } from 'react-icons/fa';
import ListingRemovalConfirmModal from "@/components/listings/ListingRemovalConfirmModal";
import ListingEditModal from "@/components/listings/ListingEditModal";

import { DeleteIcon } from "../Icons";
import { Reservation } from "@/types";
import { IoMdCheckmark as CheckmarkIcon } from "react-icons/io";
import { format } from "date-fns";
import { toast } from "sonner";
import { Listing, Listings } from "@/actions/listings/getListings";

const columns = [
  { name: "ID", uid: "name" },
  { name: "LISTING TITLE", uid: "listing" },
  { name: "CITY", uid: "city" },
  { name: "ADDRESS", uid: "address" },
  { name: "CATEGORY", uid: "category"},
  { name: "MAXIMUM GUEST NUMBER", uid: "max_guests" },
  { name: "PRICE FOR A DAY", uid: "day_price" },
  { name: "CREATION DATE", uid: "created_at" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  confirmed: "success",
  canceled: "danger",
  pending: "warning",
};

interface PersonalListingsTableProps {
  listings: Listings;
}

export default function PersonalListingsTable({
  listings,
}: PersonalListingsTableProps) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 6;

  const pages = Math.ceil(listings.length / rowsPerPage);

  const items = React.useMemo(() => {
    if (!Array.isArray(listings)) {
      // Handle the case where listings is not an array (or is undefined)
      return [];
    }
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return listings.slice(start, end);
  }, [page, listings]);

  const [selectedListing, setSelectedListing] = React.useState<Listing | null>(null);

  const removeListing = (listing : Listing) => {
    setSelectedListing(listing);
    removeModal.onOpenChange();
  };

  const editListing = (listing : Listing) => {
    setSelectedListing(listing);
    editModal.onOpenChange();
  };



  const editModal = useDisclosure();
  const removeModal = useDisclosure();

  const renderCell = React.useCallback(
    (listing: Listing, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize w-8">
                {listing.id}
              </p>
            </div>
          );
        case "listing":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {listing.title}
              </p>
            </div>
          );
        case "city":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {listing.city}
              </p>
            </div>
          );
        case "address":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {listing.address}
              </p>
            </div>
          );
        case "created_at":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
              {format(new Date(listing.creation_date), "PP")}
              </p>
            </div>
          );
        case "category":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {listing.category!.name}
              </p>
            </div>
          );
        case "max_guests":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {listing.number_of_places}
              </p>
            </div>
          );
        case "day_price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {listing.day_price / 100} $
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="danger" content="Remove listing">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon
                    onClick={(e) => {
                        e.stopPropagation();
                        removeListing(listing);
                      }}
                    />
                </span>
              </Tooltip>
              <Tooltip color="success" content="Edit listing information">
                <span className="text-lg text-success cursor-pointer active:opacity-50">
                  < FaPen
                    onClick={(e) => {
                        e.stopPropagation();
                        editListing(listing);
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
      <ListingRemovalConfirmModal  
        isOpen={removeModal.isOpen}
        onOpenChange={removeModal.onOpenChange}
        listing={selectedListing}
      />
      
      {/* <ListingRemovalConfirmModal  
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        onConfirm={edList}
        listing={selectedListing}
      /> */}

      <ListingEditModal  
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        listing={selectedListing}
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
    </>
  );
}
