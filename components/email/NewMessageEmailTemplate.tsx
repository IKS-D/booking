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

interface NewMessageEmailTemplate {
  reservation_id: number;
  text: string;
  sent_time: string;
  sender: string;
  receiver: string;
}

const baseUrl = "https://iksd.vercel.app";

export const NewMessageEmailTemplate: React.FC<
  Readonly<NewMessageEmailTemplate>
> = ({ reservation_id, text, sent_time, sender, receiver }) => (
  <Html>
    <Head />
    <Preview>You have a new message</Preview>
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
            You have a new message on <strong>Booking</strong>
          </Heading>
          <Text className="text-black text-[14px] leading-[24px]">
            Hello{" "}
            {receiver}
            ,
          </Text>
          <Text className="text-black text-[14px] leading-[24px]">
            Reservation: <strong>{reservation_id}{". "}
            </strong>. {sender}: <strong>{text}</strong>{". "}
            <strong>{sent_time}</strong> {". "}
          </Text>
          <Section className="text-center mt-[32px] mb-[32px]">
            <Button
              className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-[20px] py-[12px]"
              href={`${baseUrl}/reservations`}
            >
              View Reservations
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
