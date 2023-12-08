"use client";

import { Button, useDisclosure } from "@nextui-org/react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import ReservationDetailsModal from "@/components/reservations/ReservationDetailsModal";
import ReservationCancelConfirmModal from "@/components/reservations/ReservationCancelModal";
import {
  ReservationWithDetails,
  cancelReservation,
} from "@/actions/reservations/reservationsQueries";

interface ReservationCardProps {
  reservation: ReservationWithDetails;
  onAction?: (id: string) => void;
  disabledCancel?: boolean;
  actionLabel?: string;
  currentUser?: User | null;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onAction,
  disabledCancel: disabled,
  actionLabel,
  currentUser,
}) => {
  const listing = reservation.listing!;

  const cancelModal = useDisclosure();
  const detailsModal = useDisclosure();

  const onCancelReservation = async () => {
    await cancelReservation(reservation.id.toString());
    toast.success("Reservation cancelled successfully");
  };

  const getDateString = () => {
    const start = reservation.start_date;
    const end = reservation.end_date;

    return `${format(new Date(start), "PP")} - ${format(new Date(end), "PP")}`;
  };

  return (
    <>
      <ReservationCancelConfirmModal
        reservation={reservation}
        isOpen={cancelModal.isOpen}
        onOpenChange={cancelModal.onOpenChange}
        onConfirm={onCancelReservation}
      />

      <ReservationDetailsModal
        reservation={reservation}
        isOpen={detailsModal.isOpen}
        onOpenChange={detailsModal.onOpenChange}
      />

      <div
        onClick={() => {
          detailsModal.onOpenChange();
        }}
        className="cursor-pointer group"
      >
        <div className="flex flex-col gap-2 w-full">
          <div
            className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
          >
            <Image
              fill
              className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
              src={listing?.photos || ""}
              alt="Listing"
            />
          </div>

          <div className="font-semibold text-lg truncate">{listing.title}</div>
          <div className="text-default-600 font-ligth">
            {listing.category &&
              listing.category?.name.charAt(0).toUpperCase() +
                listing.category?.name.slice(1)}
          </div>

          <div className="font-semibold">{getDateString()}</div>

          {onAction && actionLabel && (
            <Button
              color={disabled ? "default" : "danger"}
              variant="ghost"
              isDisabled={disabled}
              onClick={cancelModal.onOpenChange}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReservationCard;
