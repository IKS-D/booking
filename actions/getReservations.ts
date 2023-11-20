import { Listing, Reservation } from "@/types";
import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

interface Params {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export async function getReservations(params: Params) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // let { data: reservations, error } = await supabase.from("reservation")
  //   .select(`
  //   *
  // `);

  // if (error) {
  //   console.error(error);
  //   return;
  // }

  const { listingId, userId, authorId } = params;

  const reservations = Array(20).fill(mockReservation);

  return reservations;
}

export async function getPendingReservations(params: Params) {
  const { listingId, userId, authorId } = params;

  let reservations = Array(20)
    .fill(null)
    .map((_, index) => {
      const reservation: Reservation = {
        ...mockReservation,
        id: `${index}`,
      };

      return reservation;
    });

  return reservations;
}

const mockUser = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  email: "mock@mock.com",
  password: "password",
  date_of_birth: new Date(2000, 0, 1),
  phone_number: "+37011111111",
  country: "United Kingdom",
  city: "London",
  avatar: "https://i.pravatar.cc/300",
  created_at: new Date("2020-01-01"),
};

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
  guest: mockUser,
  additional_services: [
    {
      id: "1",
      name: "Breakfast",
      description: "Breakfast is served every morning.",
      price: 10,
    },
    {
      id: "2",
      name: "Airport Transfer",
      description: "We will pick you up at the airport.",
      price: 50,
    },
    {
      id: "3",
      name: "Laundry",
      description: "We will wash your clothes.",
      price: 20,
    },
    /*     {
      id: "4",
      name: "Bike Rental",
      description: "You can rent a bike.",
      price: 15,
    },
    {
      id: "5",
      name: "Parking",
      description: "You can park your car.",
      price: 10,
    }, */
  ],
};
