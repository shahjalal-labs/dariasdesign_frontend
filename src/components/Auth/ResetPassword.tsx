"use client";

import { useForgetPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  email: string;
};

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [forgetPasswordFn, { isLoading: isSendingCode }] =
    useForgetPasswordMutation();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await forgetPasswordFn({ email: data.email }).unwrap();
      if (response?.success) {
        toast.success("Verification code sent to your email!");
        router.push(`/reset-password/verify-otp?email=${data.email}`);
      } else {
        toast.error(response?.message || "Failed to send verification code.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send verification code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-normal text-center mb-2 font-mango">
          Reset your Password
        </h2>

        <p className="text-base text-text text-center mb-6">
          Enter your email to get a verification code
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4 font-sharpe">
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-2 py-2 text-text border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Send Code Button */}
          <button
            type="submit"
            disabled={isSendingCode}
            className="w-full bg-primary text-white py-3 rounded-full mt-4 hover:bg-primary/80 transition font-sharpe font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isSendingCode && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isSendingCode ? "Sending..." : "Send Code"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
