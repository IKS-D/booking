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
  country: string;
  city: string;
  avatar: string;
  created_at: Date;
};

export type Reservation = {
  id: string;
  start_date: Date;
  end_date: Date;
  total_price: number;
  created_at: Date;
  status: ReservationStatus;
  services: Service[];
  listing: Listing;
  guest: User;
};

export type Service = {
  id: number;
  title: string;
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

export type Report = {
  id: string;
  title: string;
  created_at: Date;
  start_date: Date;
  end_date: Date;
};

type ReservationStatus = "pending" | "canceled" | "confirmed";
export type ListingCategory = "apartment" | "house" | "room" | "flat";
