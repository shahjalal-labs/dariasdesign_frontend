"use client";

import Image from "next/image";
import Link from "next/link";
import img from "../../assets/contentDays.png";
import Navigation from "../shared/Navigation";
import { useGetAllEventsQuery } from "@/redux/api/slotApi";

export default function ContentDays() {
  const { data: getAllEventsData, isLoading, isError } = useGetAllEventsQuery({ page: 1, limit: 10 });
  console.log(getAllEventsData, "getAllEventsData in content days");
  const events = getAllEventsData?.result?.events || [];

  // Helper function to format date range
  const formatDateRange = (startDate: string | undefined, endDate: string | undefined) => {
    if (!startDate) return "Dates coming soon";
    
    const start = new Date(startDate);
    const startDay = start.getDate();
    const month = start.toLocaleString('default', { month: 'long' });
    
    if (!endDate) {
      return `${startDay} ${month}`;
    }
    
    const end = new Date(endDate);
    const endDay = end.getDate();
    
    // If same month
    if (start.getMonth() === end.getMonth()) {
      // Check if it's a 3-day event
      const dayDiff = endDay - startDay;
      if (dayDiff === 2) {
        const middleDay = startDay + 1;
        return `${startDay} / ${middleDay} / ${endDay} ${month}`;
      }
      return `${startDay} / ${endDay} ${month}`;
    }
    
    // Different months
    const endMonth = end.toLocaleString('default', { month: 'long' });
    return `${startDay} ${month} / ${endDay} ${endMonth}`;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-12">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex flex-col md:flex-row gap-10 animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full flex justify-end">
            <div className="w-[500px] h-[700px] bg-gray-300 rounded-2xl"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="w-full space-y-4 md:space-y-6 text-center md:text-left flex flex-col justify-center items-center md:items-start">
            <div className="h-16 md:h-20 bg-gray-300 rounded-lg w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            <div className="h-12 bg-gray-300 rounded-full w-48"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (isError) {
    return (
      <div className="bg-secondary min-h-screen relative container mx-auto">
        <div className="absolute right-40 md:right-40 top-[480px] md:top-1/2 z-50">
          <Navigation />
        </div>
        <div className="px-6 py-20 pt-14 md:pt-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-mango text-red-600 mb-4">Oops! Something went wrong</h2>
            <p className="text-text mb-8">Failed to load events. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-8 py-3 rounded-full hover:opacity-80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen relative container mx-auto">
      <div className="absolute right-40 md:right-40 top-[480px] md:top-1/2 z-50">
        <Navigation />
      </div>

      <div className="px-6 py-20 pt-14 md:pt-20">
        <div className="container mx-auto">
          <div className="text-center leading-tight">
            <h1 className="text-[60px] md:text-[110px] font-normal font-mango text-title">
              ALL SHOOTINGS
            </h1>
            <p className="text-[#AEBB42] font-normal text-5xl md:text-[100px] font-rosmerta">
              Coming soon
            </p>
          </div>
          <p className="text-[38px] font-normal font-mango text-center text-text">
            WEDDING CONTENT DAYS
          </p>
          
          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : events.length === 0 ? (
            // Empty State
            <div className="mt-12 md:mt-36 text-center">
              <div className="bg-white/50 rounded-2xl p-12">
                <h3 className="text-2xl font-mango text-title mb-4">No Events Available</h3>
                <p className="text-text">Check back soon for upcoming wedding content days!</p>
              </div>
            </div>
          ) : (
            // Events List
            <div className="mt-12 md:mt-36 space-y-12">
              {events.map((event: any) => (
                <div key={event.id} className="flex flex-col md:flex-row gap-10 group">
                  {/* Left Image */}
                  <div className="w-full flex justify-end">
                    <div className="relative overflow-hidden rounded-2xl">
                      <Image
                        src={event.bannerImage || img}
                        alt={event.eventName || "Lace Money Event"}
                        width={500}
                        height={700}
                        className="rounded-2xl object-contain h-auto transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="w-full space-y-4 md:space-y-6 text-center md:text-left flex flex-col justify-center items-center md:items-start">
                    <h2 className="text-5xl md:text-[66px] font-normal font-mango">
                      {event.eventName}
                    </h2>

                    {/* Formatted Date */}
                    <p className="text-base md:text-lg text-gray-600">
                      {formatDateRange(event.startDate || event.createdAt, event.endDate)}
                    </p>

                    <Link
                      href={`/event/${event.id}`}
                      className="bg-[#000000] text-white px-12 md:px-16 py-2 md:py-3 rounded-full hover:opacity-80 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold inline-block"
                    >
                      Secure your spot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}