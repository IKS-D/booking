"use client";

import React from "react";
import ReservationCard from "@/components/reservations/ReservationCard";
import { Reservation } from "@/types";
import { subtitle, title } from "@/components/primitives";
import { format } from "date-fns";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import MessageModal from "..//messaging//MessageModal";  


interface ReservationDetailsProps {
  reservation: Reservation;
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
                  src={reservation.listing.images[0]}
                  alt={reservation.listing.title}
                  radius="lg"
                  width={300}
                  className="mb-6"
                />

                <label className={title({ size: "sm" })}>
                  {reservation.listing.title}
                </label>

                <div className="flex flex-row gap-2 mt-6">
                  <Input
                    label="Start date"
                    value={format(reservation.start_date, "PP")}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                  <Input
                    label="End date"
                    value={format(reservation.end_date, "PP")}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                  <Input
                    label="Status"
                    value={reservation.status.toString()}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-1/3"
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <Input
                    label="Adress"
                    value={`${reservation.listing.address}, ${reservation.listing.city}`}
                    readOnly
                    disabled
                    variant="bordered"
                    className="w-2/3"
                  />
                </div>

                {reservation.additional_services.length > 0 ? (
                  <div className="flex flex-col gap-2 mt-4">
                    <label className={subtitle({})}>Additional services</label>

                    <div className="flex flex-row gap-2">
                      {reservation.additional_services.map((service) => (
                        <Input
                          label={service.name}
                          value={`${service.price} €`}
                          readOnly
                          disabled
                          variant="bordered"
                          // className="w-1/3"
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
                    router.push(`/listings/${reservation.listing.id}`);
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
                  onOpenChange={() => setIsMessageModalOpen(!isMessageModalOpen)}
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
