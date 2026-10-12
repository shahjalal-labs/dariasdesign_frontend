"use client";

import event1 from "@/assets/event/event1.png";
import event2 from "@/assets/event/event2.png";
import event3 from "@/assets/event/event3.png";
import event4 from "@/assets/event/event4.png";
import event5 from "@/assets/event/event5.png";
import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import Image, { StaticImageData } from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

export default function EventStepSlider({ stepImage }: { stepImage: StaticImageData[] }) {
  const events = stepImage || [];
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="container mx-auto relative">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        speed={1000}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay, Navigation]}
        // navigation will be bound to our refs in useEffect
        navigation={{ nextEl: nextRef.current, prevEl: prevRef.current }}
        grabCursor={true}
        longSwipes={true}
        longSwipesRatio={0.2}
        resistance={true}
        resistanceRatio={0.85}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {events.map((event, index) => (
          <SwiperSlide key={index}>
            <Image
              src={event}
              alt={`Event ${index + 1}`}
              className="w-full mx-auto h-[700px] object-contain "
              width={500}
              height={700}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={nextRef}
        className="swiper-button-next custom-swiper-nav absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer"
        aria-label="Next slide"
      >
        <MdOutlineKeyboardArrowRight
          size={20}
          color="#fff"
          className="bg-black rounded-full font-normal"
        />
      </div>
      <div
        ref={prevRef}
        className="swiper-button-prev custom-swiper-nav absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer rotate-180"
        aria-label="Previous slide"
      >
        <MdOutlineKeyboardArrowRight
          size={15}
          color="#fff"
          className="bg-black rounded-full font-normal"
        />
      </div>
      <style jsx>{`
        .custom-swiper-nav {
          background: #000;
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-swiper-nav svg {
          color: #fff;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          display: none !important;
        }
        .swiper-button-next,
        .swiper-button-prev {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
