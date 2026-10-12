import BookingPageShell from "@/components/Event/BookingPageShell";
import Checkout from "@/components/Event/Checkout";
import Conditions from "@/components/Event/Conditions";

export default function CheckOutPage() {
  return (
    <BookingPageShell>
      <Checkout />
      {/* <Conditions /> */}
    </BookingPageShell>
  );
}
