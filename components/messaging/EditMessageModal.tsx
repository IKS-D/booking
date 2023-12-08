import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Button,
} from "@nextui-org/react";
import DeleteConfirmationModal from "./DeleteConfirmModal"; 
import { updateMessageText } from "@/actions/messaging/messagesQueries";

interface EditMessageModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    message: ChatMessage | null;
    onSave: (editedMessage: ChatMessage) => void;
    onDelete: (messageId: number) => void;
}
  
type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

const EditMessageModal: React.FC<EditMessageModalProps> = ({
  isOpen,
  onOpenChange,
  message,
  onSave,
  onDelete,
}) => {
  const [editedContent, setEditedContent] = React.useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (message) {
      setEditedContent(message.content);
    }
  }, [message]);

  const handleSave = async () => {
    const newMessage = {
      messageId: message?.id || 0,
      newText: editedContent  || ""
    };
    await updateMessageText(newMessage);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader>Edit Message</ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="Edit your message..."
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={() => {
              if (message) {
                onSave({ ...message, content: editedContent });
                handleSave();
                onOpenChange();
              }
            }}
          >
            Save
          </Button>
          {message && (
            <Button
              color="danger"
              className="ml-2"
              onPress={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          )}
        </ModalFooter>
      </ModalContent>

      {message && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
          onConfirm={() => {
            onDelete(message.id);
            onOpenChange();
          }}
          messageId={message.id}
        />
      )}
    </Modal>
  );
};

export default EditMessageModal;
