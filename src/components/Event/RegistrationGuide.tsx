export default function RegistrationGuide() {
  return (
    <div className="text-lg ">
      {" "}
      <div className="mb-8 md:mb-10">
        <p className="text-4xl leading-[0.6] md:text-[104px]  font-rosmerta text-title">
          Registration
        </p>
        <h1 className="font-butler text-xl uppercase md:text-[40px] text-title font-blod ml-10 mt-2">
          How to Registration
        </h1>
      </div>
      <div>
        <p>
          To register, please fill out the <b>form completely</b> and then
          submit it.
        </p>
        <p>
          Completing and submitting the form constitutes a{" "}
          <b>binding registration</b> , which is{" "}
          <b> valid even without a signature</b>. By registering, you agree to
          the booking conditions below.
        </p>{" "}
        <br />
        <p>
          The form must be filled out for <b>each participating person</b>.
          Therefore, if there are two people, please fill it out twice.
        </p>{" "}
        <br />
        <p>
          After submitting the form, you will receive a{" "}
          <b>binding booking confirmation</b> and invoice within a few days. The
          spot is reserved for 7 days and only be booked after payment has been
          received. (If payment is not received within 7 days, the spot will be
          released, and you may have to switch to a different spot).
        </p>
      </div>
      <div className="space-y-5 mt-6">
        <p className="font-semibold uppercase tracking-[0.08em] text-title text-2xl]">
          Important:
        </p>
        <p>
          Please check which time slots are currently available{" "}
          <b> before booking</b>. We try to regularly update the number of
          available places in this overview, but please get <b>confirmation</b>
          {""} from us beforehand, otherwise we cannot guarantee you a place in
          your desired time slot.
        </p>
      </div>
      {/* <div>
        <p className="font-semibold uppercase tracking-[0.08em] text-[#111111]">
          Price:
        </p>
        <p>
          Early Bird Price: Only <b>€359 </b> incl. VAT
        </p>
       
        <p>
          15% discount if you film a vlog* → <b>€305.15</b> (with Early Bird)
        </p>
      </div> */}
    </div>
  );
}
