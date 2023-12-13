import { format } from "date-fns";
import {
  Body,
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
            Hello <strong>{receiver}</strong>,
          </Text>

          <Text className="text-black text-[14px] leading-[24px]">
            You have a new message from <strong>{sender}</strong> on Booking.
          </Text>

          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

          <Text className="text-lg text-black">Message details</Text>

          <Text className="text-black text-[14px] leading-[24px]">
            <strong>Reservation: </strong>
            {reservation_id}
          </Text>

          <Text className="text-black text-[14px] leading-[24px]">
            <strong>Message: </strong>
            {text}
          </Text>

          <Text className="text-black text-[14px] leading-[24px]">
            <strong>Sent at: </strong>
            {format(new Date(sent_time), "yyyy-MM-dd HH:mm:ss")}
          </Text>

          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

          <Text className="text-[#666666] text-[12px] leading-[24px]">
            Thank you for choosing us! We hope you have a great stay.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
