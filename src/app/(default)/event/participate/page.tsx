"use client";

import BookingPageShell from "@/components/Event/BookingPageShell";
import Conditions from "@/components/Event/Conditions";
import Participant from "@/components/Event/Participant";
import { useAppSelector } from "@/redux/hooks";

export default function ParticipatePage() {
  const bookingDraft = useAppSelector((state) => state.booking);
  const participantCount = bookingDraft.totalParticipantCount || 0;

  return (
    <BookingPageShell>
      <Participant participantCount={participantCount} onContinue={() => {}} />
      {/* <Conditions /> */}
    </BookingPageShell>
  );
}
