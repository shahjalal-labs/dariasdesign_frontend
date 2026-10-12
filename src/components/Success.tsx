"use client";

import { resetBookingDraft } from "@/redux/bookingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { persistor } from "@/redux/store";
import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Success() {
  const searchParams = useSearchParams();
  console.log("searchParams", searchParams);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const success = searchParams.get("success");
    const token = searchParams.get("token");
    const paymentSuccess = searchParams.get("paymentSuccess");
    const status = searchParams.get("status");
    const pendingSuccess = localStorage.getItem("paymentSuccessPending");

    const isPaymentSuccess =
      success === "true" ||
      token === "true" ||
      paymentSuccess === "true" ||
      status === "success" ||
      pendingSuccess === "true";

    if (!isPaymentSuccess) return;

    dispatch(resetBookingDraft());
    persistor.purge();
    localStorage.removeItem("persist:booking");
    localStorage.removeItem("paymentSuccessPending");
    // localStorage.removeItem("persist:auth");
  }, [dispatch, searchParams]);

  return (
    <section className="min-h-screen  px-4 py-12 md:px-10 md:py-16 flex items-center justify-center">
      <div className="mx-auto max-w-[900px] text-center bg-[#FCFBF9] p-[64px] rounded-xl">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Outer ring - light green */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100 to-green-50 shadow-lg" />
            {/* Middle ring - medium green */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-200 to-green-100" />
            {/* Inner circle - bright green */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <Check
                className="w-16 h-16 md:w-20 md:h-20 text-white"
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 font-mango text-4xl md:text-5xl font-bold text-title">
          Booking Confirmed
        </h1>

        {/* Description */}
        <p className="mb-8 text-base md:text-lg text-[#6b7280] leading-relaxed max-w-lg mx-auto">
          Your spot at the exclusive workshop is secured. We've sent the details
          to your Email.
        </p>

        {/* My Ticket Button */}
        <Link href="/ticket">
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3 text-base font-semibold text-white shadow-md transition  hover:-translate-y-1 active:translate-y-0 md:px-10 md:py-4 md:text-lg w-full">
            My Tickets
          </button>
        </Link>

        {/* Optional: Back to home link */}
        <div className="mt-8">
          <Link href="/">
            <p className="text-base text-[#6b7280] hover:text-primary underline underline-offset-2 transition">
              Back to Home
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
