"use client";

import { Listing } from "@/types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";

interface ListingRemovalConfirmModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
}

const ListingRemovalConfirmModal: React.FC<ListingRemovalConfirmModalProps> = ({
  listing,
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
                  You are about to delete listing{" "}
                  <label className="text-primary">
                    {listing?.title}
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

export default ListingRemovalConfirmModal;
