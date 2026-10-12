"use client";

import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import Billing from "./Billing";
import Booking from "./Booking";
import Checkout from "./Checkout";
// import Conditions from "./Conditions";
import Participant from "./Participant";
// import RegistrationGuide from "./RegistrationGuide";

export default function Registration() {
  const [showBilling, setShowBilling] = useState(false);
  const [showParticipant, setShowParticipant] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const bookingDraft = useAppSelector((state) => state.booking);
  const participantCount = bookingDraft.totalParticipantCount || 0;

  return (
    <div>
      <div className="mx-auto md:w-[1000px] bg-secondary p-4 md:p-16 py-10 md:py-16 space-y-6">
        <div className="">
          {/* <RegistrationGuide /> */}
          <div className="space-y-5 text-lg leading-6 text-[#7a7a7a] md:text-xl md:leading-7">
            <div>
              {showCheckout ? (
                <Checkout
                  participantCount={participantCount}
                  onPayNow={() => {
                    // Handle payment flow
                  }}
                />
              ) : showParticipant ? (
                <Participant
                  participantCount={participantCount}
                  onContinue={() => setShowCheckout(true)}
                />
              ) : showBilling ? (
                <Billing onContinue={() => setShowParticipant(true)} />
              ) : (
                <Booking
                  onContinue={() => {
                    setShowBilling(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div>{/* <Conditions /> */}</div>
    </div>
  );
}
