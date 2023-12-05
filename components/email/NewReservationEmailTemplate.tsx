import { ReservationWithDetails } from "@/actions/reservations/reservationsQueries";
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { User } from "@supabase/supabase-js";

interface NewReservationEmailTemplateProps {
  reservation: ReservationWithDetails;
  host: User;
}

const baseUrl = "https://iksd.vercel.app";

export const NewReservationEmailTemplate: React.FC<
  Readonly<NewReservationEmailTemplateProps>
> = ({ reservation, host }) => (
  <Html>
    <Head />
    <Preview>Your listing has been booked</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
          <Section className="mt-[32px]">
            <Img
              src={`${baseUrl}/iksd-logo.png`}
              width="40"
              height="37"
              alt="Booking"
              className="my-0 mx-auto"
            />
          </Section>
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            You have a new reservation on <strong>Booking</strong>
          </Heading>
          <Text className="text-black text-[14px] leading-[24px]">
            Hello {host.email}
            {/* {reservation.guest?.first_name + " " + reservation.guest?.last_name} */}
            ,
          </Text>
          <Text className="text-black text-[14px] leading-[24px]">
            Your listing <strong>{reservation.listing?.title}</strong> has been
            booked by{" "}
            {reservation.guest?.first_name + " " + reservation.guest?.last_name}{" "}
            . The reservation starts on{" "}
            <strong>{reservation.start_date}</strong> and ends on{" "}
            <strong>{reservation.end_date}</strong>. You can view the
            reservation details in <strong>Pending reservations</strong> page.
          </Text>
          <Section className="text-center mt-[32px] mb-[32px]">
            <Button
              className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-[20px] py-[12px]"
              href={`${baseUrl}/reservations/pending`}
            >
              View Pending Reservations
            </Button>
          </Section>

          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Text className="text-[#666666] text-[12px] leading-[24px]">
            Thank you for choosing us! We hope you have a great stay.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
