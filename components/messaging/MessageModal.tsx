"use client";
import React, { useEffect, useState } from "react";
import { IoIosPaperPlane } from "react-icons/io";
import EditMessageModal from "./EditMessageModal";
import { insertMessage, getMessagesForCurrentUser } from "@/actions/messaging/messagesQueries";
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
    return `${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? "0" : ""}${minutes} ${hours >= 12 ? "PM" : "AM"}`;
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
    const [message, setMessage] = React.useState("");
    const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);


    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await getMessagesForCurrentUser(reservationId);
          const currentUser = await getCurrentUser();
          if (response && response.data) {
            const transformedMessages = response.data.map(msg => ({
              id: msg.id,
              sender: msg.sender_id === currentUser?.id ? "user" : "owner",
              content: msg.text,
              timestamp: formatTime(new Date(msg.sent_time))
            }));
            setChatMessages(transformedMessages);
          } else {
            setChatMessages([]);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      if (isOpen) {
        fetchMessages();
      }
    }, [isOpen, reservationId]); 

  
    const handleSendMessage = async () => {
      const newMessage = {
        text: message,
        reservationId: reservationId
      };
      await insertMessage(newMessage);
      try {
        const response = await getMessagesForCurrentUser(reservationId);
        const currentUser = await getCurrentUser();
        if (response && response.data) {
          const transformedMessages = response.data.map(msg => ({
            id: msg.id,
            sender: msg.sender_id === currentUser?.id ? "user" : "owner",
            content: msg.text,
            timestamp: formatTime(new Date(msg.sent_time))
          }));
          setChatMessages(transformedMessages);
          setMessage("");
        } else {
          setChatMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
      
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader>Chat Conversation</ModalHeader>
          <ModalBody>
            <div className="overflow-y-auto h-96 p-4">
            {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : ""}`}>
                    {msg.sender === "owner" && 
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
                    }
                    <div className={`p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                        {msg.content}
                        <span className="ml-2 text-xs text-gray-600">{msg.timestamp}</span> 
                        <button
                                className="ml-2"
                                onClick={() => {
                                    setEditingMessage(msg);
                                    setIsEditingModalOpen(true);
                                }}
                                >
                                ...
                            </button>
                    </div>
                </div>
            ))}
            </div>
            <Textarea
                className="mt-4 h-15" 
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();  
                    handleSendMessage();
                    }
                }}
                />
          </ModalBody>
          <ModalFooter>
          <Button color="primary" onPress={handleSendMessage}>
            Send
            <IoIosPaperPlane className="w-5 h-5" />
          </Button>
        </ModalFooter>
        <EditMessageModal 
            isOpen={isEditingModalOpen} 
            onOpenChange={() => setIsEditingModalOpen(false)}
            message={editingMessage}
            onSave={(editedMessage) => {
                setChatMessages(prev => prev.map(msg => msg.id === editedMessage.id ? editedMessage : msg));
            }}
            onDelete={(messageId) => {
                setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
              }}
        />
        </ModalContent>
      </Modal>
    );
  };
  
  export default MessageModal;
  