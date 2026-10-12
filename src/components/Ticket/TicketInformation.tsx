"use client";
import { useGetTicketDetailsQuery } from "@/redux/api/bookingApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function TicketInformation() {
  const searchParams = useSearchParams();
  const ticketId = searchParams?.get("ticketId");

  const { data: myTicketDetails, isLoading } = useGetTicketDetailsQuery(
    ticketId ?? skipToken,
  );

  const booking = myTicketDetails?.result;

//   const handleDownload = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (typeof window !== "undefined") window.print();
//   };

  return (
    <section className="relative min-h-screen bg-secondary px-4 py-6 md:px-10 md:py-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="text-center font-mango text-[42px] leading-none text-title md:text-left md:text-[72px]">
            Ticket Details
          </h1>

          {/* <a
            href="#"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 self-end rounded-full border border-[#d7dbe4] bg-white px-4 py-2 text-sm font-medium text-[#5f6677] shadow-sm transition hover:-translate-y-0.5 hover:border-[#c7ccda] hover:text-primary"
          >
            <Download className="h-4 w-4" /> Download Ticket
          </a> */}
        </div>

        <div className="mt-5">
          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm md:p-8">
            {/* vertical shimmer overlay while loading */}
            {isLoading && (
              <div className="absolute inset-0 z-50 pointer-events-none">
                <div className="absolute inset-0 bg-white/80" />
                <div className="absolute inset-0 flex items-start justify-center">
                  <div className="shimmer-vertical w-full h-full" />
                </div>
              </div>
            )}

            <div
              className={`grid gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:items-start ${isLoading ? "opacity-60" : "opacity-100"} transition-opacity`}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                  Booking For
                </p>
                <h2 className="mt-2 break-words font-mango text-3xl font-bold text-title md:text-4xl lg:text-5xl">
                  {booking?.fullName ||
                    booking?.companyName ||
                    (isLoading ? "Loading name..." : "—")}
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-3 text-base text-[#6b7280] sm:grid-cols-2">
                  <div className="rounded-2xl bg-secondary/40 p-3 md:p-4">
                    <span className="font-semibold text-[#111827]">
                      Order ID:
                    </span>{" "}
                    <span className="break-all">
                      {booking?.id ?? (isLoading ? "..." : "-")}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3 md:p-4">
                    <span className="font-semibold text-[#111827]">Email:</span>{" "}
                    <span className="break-words">
                      {booking?.email ?? (isLoading ? "..." : "-")}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3 md:p-4">
                    <span className="font-semibold text-[#111827]">Phone:</span>{" "}
                    <span className="break-words">
                      {booking?.phoneNumber ?? (isLoading ? "..." : "-")}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3 md:p-4 sm:col-span-2">
                    <span className="font-semibold text-[#111827]">
                      Address:
                    </span>{" "}
                    <span className="break-words">
                      {booking
                        ? `${booking.street}, ${booking.city} ${booking.postalCode}`
                        : isLoading
                          ? "..."
                          : "-"}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3 md:p-4">
                    <span className="font-semibold text-[#111827]">
                      Payment:
                    </span>{" "}
                    <span className="break-words">
                      {booking?.paymentGateway ?? (isLoading ? "..." : "-")}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-3 md:p-4">
                    <span className="font-semibold text-[#111827]">
                      Status:
                    </span>{" "}
                    <span
                      className={`inline-block ${booking?.status === "Completed" ? "text-green-600" : "text-[#374151]"}`}
                    >
                      {booking?.status ?? (isLoading ? "..." : "-")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end" />
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-2xl text-title">Event Slot</h3>
              {booking?.slot ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                      Date
                    </p>
                    <p className="mt-2 text-2xl font-bold text-title">
                      {new Date(booking.slot.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                      Time
                    </p>
                    <p className="mt-2 text-2xl font-bold text-title">
                      {booking.slot.startTime} - {booking.slot.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                      Quantity
                    </p>
                    <p className="mt-2 text-2xl font-bold text-title">
                      {booking.quantity} Tickets
                    </p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-8 bg-gray-100 rounded animate-pulse" />
                  <div className="h-8 bg-gray-100 rounded animate-pulse" />
                  <div className="h-8 bg-gray-100 rounded animate-pulse" />
                </div>
              ) : null}
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-2xl text-title">
                Participants
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {booking?.participants?.length ? (
                  booking.participants.map((p: any, idx: number) => (
                    <li
                      key={idx}
                      className="rounded-2xl border border-[#eceef3] bg-secondary/40 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <span className="block text-sm uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                            Participant
                          </span>
                          <span className="mt-1 block break-words font-medium text-[#111827]">
                            {p.fullName}
                          </span>
                        </div>

                        <div className="min-w-0 text-sm text-[#6b7280] sm:text-right">
                          <div className="break-words">{p.email}</div>
                          <div className="break-words">{p.phoneNumber}</div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : isLoading ? (
                  <>
                    <li className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
                    <li className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
                  </>
                ) : (
                  <li className="rounded-2xl border border-dashed border-[#d7dbe4] p-4 text-base text-[#6b7280]">
                    No participants listed.
                  </li>
                )}
              </ul>

              <div className="mt-6">
                <h3 className="font-semibold text-2xl text-title">Notes</h3>
                <p className="mt-3 text-base text-[#374151] leading-relaxed">
                  {booking?.notes ?? (isLoading ? "..." : "-")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shimmer-vertical {
          position: absolute;
          top: -120%;
          left: 0;
          right: 0;
          height: 120%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmerY 1.2s infinite linear;
        }

        @keyframes shimmerY {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </section>
  );
}
