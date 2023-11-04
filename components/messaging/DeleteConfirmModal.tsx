import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this message?
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={() => {
              onConfirm();
              onOpenChange();
            }}
          >
            Confirm
          </Button>
          <Button color="default" onPress={onOpenChange}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
