import about2 from "@/assets/about/about2.png";
import about3 from "@/assets/about/about3.png";
import Image from "next/image";
import Navigation from "../shared/Navigation";

export default function AboutUs() {
  return (
    <div className="bg-secondary py-5 ">
      <div className="container mx-auto bg-white   ">
        {/* Title */}
        <h1 className="text-center text-[50px] md:text-[150px] font-serif tracking-wide my-8 font-mango font-normal  ">
          WHO IS WEDDING?
        </h1>

        {/* Hero Section */}
        <div className="">
          <div className="relative">
            <div className="absolute right-36 md:right-60 top-[190px] md:top-1/2 z-50">
              <Navigation />
            </div>
            <div className="w-full aspect-video md:aspect-video md:h-[650px] overflow-hidden ">
              <video
                src="https://pub-17faa7ebf86d4796bbca7f3db613d146.r2.dev/uploads/messages/files/1778343863969-esxvg9z0m26.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain bg-black"
                style={{ display: "block" }}
              />
            </div>
            <div className="absolute bottom-3 md:bottom-10 left-3 md:left-6 text-white ">
              <h2 className="text-[40px] md:text-[100px] font-normal font-mango  leading-[0.8]">
                We are
                <br /> Wedding!
              </h2>
            </div>
          </div>

          <div className="md:w-10/12 mx-auto px-4">
            <p className="text-base md:text-lg text-text mt-6 leading-relaxed ">
              At Who&apos;s Wedding, everything revolves around your big day. As
              wedding florists in North Rhine-Westphalia, we&apos;ve made it our
              mission to transform every wedding into an unforgettable
              experience – including yours. As wedding decorators, we create a
              breathtaking atmosphere and cater to all your wishes regarding
              wedding decorations. Whether you envision elegant, modern, or
              unique wedding decorations, our experienced team will skillfully
              bring your vision to life. And that&apos;s not all! Our graphic
              designers create bespoke wedding stationery that will delight you
              and your guests. Wedding invitations, menus, seating charts – we
              design everything according to your specifications and in perfect
              harmony with your wedding decorations. The best part? With us, you
              get everything perfectly coordinated and from a single source!
              Let&apos;s create your dream wedding together! Contact us now and
              start your wedding adventure with Who&apos;s Wedding.
            </p>

            <p className="mt-4 text-gray-700 text-3xl">
              XO. <span className="text-[40px]">🖤</span>
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-10 items-center md:mb-16 relative px-4 mt-4">
          <div className="md:space-y-6 order-2 md:order-1">
            <h3 className="text-4xl md:text-[70px] font-mango mb-2 uppercase text-title leading-[1] ">
              CEYLAN IS <br />
              WEDDING!
            </h3>
            <p className="text-pink text-xl md:text-[23px] mb-3 font-hellstand ">
              Decorator & Concept
            </p>

            <p className="text-base md:text-lg text-gray-500 leading-relaxed">
              Hello, I&apos;m Ceylan, your <b>contact person</b> and expert for
              <b>creative</b> <b>concept planning</b> for wedding decorations at
              Who&apos;s Wedding. As a wedding <b>decorator and florist</b>,
              I&apos;m here to advise you and listen to your wishes and ideas.
              Create your <b>personal wedding</b> <b> concept</b> and, together
              with our experienced team, bring your vision to life. We want you
              to be able to focus on what truly matters – you and your loved
              ones. My goal is achieved when everything comes together to create
              a harmonious and unique overall picture, and your wishes and ideas
              are an integral part of your perfect wedding. Let&apos;s plan and
              design your perfect wedding decorations together!
            </p>
            <p className="mt-3 text-primary  font-hellstand text-[20px] md:text-[23px] text-center">
              Ceylan Stephan
            </p>
          </div>

          <div className="order-1 md:order-2 relative ">
            <Image
              src={about2}
              alt="Person"
              className="w-full h-auto object-contain grayscale"
              width={500}
              height={300}
            />
            {/* <div>
              <p className="hidden md:flex uppercase font-mango text-xl pl-4 absolute -right-8 lg:-right-14 text-title -top-16 [writing-mode:vertical-rl] [text-orientation:mixed] ">
            
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-black"></span>
                WEDDING FLORIST | DECORATOR | GRAPHIC DESIGNER
              </p>
            </div> */}
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-10 items-center md:mb-16 relative px-4">
          <div className="relative order-1 md:order-1">
            <Image
              src={about3}
              alt="Person"
              className="w-full h-auto object-contain grayscale"
              width={500}
              height={300}
            />
            <p className="hidden md:flex uppercase font-mango text-xl pr-4 absolute -left-8 lg:-left-14 text-title -bottom-[100px] -translate-y-1/2 [writing-mode:vertical-rl] [text-orientation:mixed]">
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-black"></span>
              FLORISTIK | HOCHZEITSDEKO MIETEN | PAPETERIE
            </p>
          </div>

          <div className="text-right order-2 md:order-2">
            <h3 className="text-4xl md:text-[65px] md:leading-[0.8] font-mango mb-2  uppercase text-title ">
              DARIA IS <br /> <span className="mt-1">WEDDING!</span>
            </h3>
            <p className="text-pink text-[20px] md:text-[23px] mb-3 font-hellstand">
             Grafik Designerin & Gestaltung
            </p>
            <p className="text-base md:text-lg text-text leading-relaxed text-left">
              Hello, I&apos;m Daria, and at Who&apos;s Wedding, I&apos;m
              responsible for the design and creation of your{" "}
              <b>wedding decorations</b>. As an experienced wedding{" "}
              <b>graphic designer and decorator </b>, I work with Ceylan to
              bring your ideas to life. I <b>design personalized </b>{" "}
              <b>wedding stationery</b> , which you may have already seen in our
              shop. It&apos;s always a joy for me to create designs that reflect
              the <b>unique character</b> of a new love story. From stationery
              to cake toppers, I ensure that everything comes together
              perfectly. I look forward to making your wedding unforgettable!
            </p>
            <p className="mt-3 text-primary  font-hellstand text-[20px] md:text-[23px] text-center">
             Daria Nwokolo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
