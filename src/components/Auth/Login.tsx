"use client";

import { useUserLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/ReduxFunction";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [userLoginFn, { isLoading: isLoggingIn }] = useUserLoginMutation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await userLoginFn({
        email: data.email,
        password: data.password,
      }).unwrap();
      if (response?.success) {
        toast.success("Logged in successfully!");
        Cookies.set("token", response.result.accessToken);
        dispatch(
          setUser({
            role: response.result?.role ?? response.result?.user?.role ?? "",
            token: response.result.accessToken,
            email:
              response.result?.email ??
              response.result?.user?.email ??
              data.email,
            me:
              response.result?.user ??
              response.result?.me ??
              response.result?.profile ??
              null,
          }),
        );
        router.push("/");
      } else {
        toast.error(response?.message || "Login failed.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed.");
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    localStorage.setItem("googleSignIn", "true");

    signIn("google").catch((err) => {
      console.error("Google login error:", err);
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 font-sharpe ">
          Log in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          {/* Password with Eye Button */}
          <div className="mb-2 relative font-sharpe ">
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

            {/* Eye Button */}
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

          {/* Forgot Password */}
          <div className="flex justify-end mb-4">
            <Link
              href={"/reset-password"}
              type="button"
              className="text-lg text-text hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary text-white py-2 rounded-full hover:bg-primary/80 transition font-sharpe font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isLoggingIn && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isLoggingIn ? "Logging in..." : "Log in"}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-base text-gray-400">Or Login with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border py-3 px-2 rounded-full hover:bg-gray-50 text-base"
          >
            <FcGoogle size={30} />
            Continue with Google
          </button>

          {/* <button className="w-full flex items-center justify-center gap-3 border py-2 rounded-full hover:bg-gray-50 text-sm">
            <FaApple size={20} />
            Continue with Apple
          </button> */}
        </div>

        {/* Footer */}
        <Link href={"/register"}>
          <p className="text-center text-base text-gray-500 mt-6">
            Don’t have an account?{" "}
            <span className="text-primary cursor-pointer underline font-semibold">
              Sign up
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
}
