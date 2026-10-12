"use client";
import { useGetTicketDetailsQuery } from "@/redux/api/bookingApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import Navigation from "../shared/Navigation";

export default function TicketDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ticketId = params?.id;
  const fromQR = searchParams?.get("from") === "qr";

  const { data: myTicketDetails, isLoading } = useGetTicketDetailsQuery(
    ticketId ?? skipToken,
  );

  const booking = myTicketDetails?.result;
  const qrRef = useRef<HTMLDivElement | null>(null);

  const qrValue = booking
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/ticket-information?browserId=${booking.browserId}&userId=${booking.userId}&ticketId=${booking.id}&from=qr`
    : "";

  const downloadQrPdf = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const svgEl = qrRef.current?.querySelector("svg") as SVGElement | null;
      if (!svgEl) return;

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgEl);
      const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const sizeAttr =
          svgEl.getAttribute("width") || svgEl.getAttribute("height") || "200";
        const size = parseInt(sizeAttr, 10) || 200;
        const ratio = 4;
        const canvas = document.createElement("canvas");
        canvas.width = size * ratio;
        canvas.height = size * ratio;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.drawImage(img, 0, 0, size, size);

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const qrSize = 120;
        const x = (pageWidth - qrSize) / 2;
        const y = (pageHeight - qrSize) / 2;

        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          x,
          y,
          qrSize,
          qrSize,
        );
        pdf.save(`${booking?.id || "qr"}-qrcode.pdf`);
      };

      img.onerror = () => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const qrSize = 120;
        const x = (pageWidth - qrSize) / 2;
        const y = (pageHeight - qrSize) / 2;
        const fallbackImage = new Image();
        fallbackImage.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 800;
          canvas.height = 800;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(fallbackImage, 0, 0, 800, 800);
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            x,
            y,
            qrSize,
            qrSize,
          );
          pdf.save(`${booking?.id || "qr"}-qrcode.pdf`);
        };

        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        fallbackImage.src = URL.createObjectURL(blob);
      };

      img.src = svgData;
    } catch (err) {
      console.error("QR download failed", err);
    }
  };

  return (
    <section className="min-h-screen bg-secondary px-4 py-8 md:px-10 md:py-12 relative">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-center font-mango text-[52px] text-title md:text-[110px]">
          Ticket Details
        </h1>

        {isLoading ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center">
            Loading ticket...
          </div>
        ) : !booking ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center">
            Ticket not found.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8 items-start">
            <div className="md:col-span-3 rounded-xl bg-[#f7f7f8] p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                    Booking For
                  </p>
                  <h2 className="mt-2 font-mango text-4xl md:text-5xl text-title font-bold">
                    {booking.fullName || booking.companyName}
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-4 text-base text-[#6b7280]">
                    <div>
                      <span className="font-semibold text-[#111827]">
                        Order ID:
                      </span>{" "}
                      {booking.id}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">
                        Email:
                      </span>{" "}
                      {booking.email}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">
                        Phone:
                      </span>{" "}
                      {booking.phoneNumber}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">
                        Address:
                      </span>{" "}
                      {booking.street}, {booking.city} {booking.postalCode}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">
                        Payment:
                      </span>{" "}
                      {booking.paymentGateway}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">
                        Status:
                      </span>{" "}
                      {booking.status}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end">
                  {!fromQR && (
                    <>
                      <div
                        ref={qrRef}
                        className="inline-block bg-white p-3 shadow-sm"
                      >
                        <QRCodeSVG
                          value={qrValue}
                          size={200}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                      <a
                        href="#"
                        onClick={downloadQrPdf}
                        className="mt-4 inline-flex items-center gap-2 text-base text-[#7b8190] underline underline-offset-2 hover:text-primary"
                      >
                        <Download className="h-4 w-4" /> Download QR PDF
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-2xl text-title">
                  Event Slot
                </h3>
                {booking.slot ? (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.06em] text-[#8892a3] font-semibold">
                        Date
                      </p>
                      <p className="mt-2 text-2xl font-bold text-title">
                        {new Date(booking.slot.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        )}
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
                ) : null}
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-2xl text-title">
                  Participants
                </h3>
                <ul className="mt-4 space-y-3 text-base text-[#374151]">
                  {booking.participants?.length ? (
                    booking.participants.map((p: any, idx: number) => (
                      <li
                        key={idx}
                        className="flex justify-between items-start gap-4"
                      >
                        <span className="font-medium">{p.fullName}</span>
                        <span className="text-[#6b7280] text-sm text-right">
                          {p.email} • {p.phoneNumber}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-base text-[#6b7280]">
                      No participants listed.
                    </li>
                  )}
                </ul>

                <div className="mt-6">
                  <h3 className="font-semibold text-2xl text-title">Notes</h3>
                  <p className="mt-3 text-base text-[#374151] leading-relaxed">
                    {booking.notes || "-"}
                  </p>
                </div>
              </div>
            </div>

            <aside className="absolute top-96 right-32 md:top-[45%] md:right-72">
              <Navigation />
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
