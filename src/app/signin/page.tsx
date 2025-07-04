"use client";

import { EmailConfirmation } from "@/src/components/email-confirmation";
import type { RootState } from "@/src/redux/store/store";
import { LoginForm } from "@/src/components/login-form";
import { CONFIRMED_EMAIL } from "@/src/lib/variables";
import { Button } from "@/src/components/ui/button";
import { useAppSelector } from "@/src/lib/hooks";
import { getCookie } from "@/src/lib/cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [confirmedEmail, setConfirmedEmail] = useState<boolean>(true);
  const user = useAppSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    const email = getCookie(CONFIRMED_EMAIL);
    if (email) {
      setConfirmedEmail(email === "true" ? true : false);
    }
  }, [user]);

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        {
          confirmedEmail ?
          (
            <>
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                  LabAssist
                </h2>
                <p className="text-center text-sm text-gray-600">
                  Laboratory Animal Management System
                </p>
              </div>
              <LoginForm />
            </>
          )
          :
          (
            <EmailConfirmation />
          )
        }
      </div>
    </div>
  );
}
