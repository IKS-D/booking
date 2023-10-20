import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Reservation = {
  id: string;
  start_date: Date;
  end_date: Date;
  total_price: number;
  created_at: Date;
  status: ReservationStatus;
  additional_services: AdditionalService[];
  listing: Listing;
};

export type AdditionalService = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string;
  created_at: Date;
  category: ListingCategory;
  max_guests: number;
  day_price: number;
  images: string[];
};

type ReservationStatus = "pending" | "canceled" | "confirmed";
type ListingCategory = "apartment" | "house" | "room" | "flat";
