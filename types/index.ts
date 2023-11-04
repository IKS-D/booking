import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type User = {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  phone_number: string;
  avatar: string;
  created_at: Date;
  country: string;
  city: string;
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
  guest: User;
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
type AccountStatus = "active" | "inactive"
