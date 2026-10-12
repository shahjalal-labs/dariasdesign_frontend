"use client";

import { useCreateUserMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [createUserFn, { isLoading: isSigningUp }] = useCreateUserMutation();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const bodyData = {
      fullName: data.name,
      email: data.email,
      phoneNumber: data.phone,
      password: data.password,
    };
    try {
      const response = await createUserFn(bodyData).unwrap();
      if (response?.success) {
        toast.success("User created successfully!");
        router.push(`/verify-otp?email=${data.email}`);
      } else {
        toast.error(response?.message || "Failed to create user.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 font-sharpe ">
          Create your Account
        </h2>
        <p className="text-center font-normal text-base text-gray-500">
          Create account and enjoy all services
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Name */}
          <div className="mb-4 font-sharpe ">
            <input
              type="text"
              placeholder="Full Name"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4 font-sharpe ">
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
              className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-4  ">
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Enter a valid phone number",
                },
              })}
              className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-2 relative  ">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-text hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-primary text-white py-3 rounded-full mt-4 hover:bg-primary/80 transition font-sharpe font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isSigningUp && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isSigningUp ? "Signing up..." : "Sign Up"}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-base text-gray-400">Or Sign up with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex gap-3">
          <button className="w-full flex items-center justify-center gap-3 border py-3 rounded-full hover:bg-gray-50 text-base">
            <FcGoogle size={30} />
            Continue with Google
          </button>

          {/* <button className="w-full flex items-center justify-center gap-3 border py-2 rounded-full hover:bg-gray-50 text-sm">
            <FaApple size={20} />
            Continue with Apple
          </button> */}
        </div>

        {/* Footer */}
        <Link href={"/login"}>
          <p className="text-center text-base text-gray-500 mt-6">
            Already have an account?{" "}
            <span className="text-primary cursor-pointer underline font-semibold">
              Login
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
}
