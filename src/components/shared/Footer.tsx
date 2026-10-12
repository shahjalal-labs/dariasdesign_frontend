import arrow from "@/assets/footer/arrow-right-double.png";
import calling from "@/assets/footer/calling-02.png";
// import facebook from "@/assets/footer/facebook-01.png";
import instagram from "@/assets/footer/instagram.png";
import email from "@/assets/footer/mail-open.png";
import tiktok from "@/assets/footer/tiktok.png";
import pinterest from "@/assets/footer/pinterest.png";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import contentDaysLogo from "@/assets/contentdayslogo.png";


function Footer() {
  const pathaName = usePathname();
  console.log("pathName", pathaName);
  return (
    <div className="bg-[#171616] ">
      <div className="px-6 py-16 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between text-base space-y-9 ">
          <div className="w-72">
            {pathaName === "/content-days" ? (
              <Image
              src={contentDaysLogo}
              alt="Content Days Logo"
              width={251}
              height={95}
              className="filter brightness-150"
            />
            ) : (
              <Image
              src={logo}
              alt="Logo"
              width={251}
              height={95}
              className="filter brightness-0 invert"
            />
            )}
            <p className="mt-4 text-gray-400 text-lg">
              {pathaName === "/content-days"? "Content days for everyone who wants to shoot higher quality photos.": "Turning your dream wedding into a beautiful reality with tailored decor and elegant details"}
              
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="font-normal  mb-3 text-white uppercase text-3xl font-mango">
              Contact Info
            </h3>
            <div className="filter brightness-0 invert">
              <div className="flex items-center gap-2 text-gray-300 text-xl">
                <Image src={email} alt="Email" width={18} height={18} />
                <span>Email:</span>
              </div>
              <p className="text-gray-300 text-lg ml-6">{pathaName === "/content-days" ? "contentdays@whoiswedding.de" : "hello@whoiswedding.de"}</p>
            </div>

            <div className="filter brightness-0 invert">
              <div className="flex items-center gap-2 text-gray-300 text-xl">
                <Image src={calling} alt="Phone" width={18} height={18} />
                <span>telefon:</span>
              </div>
              <p className="text-gray-300 text-lg ml-6">{pathaName === "/content-days" ? "015129051636" : "017680722232"}</p>
            </div>
          </div>

        

          <div className="filter brightness-0 invert">
            <h3 className="font-normal mb-3 text-white uppercase text-3xl font-mango">
              Navigation
            </h3>
            <ul className="space-y-3 text-gray-300 text-lg">
              <Link href="/">
              <li className="flex items-center gap-2">
                <Image src={arrow} alt="arrow" width={14} height={14} />
                Home
              </li></Link>
              <Link href="/about-us">
              <li className="flex items-center gap-2">
                <Image src={arrow} alt="arrow" width={14} height={14} />
                About
              </li>
              </Link>
             <Link href={`/gallery`}>
              <li className="flex items-center gap-2">
                <Image src={arrow} alt="arrow" width={14} height={14} />
                Gallery
              </li>
              </Link>
              <Link href={`/contact`}>
              <li className="flex items-center gap-2 ">
                <Image src={arrow} alt="arrow" width={14} height={14} />
                Contact
              </li>
              </Link>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-normal mb-3 text-white uppercase text-3xl font-mango">
              Social
            </h3>

            <div className="space-y-3 text-gray-300 text-lg">
             

              <Link href={`https://www.instagram.com/whoiswedding`} target="_blank" className="flex items-center gap-2">
                <Image
                  src={instagram}
                  alt="Instagram"
                  width={20}
                  height={20}
                  className="filter brightness-0 invert"
                />
                <span>Instagram</span>
              </Link>

              <Link href={`https://de.pinterest.com/whoiswedding/_created/`} target="_blank" className="flex items-center gap-2">
                <Image
                  src={pinterest}
                  alt="Pinterest"
                  width={20}
                  height={20}
                  className="filter brightness-0 invert"
                />
                <span>Pinterest</span>
              </Link>

              <Link href={`https://www.tiktok.com/@whoiswedding?_r=1&_t=ZG-964qDynKQMq`} target="_blank" className="flex items-center gap-2">
                <Image
                  src={tiktok}
                  alt="TikTok"
                  width={20}
                  height={20}
                  className="filter brightness-0 invert"
                />
                <span>TikTok</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between text-gray-400 mt-12 py-6 border-t border-gray-700 text-lg space-y-5 md:space-y-0">
          <p>
            © {new Date().getFullYear()} by WHOISWEDDING | All Rights Reserved
          </p>
          <p>Privacy Policy</p>
          <p>Trams & Condition</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
