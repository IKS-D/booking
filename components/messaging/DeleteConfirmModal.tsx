import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { deleteMessage } from "@/actions/messaging/messagesQueries";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
  messageId: number;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  messageId,
}) => {
  const handleDelete = async () => {
    try {
      await deleteMessage(messageId);
      onConfirm();
    } catch {}
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to delete this message?</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={() => {
              handleDelete();
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
