"use client";

import { Listing, deleteListing } from "@/actions/listings/getListings";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import { BsWindowSidebar } from "react-icons/bs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ListingRemovalConfirmModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onOpenChange: () => void;
}

const ListingRemovalConfirmModal: React.FC<ListingRemovalConfirmModalProps> = ({
  listing,
  isOpen,
  onOpenChange,
}) => {

  const router = useRouter();

  const onConfirm = async () => {
    const { error } = await deleteListing({ listing_id: +listing!.id });

    if (error) {
      toast.error('Failed to delete listing');
    } else {
      router.refresh();
      toast.success('Listing deleted successfully');
    }
  };

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
