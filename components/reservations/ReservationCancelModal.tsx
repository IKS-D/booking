"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import { ReservationWithDetails } from "@/actions/reservations/reservationsQueries";

interface ReservationCancelProps {
  reservation: ReservationWithDetails;
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
}

const ReservationCancelConfirmModal: React.FC<ReservationCancelProps> = ({
  reservation,
  isOpen,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  You are about to cancel your reservation in{" "}
                  <label className="text-primary">
                    {reservation.listing?.title}
                  </label>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  No
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    onConfirm();
                  }}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReservationCancelConfirmModal;
