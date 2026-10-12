"use client";

import { useCreateUserVerificationMutation } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  otp: string;
};

export default function VerifyOtp() {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const OTP_LENGTH = 4;
  const params = useSearchParams();
  const email = params.get("email");
  const [userVerificationFn, { isLoading: isVerifyingOtp }] =
    useCreateUserVerificationMutation();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const otpArray = inputsRef.current.map((input) => input?.value || "");
    otpArray[index] = value;

    const otp = otpArray.join("");
    setValue("otp", otp, { shouldValidate: true });

    // Move next
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (
      e.key === "Backspace" &&
      !inputsRef.current[index]?.value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // 🔥 Paste full OTP support
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(paste)) return;

    paste.split("").forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });

    setValue("otp", paste, { shouldValidate: true });
    inputsRef.current[paste.length - 1]?.focus();
  };

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await userVerificationFn({
        email,
        otp: data.otp,
      }).unwrap();
      if (response?.success) {
        toast.success("OTP verified successfully!");
        Cookies.set("token", response.result.accessToken); // Replace with actual token storage logic
        router.push("/"); // Redirect to home or dashboard after successful verification
      } else {
        toast.error(response?.message || "OTP verification failed.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl md:text-4xl font-mango font-normal mb-2">
          Verification Code
        </h2>

        <p className="text-base text-text mb-6">
          We send a four digit code to your email address
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(OTP_LENGTH)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                onPaste={handlePaste}
                ref={(el) => {
                  if (el) inputsRef.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:border-primary"
              />
            ))}
          </div>

          {/* Hidden input for validation */}
          <input
            type="hidden"
            {...{
              ...({} as any),
              ...{
                ...{
                  name: "otp",
                },
              },
            }}
            {...(null as any)}
          />

          {errors.otp && (
            <p className="text-red-500 text-sm mb-2">
              Please enter complete OTP
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="w-full bg-primary text-white py-3 rounded-full mt-2 hover:bg-primary/80 transition font-sharpe font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isVerifyingOtp && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isVerifyingOtp ? "Verifying..." : "Submit"}
            </span>
          </button>
        </form>

        <p className="text-bae text-text mt-4">
          Re-send code in {""}
          <span className="text-primary cursor-pointer underline font-semibold">
            0
          </span>
        </p>

        <p className="text-base text-text mt-2">
          Can&apos;t find the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
