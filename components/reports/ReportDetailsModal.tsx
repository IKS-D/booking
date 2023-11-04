"use client";

import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/modal";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Report } from "@/types";

interface ReportDetailsModalProps {
  report: Report | null;
  isOpen: boolean;
  onOpenChange: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  isOpen,
  onOpenChange,
}) => {

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange}>
      <ModalContent className="p-3">
        <Input
            label="Money earned"
            value={"100$"}
            readOnly
            disabled
            variant="bordered"
            className="w-1/3 mt-3"
        />
        <Input
            label="People made happy"
            value={"4"}
            readOnly
            disabled
            variant="bordered"
            className="mt-3 w-5/12"
        />
        <Input
            label="Reviews written"
            value={"420"}
            readOnly
            disabled
            variant="bordered"
            className="mt-3 w-5/12"
        />
      </ModalContent>
    </Modal>
  );
};

export default ReportDetailsModal;
