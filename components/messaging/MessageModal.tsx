"use client";
import React, { useEffect, useState } from "react";
import { IoIosPaperPlane } from "react-icons/io";
import { getMessages } from "@/actions/getMessages";
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
  
  interface MessageModalProps {
    isOpen: boolean;
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
    onOpenChange,
  }) => {
    const [message, setMessage] = React.useState("");
    const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  
    const handleSendMessage = () => {
        const newMessage = {
          id: Date.now(),
          sender: "user",
          content: message,
          timestamp: formatTime(new Date()), 
        };
        setChatMessages([...chatMessages, newMessage]);
        setMessage("");
      };

      useEffect(() => {
        (async () => {
            const fetchedMessages = await getMessages();
            setChatMessages(fetchedMessages);
        })();
    }, []);
      
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
                        <span className="ml-2 text-xs text-gray-600">{msg.timestamp}</span> {/* Display timestamp */}
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
        </ModalContent>
      </Modal>
    );
  };
  
  export default MessageModal;
  