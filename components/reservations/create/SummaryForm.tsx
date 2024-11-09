import React from "react";
import AnimatedFormWrapper from "../AnimatedFormWrapper";
import { differenceInDays, format } from "date-fns";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Reservation } from "@/types";
import { ListingWithDetails } from "@/actions/listings/listingsQueries";

interface SummaryFormProps {
  reservation: Partial<Reservation>;
  listing: ListingWithDetails;
}

const SummaryForm = ({ reservation, listing }: SummaryFormProps) => {
  const servicesPrice =
    reservation.services?.reduce((a, b) => a + b.price, 0) || 0;

  const totalPrice =
    servicesPrice +
    (listing?.day_price || 0) *
      differenceInDays(
        reservation.end_date || new Date(),
        reservation.start_date || new Date()
      );

  return (
    <AnimatedFormWrapper
      key="step3"
      title={"Reservation Review"}
      description={"Please review the information before booking"}
    >
      <div className="mt-[20px]">
        <div className="flex gap-3">
          <Input
            className="w-1/2"
            isReadOnly
            label={"Your reservation will be for"}
            variant="bordered"
            value={
              reservation.start_date &&
              reservation.end_date &&
              `${format(reservation.start_date, "LLL dd, y")} - ${format(
                reservation.end_date,
                "LLL dd, y"
              )}`
            }
          />
          <Input
            className="w-1/2"
            isReadOnly
            label={"Duration"}
            variant="bordered"
            value={
              reservation.start_date &&
              reservation.end_date &&
              `${differenceInDays(
                reservation.end_date,
                reservation.start_date
              )} days`
            }
          />
        </div>

        <div className="flex gap-3 mt-3">
          <Input
            isReadOnly
            label={"Additional Services Price"}
            variant="bordered"
            value={`${servicesPrice / 100} €`}
            className="w-1/2"
          />
          <Input
            isReadOnly
            label={"Total Price"}
            variant="bordered"
            value={`${totalPrice / 100} €`}
            className="w-1/2"
          />
          <input type="hidden" name="totalPrice" value={totalPrice} />
        </div>

        {reservation.services && (
          <>
            <Table
              isCompact
              // isHeaderSticky
              removeWrapper
              classNames={{
                base: "max-h-[250px] scrollbox overflow-scroll mt-4",
                th: "bg-transparent text-default-500 border-b border-divider",
              }}
            >
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Price</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No additional services selected">
                {reservation.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.title}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.price / 100 + " €"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </AnimatedFormWrapper>
  );
};

export default SummaryForm;
