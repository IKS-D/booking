"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/modal";
import { Button, Input, Textarea } from "@nextui-org/react";
import {
  Listing,
  PartialListingUpdate,
  updateListing,
} from "@/actions/listings/listingsQueries";
import FileUpload from "./FileUpload";
import { List } from "postcss/lib/list";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ListingEditModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onOpenChange: () => void;
}

const ListingEditModal: React.FC<ListingEditModalProps> = ({
  listing,
  isOpen,
  onOpenChange,
}) => {
  const [editedListing, setEditedListing] = useState<PartialListingUpdate>({});
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(
    null
  );
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (isOpen && listing) {
      const { title, description, number_of_places, day_price } = listing;
      setEditedListing({ title, description, number_of_places, day_price });
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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      // Handle the files (either a single file or multiple files)
      setSelectedFiles(files);
    } else {
      // Handle the case where no files are selected
      console.log("No files selected");
    }
  };

  const onConfirm = async () => {
    const { updateError } = await updateListing({
      editedListing: editedListing!,
      files: selectedFiles!,
      listing_id: +listing!.id,
    });

    if (updateError) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Listing edited successfully");
    router.refresh();
  };

  const handleConfirm = () => {
    if (editedListing) {
      onConfirm();

      onOpenChange();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onOpenChange}>
      <ModalContent className="p-7">
        <ModalHeader className="mb-10">Edit Listing</ModalHeader>
        {listing && (
          <div>
            <Input
              className="mb-5"
              label="Title"
              labelPlacement="outside"
              value={editedListing?.title || ""}
              onChange={(event) =>
                handleInputChange("title", event.target.value)
              }
            />
            <Textarea
              className="mb-10"
              label="Description"
              labelPlacement="outside"
              value={editedListing?.description || ""}
              onChange={(event) =>
                handleInputChange("description", event.target.value)
              }
            />
            <Input
              className="mb-10"
              label="Max guests"
              labelPlacement="outside"
              type="number"
              value={(editedListing?.number_of_places || 0).toString()}
              onChange={(event) =>
                handleInputChange("number_of_places", event.target.value)
              }
            />
            <Input
              className="mb-10"
              label="Price for a day"
              labelPlacement="outside"
              type="number"
              value={(editedListing?.day_price || 0).toString()}
              onChange={(event) => {
                const rawValue = event.target.value;
                const regex = /^\d+(\.\d{0,2})?$/; // Allow up to two decimal places
                if (rawValue === "" || regex.test(rawValue)) {
                  const value =
                    rawValue === "" ? undefined : parseFloat(rawValue);
                  handleInputChange("day_price", event.target.value);
                }
              }}
            />
            <FileUpload
              onFileChange={(files: FileList | null) => handleFileUpload(files)}
            ></FileUpload>
            {/* Add similar Input components for other properties */}
          </div>
        )}
        <ModalFooter>
          <Button onClick={handleConfirm}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ListingEditModal;
