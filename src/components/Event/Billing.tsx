"use client";

import { setBookingDraft } from "@/redux/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

type BillingProps = {
  onContinue?: () => void;
};

export default function Billing({ onContinue }: BillingProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const savedBilling = useAppSelector((state) => state.booking.billing);
  const [companyName, setCompanyName] = useState(savedBilling.companyName);
  const [fullName, setFullName] = useState(savedBilling.fullName);
  const [telephoneNumber, setTelephoneNumber] = useState(
    savedBilling.telephoneNumber,
  );
  const [email, setEmail] = useState(savedBilling.email);
  const [street, setStreet] = useState(savedBilling.street);
  const [postalCode, setPostalCode] = useState(savedBilling.postalCode);
  const [city, setCity] = useState(savedBilling.city);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const billingSchema = z.object({
    companyName: z.string().optional(),
    fullName: z.string().min(1, "Full name is required"),
    telephoneNumber: z.string().min(1, "Telephone number is required"),
    email: z.string().email("Enter a valid email address"),
    street: z.string().min(1, "Street is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    city: z.string().min(1, "City is required"),
  });

  const validateBilling = () => {
    const payload = {
      companyName,
      fullName,
      telephoneNumber,
      email,
      street,
      postalCode,
      city,
    };

    const result = billingSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return true;
    }

    const errMap: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key) errMap[key] = issue.message;
    }
    setErrors(errMap);
    return false;
  };

  const isValidEmail = (value: string) => {
    return /^\S+@\S+\.\S+$/.test(value);
  };

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!fullName.trim()) missing.push("Full name");
    if (!telephoneNumber.trim()) missing.push("Telephone number");
    if (!email.trim() || !isValidEmail(email)) missing.push("E-mail address");
    if (!street.trim()) missing.push("Street");
    if (!postalCode.trim()) missing.push("Postal code");
    if (!city.trim()) missing.push("City");
    return missing;
  }, [fullName, telephoneNumber, email, street, postalCode, city]);

  const isBillingValid = useMemo(() => {
    return billingSchema.safeParse({
      companyName,
      fullName,
      telephoneNumber,
      email,
      street,
      postalCode,
      city,
    }).success;
  }, [companyName, fullName, telephoneNumber, email, street, postalCode, city]);

  useEffect(() => {
    dispatch(
      setBookingDraft({
        billing: {
          companyName,
          fullName,
          telephoneNumber,
          email,
          street,
          postalCode,
          city,
        },
      }),
    );
  }, [
    city,
    companyName,
    dispatch,
    email,
    fullName,
    postalCode,
    street,
    telephoneNumber,
  ]);

  return (
    <section className="pb-12 ">
      <div className="md:w-[1000px] mx-auto bg-secondary text-[#202330]  p-4 md:px-16 md:py-10 ">
        <h2 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[32px] ">
          Billing Address
            {/* if (!isBillingValid) return; */}
        </h2>

        <form
          className="mt-8 space-y-10"
          onSubmit={(event) => {
            event.preventDefault();
            if (!validateBilling()) return;
            onContinue?.();
            router.push("/event/participate");
          }}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-5 md:gap-y-6">
            <label className="space-y-2">
              <span className="block text-[18px] font-medium text-black">
                Company
              </span>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-[18px] font-medium text-black">
                Full Name *
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="block text-[18px] font-medium text-black">
                Telephone Number *
              </span>
              <input
                type="tel"
                value={telephoneNumber}
                onChange={(e) => setTelephoneNumber(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
              {errors.telephoneNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.telephoneNumber}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="block text-[18px] font-medium text-black">
                E-mail address *
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="block text-[18px] font-medium text-black">
                Street. house number *
              </span>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
              {errors.street && (
                <p className="text-red-600 text-sm mt-1">{errors.street}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="block text-[18px] font-medium text-black">
                Postal code *
              </span>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
              {errors.postalCode && (
                <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
              )}
            </label>

            <label className="space-y-2 md:col-span-1">
              <span className="block text-[18px] font-medium text-black">
                City *
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </label>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className={
                `h-16 w-full max-w-[500px] rounded-full text-2xl font-medium transition ` +
                (isBillingValid ? "bg-black text-white hover:opacity-90" : "bg-gray-300 text-gray-600 cursor-not-allowed")
              }
              disabled={!isBillingValid}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
