"use client";

import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@nextui-org/modal";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Listing } from "@/types";

interface ListingEditModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: (updatedListing: Listing) => void;
}

const ListingEditModal: React.FC<ListingEditModalProps> = ({
  listing,
  isOpen,
  onOpenChange,
  onConfirm,
}) => {
    
  const [editedListing, setEditedListing] = useState<Listing | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  useEffect(() => {
    // When the modal is opened, initialize the editedListing with the current listing values
    if (isOpen && listing) {
      setEditedListing(listing);
    }
  }, [isOpen, listing]);

  const handleInputChange = (property: string, value: string | number) => {
    if (editedListing) {
      setEditedListing({
        ...editedListing,
        [property]: value,
      });
    }
  };

  const handleUploadFiles = (files: File[]) =>{
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    if(editedListing){
      setEditedListing({
        ...editedListing,
        images: [...editedListing.images, ...newPhotos],
      });
    }
  }

  const handleConfirm = () => {
    if (editedListing) {
      // Call the onConfirm callback with the edited listing
      onConfirm(editedListing);

      // Close the modal
      onOpenChange();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange}>
      <ModalContent className="p-7">
        <ModalHeader className="mb-10">Edit Listing</ModalHeader>
        {listing && (
          <div>
            <Input className="mb-5"
              label="Title"
              labelPlacement="outside"
              value={editedListing?.title || ""}
              onChange={(event) => handleInputChange("title", event.target.value)}
            />
            <Textarea className="mb-10"
              label="Description"
              labelPlacement="outside"
              value={editedListing?.description || ""}
              onChange={(event) => handleInputChange("description", event.target.value)}
            />
            <Input className="mb-10"
              label="Max guests"
              labelPlacement="outside"
              type="number"
              value={editedListing?.max_guests.toString() || ""}
              onChange={(event) => handleInputChange("max_guests", event.target.value)}
            />
            <Input className="mb-10"
              label="Price for a day"
              labelPlacement="outside"
              type="number"
              value={editedListing?.day_price.toString() || ""}
              onChange={(event) => handleInputChange("day_price", event.target.value)}
            />
            <Input className="mb-10"
                label="New photos"
                labelPlacement="outside-left"
                type="file"
                multiple
                onChange={(e) => {
                  const chosenFiles = Array.prototype.slice.call(e.target.files)

                  handleUploadFiles(chosenFiles);
                }}
            />
            {/* Add similar Input components for other properties */}
          </div>)
        }
        <ModalFooter>
            <Button onClick={handleConfirm}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ListingEditModal;
