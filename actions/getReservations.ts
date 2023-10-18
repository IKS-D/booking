import { Listing, Reservation } from "@/types";

interface Params {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: Params) {
  const { listingId, userId, authorId } = params;

  const reservations = Array(20).fill(mockReservation);

  return reservations;
}

const mockListing: Listing = {
  id: "1",
  title: "Grand Apartment in Center of London",
  description: "This is a very nice apartment.",
  city: "London",
  address: "Baker Street 221b",
  created_at: new Date("2020-01-01"),
  category: "apartment",
  max_guests: 15,
  day_price: 459.99,
  images: [
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/430666399.jpg?k=3ec09fe5fe134a2c1a20215861ab31f64f209ea9bfa1ba526fd0438abef3a17b&o=&hp=1",
  ],
};

const mockReservation: Reservation = {
  id: "1",
  start_date: new Date("2022-01-02"),
  end_date: new Date("2022-01-03"),
  total_price: 500,
  listing: mockListing,
  created_at: new Date("2021-01-01"),
  status: "pending",
  additional_services: [],
};
