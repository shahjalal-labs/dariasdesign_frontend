import { tickets } from "@/lib/tickets";
import Link from "next/link";
import Navigation from "../shared/Navigation";

export default function Ticket() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 md:px-10 md:py-10">
      <div className="mx-auto container relative">
        <h2 className="text-center font-mango text-[80px] text-title md:text-[110px]">
          My Tickets
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:mt-10 mr-28 p-5">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-3xl bg-secondary p-4 shadow-[0_8px_20px_rgba(0,0,0,0.08)] "
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="max-w-[170px] text-lg leading-5 text-title md:text-2xl">
                  {ticket.title}
                </h3>
                <span className="text-[10px] text-title">QR</span>
              </div>

              <p className="mt-2 text-sm md:text-base uppercase tracking-[0.08em] text-[#9aa1ac] ">
                {ticket.dateLabel}
              </p>

              <p className="mt-4 text-sm md:text-base font-semibold text-text ">
                {ticket.holder}
              </p>

              <Link
                href={`/ticket/${ticket.id}`}
                className="mt-5 block w-full rounded-full bg-primary py-2 text-center md:py-3 text-white hover:bg-primary/80 text-base font-normal transition-colors"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>

        <div className="absolute top-96 md:top-2/4 right-28  md:right-12 ">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
