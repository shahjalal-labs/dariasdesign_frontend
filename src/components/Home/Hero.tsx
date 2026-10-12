"use client";
// images
import img1 from "@/assets/hero/IMG_1.jpg";
import img2 from "@/assets/hero/IMG_2.jpg";
import img3 from "@/assets/hero/IMG_3.jpg";
import img4 from "@/assets/hero/IMG_4.jpg";

import Image from "next/image";
import Navigation from "../shared/Navigation";

// Swiper
import { Autoplay, Pagination, Navigation as SwiperNav } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";




export default function Hero() {
  const images = [img1, img2, img3, img4];

  return (
    <div className="min-h-[80vh] flex items-center bg-secondary md:px-[135px] md:pt-[80px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col-reverse md:flex-row items-center gap-7 md:gap-[135px]">
        {/* Left Content */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="space-y-10 md:space-y-12">
            <h1 className="text-[90px] md:text-[110px] font-normal font-mango leading-[0.8]">
              Let’s Plan for <br /> You Dream it. <br />
              <span className="text-pink">We decorate it.
            </span>
            </h1>

            <p className="text-text text-lg md:text-xl p-4 md:p-0">
              You provide the Pinterest board – we'll take care of the rest. Concept, decor, execution. All from a single source.
            </p>

            <button className="bg-pink text-white px-14 py-2 md:px-20 md:py-3 text-lg font-semibold rounded-full hover:bg-primary/80 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Right Carousel */}
        <div className="relative flex-1 flex justify-center ">
          <div className="absolute right-40 top-[200px] md:right-0 md:top-[320px]  z-50">
            <Navigation />
          </div>

          <div className="w-[430px] md:w-[670px] h-[400px] md:h-[600px] relative  overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination, SwiperNav]}
              autoplay={{ delay: 5000 }}
              speed={1000}
              pagination={{ clickable: true }}
              loop
              className="h-full w-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <Image
                    src={img}
                    alt={`Hero ${idx + 1}`}
                    fill
                    className="md:object-cover w-full object-contain  "
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
