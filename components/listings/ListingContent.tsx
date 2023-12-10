"use client";

import React, { useState } from "react";
import { Image, Button, Divider, Textarea, Input } from "@nextui-org/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Listing } from "@/actions/listings/getListings";

type ListingContentProps = {
  listing: Listing;
};

const ListingContent: React.FC<ListingContentProps> = ({ listing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const nextImage = () => {
    setCurrentImageIndex(
      currentImageIndex + 1 % listing.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      currentImageIndex - 1 % listing.images.length
    );
  };

  return (
    <div className="relative z-50">
      <div className="flex flex-row gap-40 mt-3 mb-3 z-50">
        <div className="">
          <h2 className="text-xl font-bold mb-4">{listing.title}</h2>
          <Divider className="my-4" />

          <Textarea
            isReadOnly
            label="Description"
            variant="bordered"
            defaultValue={`${listing.description}`}
            className="max-w-xs"
          />

          <Input
            label="Address"
            value={`${listing.address}, ${listing.city}`}
            readOnly
            disabled
            variant="bordered"
            className="w-2/3 mt-3"
          />

          <div className="flex flex-row gap-2 mt-3 mb-3">
            <Input
              label="Category"
              value={`${
                listing.category!.name.charAt(0).toUpperCase() +
                listing.category!.name.slice(1)
              }`}
              readOnly
              disabled
              variant="bordered"
              className="w-1/3"
            />

            <Input
              label="Max Guests"
              value={`${listing.number_of_places}`}
              readOnly
              disabled
              variant="bordered"
              className="w-1/3"
            />

            <Input
              label="Price for a day"
              value={`${listing.day_price}`}
              readOnly
              disabled
              variant="bordered"
              className="w-1/3"
            />
          </div>
        </div>
        <div className="mt-10">
          <div className="relative w-96 h-48">
          {listing.images && listing.images.length > 0 ? (
            <div>
              <div className="relative">
                <Image
                  src={listing.images[currentImageIndex].url}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="object-contain"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="flex justify-center gap-5 mt-2 z-10">
                  <Button
                    className="prev-button"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                  >
                    <BsArrowLeft />
                  </Button>
                  <Button
                    className="next-button z-10"
                    onClick={nextImage}
                    disabled={currentImageIndex === listing.images.length - 1}
                  >
                    <BsArrowRight />
                  </Button>
                </div>
              )}
            </div>
          ) : null}
            <div className="flex justify-center gap-5 mt-2 z-10">
              <Button
                className="mt-6 items-center justify-center"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/reservations/${listing.id}`);
                }}
              >
                Make a reservation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingContent;
