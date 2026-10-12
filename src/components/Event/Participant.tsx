"use client";

import {
  emptyParticipant,
  setBookingDraft,
  type BookingParticipant,
} from "@/redux/bookingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ParticipantProps = {
  participantCount: number;
  onContinue?: () => void;
};

export default function Participant({
  participantCount,
  onContinue,
}: ParticipantProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const savedBilling = useAppSelector((state) => state.booking.billing);
  const savedParticipants = useAppSelector(
    (state) => state.booking.participants,
  );
  const resolvedCount = participantCount;
  const [sameAsInvoiceIssuer, setSameAsInvoiceIssuer] = useState(false);
  const [participants, setParticipants] = useState<BookingParticipant[]>(() => {
    return Array.from({ length: resolvedCount }, (_, index) => {
      return savedParticipants[index] ?? emptyParticipant;
    });
  });

  const syncFirstParticipantFromBilling = () => {
    setParticipants((currentParticipants) => {
      if (!currentParticipants.length) {
        return currentParticipants;
      }

      const nextParticipants = [...currentParticipants];
      const existingNote = nextParticipants[0]?.note ?? emptyParticipant.note;

      nextParticipants[0] = {
        fullName: savedBilling.fullName,
        email: savedBilling.email,
        phoneNumber: savedBilling.telephoneNumber,
        note: existingNote,
      };

      return nextParticipants;
    });
  };

  useEffect(() => {
    setParticipants((currentParticipants) => {
      return Array.from({ length: resolvedCount }, (_, index) => {
        return currentParticipants[index] ?? emptyParticipant;
      });
    });
  }, [resolvedCount]);

  useEffect(() => {
    if (!sameAsInvoiceIssuer) {
      return;
    }

    syncFirstParticipantFromBilling();
  }, [sameAsInvoiceIssuer, savedBilling]);

  useEffect(() => {
    if (JSON.stringify(participants) === JSON.stringify(savedParticipants)) {
      return;
    }

    dispatch(setBookingDraft({ participants }));
  }, [dispatch, participants, savedParticipants]);

  const updateParticipant = (
    index: number,
    field: keyof BookingParticipant,
    value: string,
  ) => {
    setParticipants((currentParticipants) => {
      const nextParticipants = [...currentParticipants];
      nextParticipants[index] = {
        ...nextParticipants[index],
        [field]: value,
      };
      return nextParticipants;
    });
  };

  return (
    <section className=" mx-auto md:w-[1000px] bg-secondary   p-4 md:p-16 py-10 md:px-16 md:py-10 ">
      <div className="  text-[#202330]">
        {Array.from({ length: resolvedCount }, (_, index) => {
          const participantNumber = index + 1;
          const currentParticipant = participants[index] ?? emptyParticipant;

          return (
            <div key={participantNumber} className="space-y-5 mb-5">
              <h2 className="text-[22px] font-black uppercase tracking-[0.03em] text-black md:text-[32px]">
                Participate {participantNumber}
              </h2>

              {participantNumber === 1 && (
                <label className="flex cursor-pointer items-center gap-3 text-[16px] text-[#555c69] md:text-[18px]">
                  <input
                    type="checkbox"
                    checked={sameAsInvoiceIssuer}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setSameAsInvoiceIssuer(checked);

                      if (checked) {
                        syncFirstParticipantFromBilling();
                      }
                    }}
                    className="h-6 w-6 rounded-[5px] border-[#2e323d] text-black focus:ring-black"
                  />
                  <span>Same as invoice issuer</span>
                </label>
              )}

              <div className="space-y-5 ">
                <label className="space-y-2 block">
                  <span className="block text-[18px] font-medium text-black">
                    Full Name *
                  </span>
                  <input
                    type="text"
                    value={currentParticipant.fullName}
                    disabled={participantNumber === 1 && sameAsInvoiceIssuer}
                    onChange={(event) =>
                      updateParticipant(index, "fullName", event.target.value)
                    }
                    className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                  />
                </label>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-5">
                  <label className="space-y-2 block">
                    <span className="block text-[18px] font-medium text-black">
                      E-mail address *
                    </span>
                    <input
                      type="email"
                      value={currentParticipant.email}
                      disabled={participantNumber === 1 && sameAsInvoiceIssuer}
                      onChange={(event) =>
                        updateParticipant(index, "email", event.target.value)
                      }
                      className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                    />
                  </label>

                  <label className="space-y-2 block">
                    <span className="block text-[18px] font-medium text-black">
                      Phone Number *
                    </span>
                    <input
                      type="tel"
                      value={currentParticipant.phoneNumber}
                      disabled={participantNumber === 1 && sameAsInvoiceIssuer}
                      onChange={(event) =>
                        updateParticipant(
                          index,
                          "phoneNumber",
                          event.target.value,
                        )
                      }
                      className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] outline-none disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
                    />
                  </label>
                </div>

                <label className="space-y-2 block">
                  <span className="block text-[20px]  font-normal tracking-[0.03em] text-black">
                    Note 
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. desired team members"
                    value={currentParticipant.note}
                    onChange={(event) =>
                      updateParticipant(index, "note", event.target.value)
                    }
                    className="h-14 w-full border border-[#2e323d] bg-transparent px-4 text-lg text-[#2f3340] placeholder:text-[#8c93a0] outline-none"
                  />
                </label>
              </div>
            </div>
          );
        })}

        <div className="flex justify-center pt-2 px-4 mt-9">
          <button
            type="button"
            onClick={() => {
              onContinue?.();
              router.push("/event/checkout");
            }}
            className="h-16 w-full max-w-[700px] rounded-full bg-black text-2xl font-medium text-white transition hover:opacity-90"
          >
            Checkout
          </button>
        </div>
      </div>
    </section>
  );
}
