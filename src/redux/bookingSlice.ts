import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BookingParticipant = {
  fullName: string;
  email: string;
  phoneNumber: string;
  note: string;
};

export type BookingBilling = {
  companyName: string;
  fullName: string;
  telephoneNumber: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
};

export type SelectedTicketData = {
  id: string;
  ticketName: string;
  ticketPrice: number;
  quantity: number;
};

export type BookingDraftState = {
  browserId: string;
  selectedDate: string;
  selectedSlotId: string;
  ticketCounts: Record<string, number>;
  selectedTicketId?: string;
  selectedTicketsData: SelectedTicketData[];
  totalParticipantCount: number;
  subtotal: number;
  code: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptVlogTerms: boolean;
  isVideographer: boolean;
  billing: BookingBilling;
  participants: BookingParticipant[];
  paymentGateway: "BankTransfer" | "Klarna" | "Paypal";
  eventId?: string;
};

export const emptyParticipant: BookingParticipant = {
  fullName: "",
  email: "",
  phoneNumber: "",
  note: "",
};

const initialState: BookingDraftState = {
  browserId: "",
  selectedDate: "",
  selectedSlotId: "",
  ticketCounts: {},
  selectedTicketId: undefined,
  selectedTicketsData: [],
  totalParticipantCount: 0,
  subtotal: 0,
  code: "",
  acceptTerms: false,
  acceptPrivacy: false,
  acceptVlogTerms: false,
  isVideographer: false,
  billing: {
    companyName: "",
    fullName: "",
    telephoneNumber: "",
    email: "",
    street: "",
    postalCode: "",
    city: "",
  },
  participants: [],
  paymentGateway: "BankTransfer",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingDraft: (
      state,
      action: PayloadAction<Partial<BookingDraftState>>,
    ) => {
      Object.assign(state, action.payload);
    },
    setBookingParticipants: (
      state,
      action: PayloadAction<BookingParticipant[]>,
    ) => {
      state.participants = action.payload;
    },
    resetBookingDraft: () => initialState,
  },
});

export const { setBookingDraft, setBookingParticipants, resetBookingDraft } =
  bookingSlice.actions;

export default bookingSlice.reducer;
