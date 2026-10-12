import Billing from "@/components/Event/Billing";
import BookingPageShell from "@/components/Event/BookingPageShell";
// import BookingPageShell from "@/components/Event/BookingPageShell";

export default function BillingPage() {
  return (
    <BookingPageShell>
      <Billing />
      {/* <Conditions /> */}
    </BookingPageShell>
  );
}
