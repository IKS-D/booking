"use client";

import { Listing, Reservation } from "@/types";
import { Button, useDisclosure } from "@nextui-org/react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { toast } from "sonner";
import { format } from "date-fns";
import ReservationDetailsModal from "@/components/reservations/ReservationDetailsModal";
import ReservationCancelConfirmModal from "@/components/reservations/ReservationCancelModal";

interface ReservationCardProps {
  listing: Listing;
  reservation: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: User | null;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  listing,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const cancelModal = useDisclosure();
  const detailsModal = useDisclosure();

  const cancelReservation = async () => {
    toast("Cancelling reservation...");
  };

  const getDateString = () => {
    const start = reservation.start_date;
    const end = reservation.end_date;

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  };

  return (
    <>
      <ReservationCancelConfirmModal
        reservation={reservation}
        isOpen={cancelModal.isOpen}
        onOpenChange={cancelModal.onOpenChange}
        onConfirm={cancelReservation}
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
              src={listing.images[0]}
              alt="Listing"
            />

            {/* Can be used to add icons on top of the image
             <div
              className="
            absolute
            top-3
            right-3
            "
            >
               <HeartButton listingId={listing.id} currentUser={currentUser} />
            </div> */}
          </div>

          <div className="font-semibold text-lg">{listing.title}</div>
          <div className="text-default-600 font-ligth">
            {listing.category.charAt(0).toUpperCase() +
              listing.category.slice(1)}
          </div>

          <div className="font-semibold">{getDateString()}</div>

          {onAction && actionLabel && (
            <Button
              color="danger"
              variant="bordered"
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
