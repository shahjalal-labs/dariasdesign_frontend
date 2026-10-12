import About from "@/components/Home/About";
import GetInTouch from "@/components/Home/GetInTouch";
import Hero from "@/components/Home/Hero";
import Who from "@/components/Home/Who";

function page() {
  return (
    <div className="">
      <Hero />
      <Who />
      <About />
      <GetInTouch />
    </div>
  );
}

export default page;
