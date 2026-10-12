import type { ReactNode } from "react";

type BookingPageShellProps = {
  children: ReactNode;
};

export default function BookingPageShell({ children }: BookingPageShellProps) {
  return (
    <main className="min-h-screen bg-[#F6F2E7] px-4 py-6 md:px-10 md:py-10">
      <div className="mx-auto w-full max-w-[1000px] overflow-hidden bg-[#F6F2E7]">
        <div className="bg-black px-4 py-4 text-center md:px-6 md:py-5">
          <p className="text-[22px] font-black uppercase tracking-[0.25em] text-white md:text-[34px]">
            Content Day Ticket
          </p>
        </div>

        <div className="bg-[#F6F2E7]">{children}</div>
      </div>
    </main>
  );
}
