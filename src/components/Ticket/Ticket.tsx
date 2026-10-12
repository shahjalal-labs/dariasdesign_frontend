"use client";
import { useMyTicketsQuery } from "@/redux/api/bookingApi";
import { skipToken } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import Navigation from "../shared/Navigation";

type BookingTicket = {
  id: string;
  browserId?: string | null;
  userId?: string | null;
  fullName?: string | null;
  companyName?: string | null;
  paymentGateway?: string | null;
  createdAt: string;
  email?: string | null;
  status?: string | null;
};

export default function Ticket() {
  const browserId = localStorage.getItem("browserId"); // Replace with actual browser ID retrieval logic
  const token = Cookies.get("token"); // Replace with actual token retrieval logic
  let userId: string | undefined = undefined;
  // decode token
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded JWT Payload:", payload);
    userId = payload.id;
  }
  const hasBrowserId = Boolean(browserId);
  const hasUserId = Boolean(userId);
  const hasAnyIdentifier = hasBrowserId || hasUserId;

  const { data: myTicketsData, isLoading } = useMyTicketsQuery(
    hasAnyIdentifier
      ? {
          ...(hasBrowserId ? { browserId } : {}),
          ...(hasUserId ? { userId } : {}),
        }
      : skipToken,
  );

  if (!hasAnyIdentifier) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-10 md:py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            No browser ID or user ID found.
          </p>
        </div>
      </div>
    );
  }

  const tickets: BookingTicket[] = myTicketsData?.result ?? [];

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-10 md:py-10 relative">
      <div className="mx-auto container ">
        <h2 className="text-center font-mango text-[80px] text-title md:text-[110px]">
          My Tickets
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3 mr-28 p-5">
          {isLoading ? (
            <div className="rounded-3xl bg-secondary p-6 text-center text-text shadow-[0_8px_20px_rgba(0,0,0,0.08)] md:col-span-2 lg:col-span-3">
              Loading your tickets...
            </div>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-3xl bg-secondary p-4 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="max-w-[170px] text-lg leading-5 text-title md:text-2xl">
                      {ticket.fullName || ticket.companyName || "My Ticket"}
                    </h3>
                    <p className="mt-1 text-sm uppercase tracking-[0.08em] text-[#9aa1ac]">
                      {ticket.paymentGateway}
                    </p>
                  </div>
                  <div className="rounded bg-white p-1 shadow-sm">
                    <QRCodeSVG
                      value={`${ticket.id}|${ticket.browserId ?? ""}|${ticket.userId ?? ""}`}
                      size={28}
                      level="M"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>

                <p className="mt-2 text-sm md:text-base uppercase tracking-[0.08em] text-[#9aa1ac]">
                  {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                <p className="mt-4 text-sm md:text-base font-semibold text-text">
                  {ticket.email}
                </p>

                <p className="mt-2 text-sm text-text/80">
                  Status: {ticket.status}
                </p>

                <Link
                  href={`/ticket/${ticket.id}`}
                  className="mt-5 block w-full rounded-full bg-black py-2 text-center text-base font-normal text-white transition-colors md:py-3"
                >
                  View Details
                </Link>
              </article>
            ))
          ) : (
            <div className="rounded-3xl bg-secondary p-6 text-center text-text shadow-[0_8px_20px_rgba(0,0,0,0.08)] md:col-span-2 lg:col-span-3">
              No tickets found for this browser and user.
            </div>
          )}
        </div>

        <div className="absolute top-96 md:top-[370px] right-20  md:right-72 ">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
