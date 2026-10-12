"use client";

import { useResetPasswordMutation } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function NewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");
  const [resetPasswordFn, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();
  const forgetToken = Cookies.get("forgetToken") || "";
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await resetPasswordFn({
        data: { newPassword: data.password },
        token: forgetToken,
      }).unwrap();
      if (response?.success) {
        toast.success("Password reset successfully!");
        router.push("/login");
        Cookies.remove("forgetToken");
      } else {
        toast.error(response?.message || "Failed to reset password.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-normal text-center mb-2 font-mango">
          Create New Password
        </h2>

        <p className="text-base text-text text-center mb-6">
          Your password must be different from previous used password
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="mb-4 relative ">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary pr-10 font-sharpe"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative ">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary pr-10 font-sharpe"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isResettingPassword}
            className="w-full bg-primary text-white py-3 rounded-full mt-4 hover:bg-primary/80 transition font-sharpe font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isResettingPassword && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
