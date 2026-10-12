"use client";

import image1 from "@/assets/gallery/1.png";
import image2 from "@/assets/gallery/2.png";
import image3 from "@/assets/gallery/3.png";
import image4 from "@/assets/gallery/4.png";
import image5 from "@/assets/gallery/5.png";
import image6 from "@/assets/gallery/6.png";
import image7 from "@/assets/gallery/7.png";
import gallery from "@/assets/gallery/gallery.png";
import Image, { StaticImageData } from "next/image";
import Navigation from "../shared/Navigation";

// import { MasonryPhotoAlbum } from "react-photo-album";
// import "react-photo-album/masonry.css";

// import photos from "@/data/gallery-collage.json";

type PortfolioItem = {
  year: string;
  title: string;
  headline: string;
  description: string;
  image: StaticImageData;
  imageSide: "left" | "right";
  hasImageBg?: boolean;
};

const portfolioItems: PortfolioItem[] = [
  {
    year: "2025",
    title: "Linda & Robin are Wedding!",
    headline: "GUT HACKHAUSEN",
    description:
      "Linda and Robin celebrated their wedding at the idyllic Gut Hackhausen estate in a romantic outdoor setting. A long, intimate table setting for around 40 guests formed the centerpiece of the decorations. Lush floral arrangements, numerous candles, and elegant chandeliers created a warm, inviting atmosphere and made the evening an unforgettable experience for all the guests.",
    image: image2,
    imageSide: "right",
  },
  {
    year: "2025",
    title: "Anna & Viktor are Wedding!",
    headline: "ARFF CASTLE",
    description:
      "Anna and Victor's wedding took place in a stylish castle venue and was deliberately minimalist and modern. Clean lines, elegant details, and a limited color palette of green and white tones defined the concept. Modern cutlery and understated floral arrangements underscored the timeless, elegant character of this intimate celebration.",
    image: image3,
    imageSide: "left",
    hasImageBg: true,
  },
  {
    year: "2025",
    title: "Alisa & Adrian are Wedding!",
    headline: "ST. CHARLES HALL",
    description:
      "Alisa and Adrian exchanged vows in a stunning castle setting right on the lake in Lucerne. The romantic backdrop of water, mountains, and historic architecture created a truly special atmosphere. Delicate flowers, soft colors, and elegant details lent the wedding a stylish yet deeply emotional feel.",
    image: image4,
    imageSide: "right",
  },
  {
    year: "2024",
    title: "Pegah & Max are Wedding!",
    headline: "MORRHOF",
    description:
      "Pegah and Max's wedding at Morrhof was characterized by timeless elegance. A light, classic color scheme in white and cream created a particularly sophisticated overall impression. Subtle floral arrangements, high-quality materials, and numerous candles created a stylish atmosphere that perfectly suited the location and the character of the celebration.",
    image: image5,
    imageSide: "left",
    hasImageBg: true,
  },
  {
    year: "2024",
    title: "Juicy & Chris are Wedding!",
    headline: "Mussler Winery",
    description:
      "Juicy and Chris celebrated their wedding at the Mussler winery, surrounded by the idyllic rows of vineyards. The ceremony and reception took place outdoors, illuminated by sparkling crystal chandeliers suspended among the vines. This extraordinary combination of nature and elegant staging lent the wedding a truly special charm.",
    image: image6,
    imageSide: "right",
  },
  {
    year: "2024",
    title: "Tina & Raman are Wedding!",
    headline: "REDOUTE",
    description:
      "Tina and Raman celebrated their wedding at the impressive Redoute in Bonn. The ceremony took place on the spacious terrace, while the subsequent reception was held in the venue's historic hall. Classic elegance, high-quality floral arrangements, and stylish table decorations created a festive atmosphere that perfectly complemented the architecture of the Redoute.",
    image: image7,
    imageSide: "left",
    hasImageBg: true,
  },
];

export default function Gallery() {
  return (
    <section className="min-h-screen bg-secondary overflow-x-hidden px-4 py-8 md:py-16">
      <Navigation />
      <div className="container mx-auto">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="font-mango text-[60px] font-normal uppercase leading-none text-primary md:text-[110px]">
            PORTFOLIO
          </h2>
          <p className="text-lg md:text-xl font-normal text-[#6B7280]">
            As they say, a picture is worth a thousand words. So -&gt; see for
            yourself!
          </p>
        </div>

        <div className="relative left-1/2 right-0 w-screen -translate-x-1/2 bg-[#FAFAFA] py-8">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mb-14 flex flex-col items-start gap-6 md:mb-20 md:flex-row md:items-center md:gap-10">
              <Image
                src={image1}
                alt="Hilal and Fays wedding"
                className="h-auto w-full object-contain md:max-w-[600px]"
                priority
              />
              <div className="w-full space-y-3 md:max-w-[650px]">
                <h3 className="font-mango text-3xl font-normal leading-tight md:text-[66px]">
                  Hilal & Fays are Wedding!
                </h3>
                <h3 className="text-2xl font-semibold md:text-3xl">
                  RED VELVET
                </h3>
                <p className="text-base font-normal leading-relaxed text-gray-700 md:text-lg mr-6">
                  A modern, editorial-inspired setting from our Red Velvet
                  shoot. Deep reds, flowing draping, and elegant styling create
                  a luxurious atmosphere with a strong fashion-edge look. The
                  concept combines classic wedding elements with modern staging
                  and demonstrates how expressive minimalist color palettes can
                  be.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-14 py-16 md:space-y-20">
          {portfolioItems.map((item) => {
            const isLeftImage = item.imageSide === "left";

            const rowContent = (
              <article className="container mx-auto grid grid-cols-1 items-center gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-20 md:px-8">
                <div
                  className={`relative flex w-full ${
                    isLeftImage
                      ? "md:order-1 md:justify-start"
                      : "md:order-2 md:justify-end"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={260}
                    height={350}
                    className="h-auto w-full object-contain md:w-auto md:max-w-[650px]"
                  />
                </div>

                <div
                  className={`space-y-5 ${
                    isLeftImage
                      ? "md:order-2 text-left"
                      : "md:order-1 text-left"
                  }`}
                >
                  <h2 className="font-mango text-xl leading-[0.95] md:text-[60px]">
                    {item.title}
                  </h2>
                  <h3 className="font-mango text-2xl md:text-3xl font-semibold uppercase">
                    {item.headline}
                  </h3>
                  <p className="text-base  leading-relaxed text-gray-600 md:text-xl">
                    {item.description}
                  </p>
                </div>
              </article>
            );

            if (item.hasImageBg) {
              return (
                <div
                  key={`${item.year}-${item.title}`}
                  className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#FAFAFA] py-8"
                >
                  {rowContent}
                </div>
              );
            }

            return <div key={`${item.year}-${item.title}`}>{rowContent}</div>;
          })}
        </div>
      </div>
      {/* gallery */}
      <div className="container mx-auto  md:px-8">
        {/* <MasonryPhotoAlbum photos={photos} columns={4} spacing={5} /> */}
        <Image
          src={gallery}
          alt="wedding gallery"
          className="h-auto w-full object-contain "
          priority
        />
      </div>
    </section>
  );
}
