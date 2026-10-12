"use client";
import { getOrCreateBrowserId, readBrowserId } from "@/lib/bookingIdentity";
import {
  useGetDiscountInfoQuery,
  useGetEventWiseTicketQuery,
} from "@/redux/api/bookingApi";
import { useGetAvailableSlotQuery } from "@/redux/api/slotApi";
import { setBookingDraft } from "@/redux/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ticketCountOptions = [1, 2, 3, 4];

type SlotItem = {
  id: string;
  startTime: string;
  endTime: string;
  quantity: number;
};

type DateSlotGroup = {
  date: string;
  slots: SlotItem[];
};

type AvailableSlotsResponse = {
  success: boolean;
  message: string;
  result: DateSlotGroup[];
};

type BookingProps = {
  onContinue?: (payload: { participantCount: number }) => void;
  onBookingDataChange?: (data: {
    earlyBird: number;
    vlogRabatt: number;
    code: string;
  }) => void;
};

export default function Booking({
  onContinue,
  onBookingDataChange,
}: BookingProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const savedBooking = useAppSelector((state) => state.booking);
  const token = Cookies.get("token") ?? "";
  const params = useSearchParams();
  const eventId = params.get("id");
  const [selectedDate, setSelectedDate] = useState(
    savedBooking.selectedDate || "",
  );
  const [selectedSlotId, setSelectedSlotId] = useState(
    savedBooking.selectedSlotId || "",
  );
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>(
    savedBooking.ticketCounts || {},
  );
  const [code, setCode] = useState(savedBooking.code || "");
  const [acceptTerms, setAcceptTerms] = useState(savedBooking.acceptTerms);
  const [acceptPrivacy, setAcceptPrivacy] = useState(
    savedBooking.acceptPrivacy,
  );
  const [acceptVlogTerms, setAcceptVlogTerms] = useState(
    savedBooking.acceptVlogTerms,
  );

  const { data: availableSlotsData, isLoading: isLoadingSlots } = useGetAvailableSlotQuery({});
  const { data: getEventWiseTicketData, isLoading: isLoadingTickets } = useGetEventWiseTicketQuery(eventId);
  
  const tickets = useMemo(() => {
    return (getEventWiseTicketData as any)?.result || [];
  }, [getEventWiseTicketData]);

  const slotGroups = useMemo(() => {
    return (
      (availableSlotsData as AvailableSlotsResponse | undefined)?.result ?? []
    ).filter((group) => Array.isArray(group?.slots) && group.slots.length > 0);
  }, [availableSlotsData]);

  const dateOptions = useMemo(() => {
    return slotGroups.map((group) => {
      const parsedDate = new Date(group.date);
      const label = Number.isNaN(parsedDate.getTime())
        ? group.date
        : parsedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

      return {
        value: group.date,
        label,
      };
    });
  }, [slotGroups]);

  const dateLabelMap = useMemo(() => {
    return new Map(
      dateOptions.map((dateOption) => [dateOption.value, dateOption.label]),
    );
  }, [dateOptions]);

  const timeSlotOptions = useMemo(() => {
    return slotGroups.flatMap((group) =>
      group.slots.map((slot) => ({
        id: slot.id,
        date: group.date,
        quantity: slot.quantity,
        label: `${slot.startTime} - ${slot.endTime} (${slot.quantity} ${slot.quantity === 1 ? "Spot" : "Spots"})`,
      })),
    );
  }, [slotGroups]);

  const normalizedDiscountCode = code.trim();
  const { data: discountInfoData } = useGetDiscountInfoQuery(
    normalizedDiscountCode,
    {
      skip: !normalizedDiscountCode,
    },
  );
  const discountPercentage = discountInfoData?.result?.discount ?? 0;

  useEffect(() => {
    if (!selectedDate && dateOptions.length > 0) {
      setSelectedDate(dateOptions[0].value);
    }
  }, [dateOptions, selectedDate]);

  useEffect(() => {
    if (!token) {
      const browserId = getOrCreateBrowserId();
      if (browserId && browserId !== savedBooking.browserId) {
        dispatch(setBookingDraft({ browserId }));
      }
      return;
    }

    if (!savedBooking.browserId) {
      const existingBrowserId = readBrowserId();
      if (existingBrowserId) {
        dispatch(setBookingDraft({ browserId: existingBrowserId }));
      }
    }
  }, [dispatch, savedBooking.browserId, token]);

  useEffect(() => {
    onBookingDataChange?.({
      earlyBird: 0,
      vlogRabatt: 0,
      code,
    });
  }, [ticketCounts, code, onBookingDataChange]);

  const participantCount = useMemo(() => {
    return Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  }, [ticketCounts]);

  const subtotal = useMemo(() => {
    return Object.entries(ticketCounts).reduce((sum, [ticketId, count]) => {
      const ticket = tickets.find((t: any) => t.id === ticketId);
      return sum + count * (ticket?.ticketPrice || 0);
    }, 0);
  }, [ticketCounts, tickets]);

  useEffect(() => {
    const selectedTicketsData = Object.entries(ticketCounts)
      .filter(([_, count]) => count > 0)
      .map(([ticketId, count]) => {
        const ticket = tickets.find((t: any) => t.id === ticketId);
        return {
          id: ticketId,
          ticketName: ticket?.ticketName || "Ticket",
          ticketPrice: ticket?.ticketPrice || 0,
          quantity: count,
        };
      });

    const selectedTicketId = selectedTicketsData.length > 0 ? selectedTicketsData[0].id : undefined;

    dispatch(
      setBookingDraft({
        selectedDate,
        selectedSlotId,
        ticketCounts,
        selectedTicketId,
        selectedTicketsData,
        totalParticipantCount: participantCount,
        subtotal,
        code,
        acceptTerms,
        acceptPrivacy,
        acceptVlogTerms,
        eventId: eventId || undefined,
      }),
    );
  }, [
    acceptPrivacy,
    acceptTerms,
    acceptVlogTerms,
    code,
    dispatch,
    ticketCounts,
    participantCount,
    subtotal,
    selectedDate,
    selectedSlotId,
    tickets,
    eventId,
  ]);

  const discount = discountPercentage / 100;

  const totalPrice = useMemo(() => {
    const discountAmount = subtotal * discount;
    const netAmount = subtotal - discountAmount;
    return netAmount;
  }, [discount, subtotal]);

  const formattedTotalPrice = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: totalPrice % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(totalPrice);
  }, [totalPrice]);

  const formattedDiscountAmount = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: subtotal % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(subtotal * discount);
  }, [discount, subtotal]);

  const hasEarlyBirdTickets = participantCount > 0;
  const hasVlogTickets = Object.entries(ticketCounts).some(([ticketId, count]) => {
    const ticket = tickets.find((t: any) => t.id === ticketId);
    return count > 0 && (ticket?.ticketName.toLowerCase().includes("vlog") || ticket?.ticketName.toLowerCase().includes("disc"));
  });
  const requiresVlogTerms = hasVlogTickets;
  const requiresBaseTerms = participantCount > 0 && !hasVlogTickets;
  const canContinue =
    participantCount > 0 &&
    (!requiresBaseTerms || (acceptTerms && acceptPrivacy)) &&
    (!requiresVlogTerms || acceptVlogTerms);
  const checkboxClassName =
    "mt-2 h-6 w-6 min-h-6 min-w-6 shrink-0 rounded-[5px] border-[#2e323d] text-black focus:ring-black";

  useEffect(() => {
    if (!hasVlogTickets && acceptVlogTerms) {
      setAcceptVlogTerms(false);
    }
  }, [acceptVlogTerms, hasVlogTickets]);

  return (
    <div className="">
      <div className="mx-auto  space-y-12 text-[#202330]">
        <section>
          <h2 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[32px]">
            Ticket
          </h2>

          <div className="mt-6 space-y-4">
            {isLoadingTickets ? (
              <>
                {[1, 2].map((i) => (
                  <div key={i} className="grid items-center gap-4 md:grid-cols-[1fr_180px] animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-2/3 md:w-3/4"></div>
                    <div className="h-14 bg-gray-200 rounded w-full border border-[#2e323d]/20"></div>
                  </div>
                ))}
              </>
            ) : (
              tickets.map((ticket: any) => (
                <div key={ticket.id} className="grid items-center gap-4 md:grid-cols-[1fr_180px]">
                  <p className="text-xl font-medium text-[#737a86] md:text-[28px]">
                    {ticket.ticketName}
                  </p>
                  <select
                    value={ticketCounts[ticket.id] || ""}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value, 10) : 0;
                      setTicketCounts((prev) => {
                        if (val > 0) {
                          return { [ticket.id]: val };
                        }
                        return { ...prev, [ticket.id]: 0 };
                      });
                    }}
                    className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none"
                  >
                    <option value="" className="text-[#8f95a2]">
                      Number
                    </option>
                    {ticketCountOptions.map((count) => (
                      <option key={`${ticket.id}-${count}`} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[32px]">
            Booking
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10">
            <div>
              <p className="mb-3 text-[20px] font-medium text-[#737a86] md:text-[30px]">
                Desired date
              </p>

              <div className="space-y-3">
                {isLoadingSlots ? (
                  <>
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  dateOptions.map((date) => (
                    <label
                      key={date.value}
                      className="flex cursor-pointer items-center gap-3 text-[18px] text-[#49505c]"
                    >
                      <input
                        type="radio"
                        name="date"
                        checked={selectedDate === date.value}
                        onChange={() => setSelectedDate(date.value)}
                        className="h-5 w-5 border-[#2e323d] text-black focus:ring-black"
                      />
                      <span>{date.label}</span>
                    </label>
                  ))
                )}

                {!isLoadingSlots && dateOptions.length === 0 && (
                  <p className="text-[15px] text-[#7a7a7a]">
                    No available dates found.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[20px] font-medium text-[#737a86] md:text-[30px]">
                Desired Time Slot
              </p>

              <div className="space-y-3">
                {isLoadingSlots ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0"></div>
                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  timeSlotOptions.map((slot) => (
                    <label
                      key={slot.id}
                      className="flex cursor-pointer items-start gap-3 text-[16px] leading-6 text-[#49505c] md:text-[18px] md:leading-7"
                    >
                      <input
                        type="radio"
                        name="slot"
                        checked={selectedSlotId === slot.id}
                        onChange={() => {
                          setSelectedSlotId(slot.id);
                        }}
                        className="h-5 w-5 border-[#2e323d] text-black focus:ring-black"
                      />
                      <span className="break-words">
                        {dateLabelMap.get(slot.date) ?? slot.date} - {slot.label}
                      </span>
                    </label>
                  ))
                )}

                {!isLoadingSlots && timeSlotOptions.length === 0 && (
                  <p className="text-[15px] text-[#7a7a7a]">
                    No available time slots found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[32px]">
            Discount Code
          </h2>

          <div className="mt-5 border border-[#2e323d]">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder=""
              className="h-14 w-full bg-transparent px-4 text-lg text-[#2f3340] outline-none"
            />
          </div>

          {discountPercentage > 0 && (
            <p className="mt-3 text-sm font-medium text-green-600 md:text-base">
              -{formattedDiscountAmount}€ Discount ({discountPercentage}%)
            </p>
          )}
        </section>

        <section>
          <h2 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[32px]">
            Confirmation
          </h2>

          <div className="mt-5 space-y-4 text-[20px] leading-8 text-[#555c69] md:text-[28px] md:leading-[1.45]">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className={checkboxClassName}
              />
              <span>
                I have read and accept the terms and conditions of this{" "}
                <span className="underline underline-offset-4">booking</span>*.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className={checkboxClassName}
              />
              <span>I have read and agree to the privacy policy.</span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={acceptVlogTerms}
                onChange={(e) => setAcceptVlogTerms(e.target.checked)}
                className={checkboxClassName}
              />
              <span>
                I want to film a vlog and receive a 15% discount*{" "}
                <span className="underline underline-offset-4">
                  Terms and conditions
                </span>
                {requiresVlogTerms ? " (required for vlog tickets)" : ""}.
              </span>
            </label>
          </div>
        </section>

        <section className="pt-3 text-center">
          <p className="text-[32px] font-black uppercase tracking-[0.02em] text-black md:text-[40px]">
            Total Price: <span>€{formattedTotalPrice}</span>
            {/* <span className="ml-3 text-[17px] font-normal normal-case text-[#7e8592] md:text-[26px]">
              Incl. 19% VAT.
            </span> */}
          </p>

          <button
            type="button"
            onClick={() => {
              if (!canContinue) {
                return;
              }

              onContinue?.({ participantCount });
              router.push("/event/billing");
            }}
            disabled={!canContinue}
            className="mt-10 h-16 w-full rounded-full bg-black text-2xl font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </section>
      </div>
    </div>
  );
}
