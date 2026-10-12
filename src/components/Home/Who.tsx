"use client";

import logo from "@/assets/pinklogo.avif";
import who1 from "@/assets/who1.png";
import who2 from "@/assets/who2.png";
import who3 from "@/assets/who3.png";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 3,
      ease: "easeOut" as const,
    },
  },
};

const whoData = [
  {
    title: "DECORATION",
    image: who1,
    description:
      "We design tailor-made decoration concepts that perfectly suit you and your location. From the initial idea to the final setup, we’ll be with you every step of the way, including delivery, styling, and professional on-site execution. Every detail is carefully chosen to ensure your wedding not only looks beautiful but feels just as wonderful.",
  },
  {
    title: "FLORISTRY",
    image: who2,
    description:
      "To match your decor concept, we create individual floral arrangements, from bridal bouquets and table flowers to large installations. Whether with fresh flowers, high-quality artificial flowers or a stylish combination of both, we create a harmonious overall picture that makes your wedding unique.",
  },
  {
    title: "CONTENT DAYS",
    image: who3,
    description:
      "In addition to weddings, we organize exclusive Wedding Content Days for photographers, videographers and content creators. Professionally staged settings create high-quality, modern visual worlds that support strong portfolio development and creative inspiration.",
  },
];

export default function Who() {
  return (
    <div className="bg-secondary pt-[80px] md:px-[135px] pb-16">
      <div className="container mx-auto text-center">
        {/* Title */}

        <div className="flex flex-col items-center leading-[1]">
          <Image src={logo} className="object-contain w-[101px] h-[101px]" alt="Logo" width={101} height={101} />

          <h2 className="text-[56px] font-normal text-pink font-mango">
            Who&apos;s Wedding
          </h2>
          {/* Description */}
          <p className="md:mt-4 text-text max-w-4xl mx-auto text-lg md:text-xl p-4 md:p-0">
            At Who&apos;s Wedding you get everything you need for a coherent,
            aesthetically pleasing wedding concept. From bespoke decorations and
            individual floral arrangements to stylish stationery, we develop
            well-thought-out overall concepts that bring your vision to life and
            harmoniously combine every detail.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          className="md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {whoData.map((item: any, index: number) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="text-center p-2 transition-all duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="text-4xl uppercase font-semibold mt-5 text-title text-left font-mango">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-text mt-3 text-lg md:text-xl leading-relaxed text-left ">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
