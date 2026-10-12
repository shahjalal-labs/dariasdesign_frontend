"use client";

import contact from "@/assets/contact.png";
import Image from "next/image";
import { useRef, useState } from "react";
import Navigation from "../shared/Navigation";
import { useContactMutation } from "@/redux/api/contactApi";
import { PlusIcon } from "lucide-react";

type ContactFormData = {
  firstName: string;
  lastName: string;
  location: string;
  date: string;
  phoneNumber: string;
  email: string;
  budget: string;
  news: string;
  privacyAccepted: boolean;
};

const initialFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  location: "",
  date: "",
  phoneNumber: "",
  email: "",
  budget: "",
  news: "",
  privacyAccepted: false,
};

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const [sendContactDataFn, { isLoading }] = useContactMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileInputKey((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.privacyAccepted) {
      setIsSuccessMessage(false);
      setSubmissionMessage("Please accept the privacy policy before submitting.");
      return;
    }

    const bodyData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      location: formData.location,
      date: formData.date,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      budget: formData.budget,
      news: formData.news,
    };

    const payload = new FormData();
    payload.append("bodyData", JSON.stringify(bodyData));

    if (selectedFile) {
      payload.append("file", selectedFile);
    }

    try {
      const response = await sendContactDataFn(payload).unwrap();
      if (response?.success) {
        setIsSuccessMessage(true);
        setSubmissionMessage(
          response?.result?.message ||
            response?.message ||
            "Contact message submitted successfully.",
        );
        setFormData(initialFormData);
        setSelectedFile(null);
        setFileInputKey((prev) => prev + 1);
      } else {
        setIsSuccessMessage(false);
        setSubmissionMessage(
          response?.message || "Failed to submit contact message.",
        );
      }
    } catch (error: any) {
      setIsSuccessMessage(false);
      setSubmissionMessage(
        error?.data?.message || "Failed to submit contact message.",
      );
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-7 md:py-12 ">
      <Navigation />
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center md:mb-12">
          <h1 className="text-[40px] md:text-[56px]  font-light mb-4 font-mango">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 ">
          <div className="space-y-8 order-2 lg:order-1 px-4">
            <div className="space-y-4">
              <h3 className="text-5xl text-pink font-normal font-mango px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-200 inline-block">
                We can&apos;t wait.
              </h3>
              <p className="text-text text-base md:text-lg leading-relaxed">
                Looking for an event rental company in North Rhine-Westphalia?
                Then Who&apos;s Wedding is the perfect choice. We offer all the
                event equipment you could wish for, and we&apos;re constantly
                expanding our range of decorations. Whether you&apos;re looking
                for something classic or the very latest trends, get in touch!
                We look forward to seeing you! <br /> <br /> XO. 🖤
              </p>
            </div>

            {/* Brief Information List */}
            <div className="space-y-4">
              <h3 className="text-2xl text-pink font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-200 inline-block">
                Here is some brief information:
              </h3>
              <ul className="space-y-3 text-text text-base md:text-lg">
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    You can rent all the decorative items flexibly for your
                    wedding – without any minimum budget.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    For smaller rental orders up to €1,500, collection and
                    return are usually handled independently at our warehouse.
                    For larger orders, we also offer delivery, as well as
                    on-site setup and dismantling, upon request.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    If you would like a custom-designed decoration concept for
                    your wedding, we would be happy to assist you with the
                    design and implementation.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    You can rent all the decorative items flexibly for your
                    wedding – without any minimum budget.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    You will receive a free, rough cost estimate for every
                    inquiry. You will receive a free, rough cost estimate for
                    every inquiry.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    Of course, we are always available to answer your questions
                    via WhatsApp or email.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    In order to create the most suitable offer for you, an
                    approximate budget estimate helps us to better assess what
                    is realistically feasible for you.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="">•</span>
                  <span>
                    Feel free to send us your initial inspiration or images.
                    Simply use the upload button.
                  </span>
                </li>
              </ul>
            </div>

            <div className=" p-6 md:p-8 text-base md:text-lg">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name:"
                      className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name:"
                      className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Location and Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location:"
                      className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* WhatsApp and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="What’s App / Phone :"
                      className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-mail address :"
                      className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="pt-1">
                    <input
                      key={fileInputKey}
                      ref={fileInputRef}
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />

                    <button
                      type="button"
                      onClick={handleFileUploadClick}
                      className="inline-flex items-center gap-2 border border-black rounded-full px-4 h-11 text-xl md:text-[23px] font-normal font-mango text-text hover:bg-black/5 transition-colors"
                    >
                      <span className="text-xl leading-none">
                        <PlusIcon/>
                      </span>
                      <span>Upload file</span>
                    </button>

                    {selectedFile && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-text">
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          aria-label="Remove selected file"
                          className="w-6 h-6 rounded-full border border-black/50 flex items-center justify-center text-base leading-none hover:bg-black/10"
                        >
                          ×
                        </button>
                        <span className="truncate max-w-[240px]">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1">
                    {/* <label
                      htmlFor="budget"
                      className="block text-[23px] font-normal font-mango text-text leading-none mb-1"
                    >
                      Your budget estimate
                    </label> */}
                    <div className="relative border-b border-gray-300">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full appearance-none bg-transparent pr-8 pl-0 py-2 text-xl md:text-[23px] font-normal font-mango text-text focus:outline-none"
                        required
                      >
                        <option className="text-pink" value="">Your budget estimate</option>
                        <option className="text-pink" value="lt-1500">Up to €1,500 (pickup only)</option>
                        <option className="text-pink" value="1500-3000">€1,500 - €3,000</option>
                        <option className="text-pink" value="3000-4500">€3,000 - €4,500</option>
                        <option className="text-pink" value="4500-7000">€4,500 - €7,000</option>
                        <option className="text-pink" value="7000-10000">€7,000 - €10,000</option>
                        <option className="text-pink" value="10000-15000">€1₀,₀₀₀ - €15,₀₀₀</option>
                      </select>
                      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-lg text-black/80">
                        ⌄
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <textarea
                    name="news"
                    value={formData.news}
                    onChange={handleChange}
                    placeholder="News"
                    className="w-full px-2 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-primary min-h-24 resize-y"
                    required
                  />
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    required
                  />
                  <label className="text-base text-text md:text-xl">
                    I have read and understood the privacy policy. Data
                    protection
                  </label>
                </div>

                {submissionMessage && (
                  <p
                    className={`text-sm ${
                      isSuccessMessage ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {submissionMessage}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className=" bg-pink text-lg text-white px-16 py-2 rounded-full font-normal hover:bg-primary/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <Image
              src={contact}
              alt="Contact"
              className="inset-0 bg-black/60 h-[450px] md:h-[900px] objcect-contain w-full "
            />

            <div className="absolute bottom-[590px] left-0 w-full p-4 md:p-10 text-white">
              <h2 className="text-[40px] md:text-[100px] font-normal font-mango leading-[0.8] ">
                We are
                <br /> Wedding!
              </h2>
            </div>

            {/* Navigation moved to page root to use global fixed positioning */}

            <div className="mt-6 absolute bottom-64 left-80 font-mango text-2xl font-normal text-text hidden md:block">
              <p className="border-l border-text h-60 flex items-center pl-3">
                <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                  Event Rental Düsseldorf
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Description Section */}
        <div className="md:mt-16 px-4">
          <div className="space-y-4 text-text text-base md:text-lg">
            <p>
              Who&apos;s Wedding Event Equipment & Rentals offers unique
              services tailored to your individual needs, along with a wide
              range of decorative elements for an unforgettable wedding with
              that special something! Do you also want the perfect decorations
              for your wedding? Then you&apos;ve come to the right place! Fill
              out the form now and secure your private consultation with our
              team. Your perfect wedding begins the moment you choose our event
              rental service. Your expectations for your dream wedding, wedding
              decorations, and event rentals are our motivation! With every new
              wedding concept, we demonstrate our passion, our expertise, and
              draw upon our experience. Our event equipment is so extensive that
              we can bring all your ideas to life. From glass vases and neon
              signs to trendy backdrops and XXL illuminated letters, our event
              equipment ensures the optimal realization of every decoration
              concept. Upon request, we can also take care of selecting and
              setting up the perfect decorations for your wedding.
            </p>
          </div>

          {/* Testimonials / Names Section */}
          <div className="mt-8 flex flex-wrap md:justify-center gap-8 md:text-center text-text text-base md:text-lg font-normal text-left">
            <div>
              <p>
                Ceylan Stephan  <br /> Daria Nwokolo
              </p>
            </div>
            <div>
              <p>
                Am Brögel 23 <br /> 42285 Wuppertal <br /> Nordrhein Westfalen
              </p>
            </div>
            <div>
              <p>
                017680722232 <br /> hello@whoiswedding.de <br /> @whoiswedding
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
