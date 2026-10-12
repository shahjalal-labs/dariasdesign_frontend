import bg from "@/assets/footer.jpg";
import Image from "next/image";

export default function GetInTouch() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden text-white">
      {/* Background Image (normal mode) */}
      <Image src={bg} alt="Background" className="w-full h-full object-cover" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#171616]/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-[110px] font-normal font-mango">
          GET IN TOUCH
        </h1>

        <button className="mt-6 bg-white/75 text-lg text-black px-8 py-2 rounded-full hover:bg-gray-200 transition">
          Send us a Message
        </button>
      </div>
    </div>
  );
}
