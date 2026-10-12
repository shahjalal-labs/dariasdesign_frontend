"use client";
import bankTransfer from "@/assets/bank_transfer.png";
import checkoutImage from "@/assets/checkoutImage.png";
import klarna from "@/assets/kalrma.png";
import paypal from "@/assets/paypal.png";
import {
  useCreateBookingMutation,
  useCreateBookingPaypalMutation,
  useGetDiscountInfoQuery,
} from "@/redux/api/bookingApi";
import { setBookingDraft } from "@/redux/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";

import { toast } from "sonner";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";

type CheckoutProps = {
  participantCount?: number;

  discountCode?: string;
  onPayNow?: () => void;
};

export default function Checkout({
  participantCount,

  discountCode,
  onPayNow,
}: CheckoutProps) {
  const dispatch = useAppDispatch();
  const bookingDraft = useAppSelector((state) => state.booking);
  const authState = useAppSelector((state) => state.auth);
  const token = Cookies.get("token") ?? authState.token ?? "";
  const [createBookingFn, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();
  const [createBookingPaypalFn, { isLoading: isCreatingPaypalBooking }] =
    useCreateBookingPaypalMutation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "bank-transfer" | "klarna" | "paypal"
  >(
    bookingDraft.paymentGateway === "Paypal"
      ? "paypal"
      : bookingDraft.paymentGateway === "Klarna"
        ? "klarna"
        : "bank-transfer",
  );

  useEffect(() => {
    if (selectedPaymentMethod === "paypal") {
      dispatch(setBookingDraft({ paymentGateway: "Paypal" }));
    }
  }, [dispatch, selectedPaymentMethod]);

  useEffect(() => {
    const mappedGateway =
      selectedPaymentMethod === "paypal"
        ? "Paypal"
        : selectedPaymentMethod === "klarna"
          ? "Klarna"
          : "BankTransfer";
    if (bookingDraft.paymentGateway !== mappedGateway) {
      dispatch(setBookingDraft({ paymentGateway: mappedGateway }));
    }
  }, [bookingDraft.paymentGateway, dispatch, selectedPaymentMethod]);

  const resolvedDiscountCode = (discountCode ?? bookingDraft.code ?? "").trim();
  const [discountCodeInput, setDiscountCodeInput] =
    useState(resolvedDiscountCode);
  const normalizedDiscountCode = discountCodeInput.trim().toUpperCase();
  const resolvedParticipantCount =
    participantCount ?? bookingDraft.totalParticipantCount;

  useEffect(() => {
    const trimmedCode = discountCodeInput.trim().toUpperCase();
    if (trimmedCode !== bookingDraft.code) {
      dispatch(setBookingDraft({ code: trimmedCode }));
    }
  }, [discountCodeInput, dispatch, bookingDraft.code]);

  useEffect(() => {
    if (discountCode && discountCode !== discountCodeInput) {
      setDiscountCodeInput(discountCode);
    }
  }, [discountCode]);
  const {
    currentData: discountInfoData,
    error: discountInfoError,
    isFetching: isCheckingDiscount,
    isError: isDiscountError,
  } = useGetDiscountInfoQuery(normalizedDiscountCode, {
    skip: !normalizedDiscountCode,
  });
  const discountPercentage =
    isDiscountError || !normalizedDiscountCode
      ? 0
      : (discountInfoData?.result?.discount ?? 0);
  const discountErrorMessage = useMemo(() => {
    if (!normalizedDiscountCode || !discountInfoError) {
      return "";
    }

    const parsedError = discountInfoError as {
      status?: number;
      data?: {
        message?: string;
        errorMessages?: { message?: string }[];
      };
    };

    return (
      parsedError.data?.errorMessages?.[0]?.message ||
      parsedError.data?.message ||
      (parsedError.status === 404
        ? "Discount code not found."
        : "Unable to validate discount code.")
    );
  }, [discountInfoError, normalizedDiscountCode]);

  const subtotal = useMemo(() => {
    return bookingDraft.subtotal || 0;
  }, [bookingDraft.subtotal]);

  const discountAmount = useMemo(() => {
    return subtotal * (discountPercentage / 100);
  }, [subtotal, discountPercentage]);

  const netAmount = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  const vatAmount = useMemo(() => {
    return netAmount * 0.19;
  }, [netAmount]);

  const totalPrice = useMemo(() => {
    return netAmount;
  }, [netAmount, vatAmount]);

  const singlePrice = useMemo(() => {
    return subtotal / (Number(resolvedParticipantCount) || 1);
  }, [resolvedParticipantCount, subtotal]);

  const formattedTotalPrice = useMemo(() => {
    return totalPrice.toFixed(2);
  }, [totalPrice]);

  const formattedSinglePrice = useMemo(() => {
    return singlePrice.toFixed(2);
  }, [singlePrice]);

  const formattedDiscountAmount = useMemo(() => {
    return discountAmount.toFixed(2);
  }, [discountAmount]);

  const formattedNetAmount = useMemo(() => {
    return netAmount.toFixed(2);
  }, [netAmount]);

  const total = Number(formattedTotalPrice);
  const vat = Number(vatAmount);
  const finalPrice = total + vat;

  const createBookingPayload = () => {
    const selectedParticipants = bookingDraft.participants
      .slice(0, resolvedParticipantCount)
      .map((participant) => ({
        fullName: participant.fullName,
        email: participant.email,
        phoneNumber: participant.phoneNumber,
      }));

    const note = bookingDraft.participants
      .map((participant) => participant.note.trim())
      .filter(Boolean)
      .join(" | ");

    const userId =
      authState.me?._id ?? authState.me?.id ?? authState.me?.userId ?? "";

    return {
      paymentGateway:
        selectedPaymentMethod === "paypal"
          ? "Paypal"
          : selectedPaymentMethod === "klarna"
            ? "Klarna"
            : "BankTransfer",
      browserId: bookingDraft.browserId || undefined,
      userId: token && userId ? userId : undefined,
      slotId: bookingDraft.selectedSlotId || undefined,
      eventId: bookingDraft.eventId || undefined,
      quantity: resolvedParticipantCount,
      discountCode: discountCodeInput.trim() || undefined,
      price: Number(singlePrice.toFixed(2)),
      ticketId: bookingDraft.selectedTicketId || undefined,
      tickets: bookingDraft.selectedTicketsData?.map(t => ({ ticketId: t.id, quantity: t.quantity })) || undefined,
      companyName: bookingDraft.billing.companyName,
      fullName: bookingDraft.billing.fullName,
      email: bookingDraft.billing.email,
      phoneNumber: bookingDraft.billing.telephoneNumber,
      street: bookingDraft.billing.street,
      postalCode: bookingDraft.billing.postalCode,
      city: bookingDraft.billing.city,
      isVideoGrapher: bookingDraft.isVideographer,
      participants: selectedParticipants,
      notes: note || undefined,
    };
  };

  const handlePayNow = async () => {
    const payload = createBookingPayload();

    try {
      const response =
        selectedPaymentMethod === "paypal"
          ? await createBookingPaypalFn(payload).unwrap()
          : await createBookingFn(payload).unwrap();

      const checkoutUrl = response?.result?.checkoutUrl;
      if (checkoutUrl) {
        localStorage.setItem("paymentSuccessPending", "true");
        window.location.assign(checkoutUrl);
      }
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      const errorMessage =
        error?.data?.errorMessages?.[0]?.message ||
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred while processing your booking.";
      toast.error(errorMessage);
    }

    onPayNow?.();
  };

  return (
    <section className="">
      <div className="mx-auto max-w-[1000px] bg-secondary p-4 md:p-16 py-10 md:py-16 space-y-12 text-[#202330]">
        {/* Order Summary Card */}
        <div className="flex flex-col overflow-hidden border-2 border-black bg-white lg:flex-row">
          <div className="relative min-h-[320px] w-full lg:w-[32%]">
            <Image
              src={checkoutImage}
              alt="event"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 bg-[#f4efe5] px-5 py-4 md:px-7 md:py-5">
            <div className="border-b border-black/20 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[28px]">
                    Lace Money
                  </h3>
                </div>
                <p className="pt-1 text-[15px] font-medium tracking-[0.08em] text-[#616873] md:text-[18px]">
                  -17-20.04.26
                </p>
              </div>
            </div>

            <div className="pt-8 md:pt-10">
              <div className="space-y-4">
                {bookingDraft.selectedTicketsData?.map((ticket, index) => (
                  <div key={ticket.id || index} className="grid grid-cols-[auto_1fr_auto_1fr] items-start gap-x-6 gap-y-4 md:gap-x-8">
                    <div className="self-center text-[34px] font-black leading-none text-black md:text-[42px]">
                      {ticket.quantity}X
                    </div>

                    <div className="space-y-1">
                      <p className="inline-block bg-[#ede6d7] px-2 py-0.5 text-[12px] font-medium uppercase tracking-[0.08em] text-black">
                        {ticket.ticketName}
                      </p>
                      <p className="text-[18px] font-medium leading-none text-black md:text-[22px]">
                        {ticket.ticketPrice.toFixed(2)}€
                      </p>
                    </div>

                    <div className="mx-auto h-[56px] w-px self-center bg-black md:h-[70px]" />

                    <div className="justify-self-end space-y-1 text-right">
                      <p className="inline-block bg-[#ede6d7] px-2 py-0.5 text-[12px] font-medium uppercase tracking-[0.08em] text-black">
                        Total Price
                      </p>
                      <p className="text-[18px] font-medium leading-none text-black md:text-[22px]">
                        {(ticket.ticketPrice * ticket.quantity).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                ))}

                {(!bookingDraft.selectedTicketsData || bookingDraft.selectedTicketsData.length === 0) && (
                  <div className="grid grid-cols-[auto_1fr_auto_1fr] items-start gap-x-6 gap-y-4 md:gap-x-8">
                    <div className="row-span-2 self-center text-[34px] font-black leading-none text-black md:text-[42px]">
                      {resolvedParticipantCount}X
                    </div>

                    <div className="space-y-1">
                      <p className="inline-block bg-[#ede6d7] px-2 py-0.5 text-[12px] font-medium uppercase tracking-[0.08em] text-black">
                        Single Price
                      </p>
                      <p className="text-[18px] font-medium leading-none text-black md:text-[22px]">
                        {formattedSinglePrice}€
                      </p>
                    </div>

                    <div className="row-span-2 mx-auto h-[56px] w-px self-center bg-black md:h-[70px]" />

                    <div className="justify-self-end space-y-1 text-right">
                      <p className="inline-block bg-[#ede6d7] px-2 py-0.5 text-[12px] font-medium uppercase tracking-[0.08em] text-black">
                        Total Price
                      </p>
                      <p className="text-[18px] font-medium leading-none text-black md:text-[22px]">
                        {subtotal}€
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <label className="col-span-1 text-[16px] uppercase tracking-[0.04em] text-[#606775] md:text-[18px]">
                  Discount Code
                </label>
                <input
                  type="text"
                  value={discountCodeInput}
                  onChange={(e) => setDiscountCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className="w-full max-w-[210px] border-2 border-black bg-white px-5 py-3 text-center text-[16px] font-medium uppercase tracking-[0.08em] text-black md:text-[18px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              {normalizedDiscountCode && isCheckingDiscount ? (
                <p className="col-span-4 mt-1  text-right text-[14px] font-medium text-[#616873] md:text-[16px]">
                  Checking discount...
                </p>
              ) : discountErrorMessage ? (
                <p className="col-span-4 mt-1  text-right text-[14px] font-medium text-[#c73535] md:text-[16px]">
                  {discountErrorMessage}
                </p>
              ) : discountPercentage > 0 ? (
                <p className="col-span-4 mt-1  text-right text-[14px] font-medium text-[#31b44a] md:text-[16px]">
                  -{formattedDiscountAmount}€ Discount ({discountPercentage}%)
                </p>
              ) : (
                <div className="flex justify-end pt-2">
                  <button className="text-lg font-semibold underline text-black">
                    Check Discount
                  </button>
                </div>
              )}

              <div className="mt-5 border-t-2 border-black/80 pt-6 md:mt-6 md:pt-7">
                <div className="mx-auto max-w-[420px] space-y-2 text-center">
                  <div className="flex items-center justify-between gap-6">
                    <p className="text-[15px] font-black uppercase tracking-[0.04em] text-black md:text-[18px]">
                      Net Amount :
                    </p>
                    <p className="text-[16px] font-medium text-black md:text-[19px]">
                      {formattedNetAmount}€
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <p className="text-[15px] font-black uppercase tracking-[0.04em] text-black md:text-[18px]">
                      UST 19% :
                    </p>
                    <p className="text-[16px] font-medium text-black md:text-[19px]">
                      {vatAmount.toFixed(2)}€
                    </p>
                  </div>

                  <div className="mt-4 rounded-full bg-[#eee7d9] px-6 py-3">
                    <div className="flex items-center justify-center gap-3 text-black">
                      <p className="text-[15px] font-black uppercase tracking-[0.04em] md:text-[18px]">
                        Total Price :
                      </p>
                      <p className="text-[16px] font-medium md:text-[19px]">
                        {finalPrice.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-6">
          <h2 className="text-[24px] font-black uppercase tracking-[0.03em] text-black md:text-[32px]">
            Choose Payment Method :
          </h2>

          <div className="space-y-4">
            {/* PayPal */}
            <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] p-4 transition hover:bg-[#f0f0f0] md:p-6">
              <input
                type="radio"
                name="payment-method"
                value="paypal"
                checked={selectedPaymentMethod === "paypal"}
                onChange={(e) =>
                  setSelectedPaymentMethod(
                    e.target.value as "bank-transfer" | "klarna" | "paypal",
                  )
                }
                className="h-6 w-6 border-[#2e323d] text-black focus:ring-black"
              />
              <Image
                src={paypal}
                alt="PayPal"
                className="h-8 w-8 object-contain"
              />
              <span className="flex-1 text-[18px] font-medium text-black md:text-[20px]">
                PayPal
              </span>
            </label>

            {/* Klarna */}
            <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] p-4 transition hover:bg-[#f0f0f0] md:p-6">
              <input
                type="radio"
                name="payment-method"
                value="klarna"
                checked={selectedPaymentMethod === "klarna"}
                onChange={(e) =>
                  setSelectedPaymentMethod(
                    e.target.value as "bank-transfer" | "klarna" | "paypal",
                  )
                }
                className="h-6 w-6 border-[#2e323d] text-black focus:ring-black"
              />
              <Image
                src={klarna}
                alt="Klarna"
                className="h-8 w-8 object-contain"
              />
              <span className="flex-1 text-[18px] font-medium text-black md:text-[20px]">
                Klarna
              </span>
            </label>

            {/* Bank Transfer */}
            <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#2e323d] bg-white p-4 ring-2 ring-black/10 transition hover:bg-[#f9f9f9] md:p-6">
              <input
                type="radio"
                name="payment-method"
                value="bank-transfer"
                checked={selectedPaymentMethod === "bank-transfer"}
                onChange={(e) =>
                  setSelectedPaymentMethod(
                    e.target.value as "bank-transfer" | "klarna" | "paypal",
                  )
                }
                className="h-6 w-6 border-[#2e323d] text-black focus:ring-black"
              />
              <Image
                src={bankTransfer}
                alt="Bank Transfer"
                className="h-8 w-8 object-contain"
              />
              <span className="flex-1 text-[18px] font-medium text-black md:text-[20px]">
                Bank Transfer
              </span>
            </label>
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isCreatingBooking || isCreatingPaypalBooking}
            className="h-16 w-full max-w-[500px] rounded-full bg-black text-2xl font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingBooking || isCreatingPaypalBooking
              ? "Processing..."
              : "Pay Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
