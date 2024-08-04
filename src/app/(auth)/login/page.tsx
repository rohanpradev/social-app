import loginImage from "@/assets/auth.jpg";
import LoginForm from "@/features/auth/loginForm";
import { AcmeIcon } from "@/utils/social";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <div
      className="flex h-screen w-screen items-center justify-start overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
      style={{
        backgroundImage: `url(${loginImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Brand Logo */}
      <div className="absolute top-10 right-10">
        <div className="flex items-center">
          <AcmeIcon className="text-white" size={40} />
          <p className="font-medium text-white">BugBook</p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="absolute right-10 bottom-10 hidden md:block">
        <p className="max-w-xl text-right text-white/60">
          <span className="font-medium">“</span>A social media platform built for superusers.
          <span className="font-medium">”</span>
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />
    </div>
  );
}
