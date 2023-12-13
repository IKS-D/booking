import LoginForm from "@/components/auth/LoginForm";
import OAuthForm from "@/components/auth/OAuthForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <LoginForm />
      <div className="flex flex-col w-2/3 items-center">
        <div className="flex flex-col items-center">
          <p className="text-md">Or</p>
        </div>
        <OAuthForm />
      </div>
    </div>
  );
}
