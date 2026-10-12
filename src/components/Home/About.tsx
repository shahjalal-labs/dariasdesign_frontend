import hero from "@/assets/aboutHome.png";
import hero2 from "@/assets/aboutHome2.png";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-[80vh] flex items-center bg-white px-6 md:pb-32 container mx-auto py-10">
      <div className="container mx-auto w-full flex flex-col-reverse md:flex-row items-center gap-10 ">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left mt-10 md:mt-0 space-y-10">
          <h1 className="text-[60px] md:text-[100px] font-normal text-primary leading-tight font-mango ">
            About Us
          </h1>

          <p className=" text-text text-lg md:text-xl">
            We are Ceylan & Daria – the founders of Who&apos;s Wedding. <br />{" "}
            <br />
            Having started with wedding planning, we quickly realized that our
            passion lies in decoration and floral arrangements. Today, we
            develop aesthetically pleasing wedding concepts with meticulous
            attention to detail, supported by a fantastic team who share our
            vision
          </p>

          <button className="bg-pink text-white px-10 py-3   rounded-full hover:bg-primary/80 transition font-semibold text-lg">
            More about the team
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <div className="relative  w-[250px] md:w-[400px]">
            {/* Bottom Image */}
            <Image
              src={hero}
              alt="Hero Bottom Image"
              width={350}
              height={360}
              className=" w-full"
            />

            {/* Top Image */}
            <Image
              src={hero2}
              alt="Hero Top Image"
              width={350}
              height={340}
              className=" absolute -bottom-14 md:-bottom-36  left-32 md:left-56 z-20"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
