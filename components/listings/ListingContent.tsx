"use client"

import React, { useState } from 'react';
import { Listing } from "@/types";
import { Image, Button, Divider, Textarea, Input } from "@nextui-org/react";
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

type ListingContentProps = {
  listing: Listing;
};

const ListingContent: React.FC<ListingContentProps> = ({ listing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + listing.images.length) % listing.images.length);
  };

  return (
    <div>
        <div className="flex flex-row gap-40 mt-3 mb-3">
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
                        value={`${listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}`}
                        readOnly
                        disabled
                        variant="bordered"
                        className="w-1/3"
                    />

                    <Input
                        label="Max Guests"
                        value={`${listing.max_guests}`}
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
                    <div className="relative">
                        <Image
                            src={listing.images[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex justify-center gap-5 mt-2">
                        <Button
                            className="prev-button"
                            onClick={prevImage}
                            disabled={listing.images.length <= 1 || currentImageIndex === 0}
                        >
                            <BsArrowLeft />
                        </Button>
                        <Button
                            className="next-button"
                            onClick={nextImage}
                            disabled={listing.images.length <= 1 || currentImageIndex === listing.images.length - 1}
                        >
                            <BsArrowRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <label className="text-lg font-semibold">
                Average cost of a listing in the city of {listing.city}
        </label>

        <Image
            src={"https://images.squarespace-cdn.com/content/v1/55b6a6dce4b089e11621d3ed/1585087896250-R3GZ6OFWYQRZUJRCJU3D/produce_monthly.png"}
            className="relative w-96 h-48"
        />
    </div>
  );
};

export default ListingContent;