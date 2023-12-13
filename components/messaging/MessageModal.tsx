"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoIosPaperPlane } from "react-icons/io";
import EditMessageModal from "./EditMessageModal";
import {
  insertMessage,
  getMessagesForCurrentUser,
} from "@/actions/messaging/messagesQueries";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Button,
  Avatar,
} from "@nextui-org/react";
import getCurrentUser from "@/actions/users/usersQueries";

interface MessageModalProps {
  isOpen: boolean;
  reservationId: number;
  onOpenChange: () => void;
}

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours > 12 ? hours - 12 : hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${hours >= 12 ? "PM" : "AM"}`;
};

type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  reservationId,
  onOpenChange,
}) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null
  );
  const messagesBottomRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    messagesBottomRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chatMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessagesForCurrentUser(reservationId);
        const currentUser = await getCurrentUser();
        if (response && response.data) {
          const transformedMessages = response.data.map((msg) => ({
            id: msg.id,
            sender: msg.sender_id === currentUser?.id ? "user" : "owner",
            content: msg.text,
            timestamp: formatTime(new Date(msg.sent_time)),
          }));
          setChatMessages(transformedMessages);
        } else {
          setChatMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (isOpen) {
      fetchMessages();
    }

    setPending(false);
  }, [isOpen, reservationId]);

  const handleSendMessage = async () => {
    setPending(true);
    setMessage("Sending...");

    const newMessage = {
      text: message,
      reservationId: reservationId,
    };

    setChatMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        content: message,
        timestamp: formatTime(
          new Date(new Date().getTime() - 2 * 60 * 60 * 1000)
        ),
      },
    ]);

    await insertMessage(newMessage);

    try {
      const response = await getMessagesForCurrentUser(reservationId);
      const currentUser = await getCurrentUser();

      if (response && response.data) {
        const transformedMessages = response.data.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === currentUser?.id ? "user" : "owner",
          content: msg.text,
          timestamp: formatTime(new Date(msg.sent_time)),
        }));

        setChatMessages(transformedMessages);
        setMessage("");
      } else {
        setChatMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

    setPending(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader>Chat Conversation</ModalHeader>
        <ModalBody>
          <div className="scrollbox h-96 p-4 pb-0">
            <div>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.sender === "owner" && (
                    <div className="rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center mr-2">
                      <Avatar
                        as="button"
                        size="sm"
                        isBordered
                        color="secondary"
                        className="transition-transform"
                        showFallback
                      />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.content}
                    <span className="ml-2 text-xs text-gray-600">
                      {msg.timestamp}
                    </span>
                    {msg.sender === "user" && (
                      <button
                        className="ml-2"
                        onClick={() => {
                          setEditingMessage(msg);
                          setIsEditingModalOpen(true);
                        }}
                      >
                        ...
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesBottomRef} />
          </div>
          <Textarea
            className="mt-4 h-15"
            placeholder="Type your message here..."
            value={message}
            isDisabled={pending}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={handleSendMessage}
            isDisabled={pending}
          >
            Send
            <IoIosPaperPlane className="w-5 h-5" />
          </Button>
        </ModalFooter>
        <EditMessageModal
          isOpen={isEditingModalOpen}
          onOpenChange={() => setIsEditingModalOpen(false)}
          message={editingMessage}
          onSave={(editedMessage) => {
            setChatMessages((prev) =>
              prev.map((msg) =>
                msg.id === editedMessage.id ? editedMessage : msg
              )
            );
          }}
          onDelete={(messageId) => {
            setChatMessages((prev) =>
              prev.filter((msg) => msg.id !== messageId)
            );
          }}
        />
      </ModalContent>
    </Modal>
  );
};

export default MessageModal;
