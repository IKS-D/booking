import { EmailTemplate } from "../../components/EmailTemplate";
import { Resend } from "resend";

if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
  throw new Error("NEXT_PUBLIC_RESEND_API_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_EMAIL) {
  throw new Error("NEXT_PUBLIC_EMAIL is not set");
}

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async (reservation: any) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [process.env.NEXT_PUBLIC_EMAIL!],
      subject: "New reservation " + reservation.id,
      react: EmailTemplate({ firstName: "Mantas" }) as React.ReactElement,
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
