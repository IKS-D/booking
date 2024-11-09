"use client";

import React from "react";
import { subtitle, title } from "@/components/primitives";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Image, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import MessageModal from "..//messaging//MessageModal";
import { ReservationWithDetails } from "@/actions/reservations/reservationsQueries";
import { format } from "date-fns";
import { defaultListingImage } from "@/config/constants";

interface ReservationDetailsProps {
  reservation: ReservationWithDetails;
  isOpen: boolean;
  onOpenChange: () => void;
}

const ReservationDetailsModal: React.FC<ReservationDetailsProps> = ({
  reservation,
  isOpen,
  onOpenChange,
}) => {
  const router = useRouter();

  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        // scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reservation details
              </ModalHeader>
              <ModalBody className="mb-6">
                <Image
                  src={
                    reservation.listing?.images[0]?.url || defaultListingImage
                  }
                  alt={reservation.listing?.title}
                  radius="lg"
                  width={300}
                  className="mb-6"
                />

                <label className={title({ size: "sm" })}>
                  {reservation.listing?.title}
                </label>

                <div className="flex flex-row gap-2 mt-6">
                  <Input
                    label="Start date"
                    value={format(new Date(reservation.start_date), "PP")}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                  <Input
                    label="End date"
                    value={format(new Date(reservation.end_date), "PP")}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                  <Input
                    label="Status"
                    value={
                      reservation.status.name
                        .toString()
                        .charAt(0)
                        .toUpperCase() +
                      reservation.status.name.toString().slice(1)
                    }
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <Input
                    label="Address"
                    value={`${reservation.listing?.address}, ${reservation.listing?.city}`}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-2/3"
                  />
                  <Input
                    label="Total price"
                    value={reservation.total_price / 100 + " €"}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                </div>

                {reservation.ordered_services.length > 0 ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <label className={subtitle({})}>Additional services</label>

                    <div className="flex flex-row gap-2">
                      {reservation.ordered_services.map((service, index) => (
                        <Input
                          key={index}
                          label={service.service?.title}
                          value={`${(service.service?.price || 0) / 100} €`}
                          readOnly
                          disabled
                          variant="bordered"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => setIsMessageModalOpen(true)}
                >
                  Send Message
                </Button>
                <Button
                  color="secondary"
                  onPress={() => {
                    router.push(`/listings/${reservation.listing?.id}`);
                    onClose();
                  }}
                >
                  Open listing
                </Button>
                <Button
                  onPress={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
                <MessageModal
                  isOpen={isMessageModalOpen}
                  reservationId={reservation?.id || 0}
                  onOpenChange={() =>
                    setIsMessageModalOpen(!isMessageModalOpen)
                  }
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReservationDetailsModal;
