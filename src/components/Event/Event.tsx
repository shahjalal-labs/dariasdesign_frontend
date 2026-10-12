"use client";

import { useGetEventDetailsQuery } from "@/redux/api/slotApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Marquee from "react-fast-marquee";
import Navigation from "../shared/Navigation";
import EventDetails from "./EventDetails";
import EventStepSlider from "./EventStepSlider";

export default function Event() {
  const params = useParams();
  const id = params.id;
  const {
    data: eventDetailsData,
    isLoading,
    isError,
    refetch,
  } = useGetEventDetailsQuery(id);
  const eventDetails = eventDetailsData?.result;

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="h-[350px] md:h-[800px] bg-gray-300 w-full"></div>
        <div className="absolute inset-0 flex flex-col p-5 md:p-0 items-start md:items-center justify-center md:space-y-11">
          <div className="h-10 md:h-24 bg-gray-400 rounded-lg w-48 md:w-96"></div>
          <div className="h-6 md:h-14 bg-gray-400 rounded-lg w-36 md:w-80"></div>
        </div>
      </div>

      {/* What You Can Expect Skeleton */}
      <div className="bg-secondary px-4 py-10 text-center space-y-4 md:space-y-4">
        <div className="mb-16">
          <div className="h-10 md:h-20 bg-gray-300 rounded-lg w-64 md:w-[500px] mx-auto mb-4"></div>
          <div className="h-6 md:h-8 bg-gray-200 rounded-lg w-48 md:w-96 mx-auto"></div>
        </div>

        {/* Marquee Skeleton */}
        <div className="relative left-1/2 right-1/2 mt-4 w-screen -translate-x-1/2 overflow-hidden">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mx-1 w-36 md:w-[370px]">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-300 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#F6F2E7] px-4 py-7 text-center">
        <div className="mx-auto w-full">
          <div className="space-y-7 text-center mb-8 md:mb-16">
            <div className="h-8 md:h-14 bg-gray-300 rounded-lg w-64 md:w-[500px] mx-auto"></div>
            <div className="h-6 md:h-8 bg-gray-200 rounded-lg w-48 md:w-96 mx-auto"></div>
          </div>

          {/* Event Step Slider Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-300 rounded-2xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <section className="bg-secondary min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 rounded-2xl p-8">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-mango text-red-600 mb-4">
              Unable to Load Event
            </h2>
            <p className="text-text mb-6">
              We couldn't load the event details. This might be due to a network
              issue or the event might not exist.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => refetch()}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors inline-flex items-center gap-2 mx-auto"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
              <Link
                href="/"
                className="inline-block text-title underline hover:no-underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Loading State with Spinner
  const LoadingState = () => (
    <section className="bg-secondary min-h-screen">
      <div className="container mx-auto">
        {/* Hero Loading */}
        <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <div className="h-[350px] md:h-[800px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer"></div>
        </div>

        {/* Content Loading */}
        <div className="px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex flex-col items-center">
              {/* Spinner */}
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-black rounded-full border-t-transparent animate-spin absolute top-0"></div>
              </div>

              {/* Loading Text */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-mango text-title">
                  Loading event details
                </span>
                <span className="loading-dots">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>

              <p className="text-text">
                Preparing an amazing experience for you...
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite;
          display: inline-block;
        }

        .delay-0 {
          animation-delay: 0s;
        }

        .delay-150 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (isError || !eventDetails) {
    return <ErrorState />;
  }

  // Main content
  return (
    <section className="bg-secondary">
      <div className="mx-auto w-full container">
        <div className="">
          <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <Image
              src={eventDetails?.bannerImage}
              alt="Event hero"
              width={1920}
              height={700}
              className="h-[350px] w-full object-cover md:h-[800px]"
              priority
            />

            {/* SOFT BACKGROUND OVERLAY */}
            <div className="absolute inset-0 bg-[#00000066]/20" />

            {/* DARK GRADIENT FOR READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/40" />

            {/* CENTER TEXT */}
            <div className="absolute inset-0 flex flex-col p-5 md:p-0 items-start md:items-center justify-center md:space-y-11 text-secondary text-center">
              <h3 className="text-3xl md:text-[100px] uppercase font-mango font-normal animate-fadeIn">
                {eventDetails?.eventName}
              </h3>
              <p className="font-mango text-lg md:text-5xl uppercase font-normal animate-fadeIn animation-delay-200">
                WEDDING CONTENT DAY
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="absolute right-40 md:right-96 top-[180px] md:top-2/4 flex flex-col gap-1.5 text-[9px] uppercase tracking-wide text-white sm:right-8 pointer-events-auto">
            <Navigation />
          </div>
        </div>

        <div className="bg-secondary px-4 py-10 text-center space-y-4 md:space-y-4">
          <div className="mb-16">
            <h3 className="font-mango text-[40px] md:text-[70px] uppercase font-normal animate-fadeIn">
              WHAT YOU CAN EXPECT
            </h3>
            <p className="text-lg md:text-xl text-[#716f67] animate-fadeIn animation-delay-200">
              Real impressions from our previous Content Days & Photoshoots
            </p>
          </div>

          <div className="relative left-1/2 right-1/2 mt-4 w-screen -translate-x-1/2 overflow-hidden">
            <Marquee gradient={false} speed={60} pauseOnHover={false} autoFill>
              {eventDetails?.sliderImages?.map(
                (photo: string, index: number) => (
                  <div key={index} className="mx-1 w-36 md:w-[370px]">
                    <div className="relative aspect-[3/4] overflow-hidden border border-[#dfdfdf] rounded-lg group">
                      <Image
                        src={photo}
                        alt={`Rent item ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                ),
              )}
            </Marquee>
          </div>
        </div>

        {/* GET YOUR TICKET BUTTON */}
        <Link
          href="/event/registration"
          className="fixed bottom-0 right-6 z-[9999] block w-[286px] rounded-full bg-black px-8 py-3 text-center text-base tracking-[0.2em] text-white shadow-2xl transition-all duration-300 hover:opacity-90 hover:scale-105 md:bottom-8 md:right-8 font-railway animate-slideIn"
        >
          Get Your Ticket
        </Link>

        <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#F6F2E7] px-4 py-7 text-center">
          <div className="mx-auto w-full">
            <div className="space-y-7 text-center mb-8 md:mb-16">
              <h3 className="mt-5 text-[40px] md:text-[56px] font-mango animate-fadeIn">
                What to expect at the Lace Money Content Day ✨
              </h3>
              <p className="text-xl md:text-2xl text-[#716f67] animate-fadeIn animation-delay-200">
                One photoshoot, two couples, double the content.
              </p>
            </div>

            <EventStepSlider stepImage={eventDetails?.overlapImgs} />
          </div>
        </div>

        <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#F6F2E7] px-4 pb-8 pt-2 md:pt-20">
          <EventDetails
            eventContent={eventDetails?.content}
            slots={eventDetails?.slots}
            id={id as string}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
}
