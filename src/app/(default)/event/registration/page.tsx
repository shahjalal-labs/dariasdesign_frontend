import Booking from "@/components/Event/Booking";
import BookingPageShell from "@/components/Event/BookingPageShell";

// import Conditions from "@/components/Event/Conditions";
// import RegistrationGuide from "@/components/Event/RegistrationGuide";

export default function RegistrationPage() {
  return (
    <BookingPageShell>
      <div className="bg-secondary px-4 py-10 md:px-16 md:py-16">
        {/* <RegistrationGuide /> */}
        <Booking />
      </div>

      {/* <Conditions /> */}
    </BookingPageShell>
  );
}
