"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: unknown;
            autoDisplay?: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

const navItems = [
  { name: "Log in", path: "/login" },
  { name: "Home", path: "/" },
  { name: "Content Days", path: "/content-days" },
  { name: "Gallery", path: "/gallery" },
  { name: "About Us", path: "/about-us" },
  { name: "Contact Us", path: "/contact-us" },
];

const languages = [
  { label: "Deutsch", code: "de" },
  { label: "English", code: "en" },
  { label: "Français", code: "fr" },
  { label: "Español", code: "es" },
  { label: "Italiano", code: "it" },
  { label: "Türkçe", code: "tr" },
  { label: "Русский", code: "ru" },
  { label: "العربية", code: "ar" },
  { label: "Polski", code: "pl" },
  { label: "Nederlands", code: "nl" },
];

// Default language is always German
const DEFAULT_LANGUAGE = "de";

function setTranslateCookie(languageCode: string) {
  const cookieValue = `/en/${languageCode}`;
  Cookies.set("googtrans", cookieValue, { path: "/" });
  Cookies.set("googtrans", cookieValue, { path: "/", domain: window.location.hostname });
}

function applyGoogleTranslation(languageCode: string): Promise<boolean> {
  return new Promise((resolve) => {
    const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    
    if (!select || select.options.length === 0) {
      resolve(false);
      return;
    }

    try {
      // Set the value
      select.value = languageCode;
      
      // If the option doesn't exist yet, it won't be set correctly.
      if (select.value !== languageCode) {
        resolve(false);
        return;
      }
      
      // Dispatch multiple events to ensure translation triggers
      select.dispatchEvent(new Event("change", { bubbles: true }));
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("click", { bubbles: true }));
      
      // Also try to trigger the onChange handler directly if it exists
      if (select.onchange) {
        select.onchange(new Event("change"));
      }
      
      resolve(true);
    } catch (error) {
      console.error("Error applying translation:", error);
      resolve(false);
    }
  });
}

function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Always default to German if no cookie exists or cookie is invalid
    const currentCookie = Cookies.get("googtrans");
    let languageToUse = DEFAULT_LANGUAGE;
    let isFirstVisit = false;
    
    if (currentCookie) {
      const cookieLanguage = currentCookie.split("/").pop();
      // Validate that the cookie language is in our supported languages
      if (cookieLanguage && languages.some(lang => lang.code === cookieLanguage)) {
        languageToUse = cookieLanguage;
      }
    } else {
      isFirstVisit = true;
    }

    setTranslateCookie(languageToUse);
    setSelectedLanguage(languageToUse);

    // Set up the global initialization callback that Google Translate script will call
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "de,en,fr,es,it,tr,ru,ar,pl,nl",
          autoDisplay: false,
        },
        "google_translate_element",
      );

      // Only apply manual translation on the very first visit
      // For page refreshes and navigation, Google Translate handles it natively via the googtrans cookie
      if (isFirstVisit) {
        let attempts = 0;
        const maxAttempts = 30;
        
        const applyTranslationWithRetry = async () => {
          attempts += 1;
          const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
          
          if (select && select.options.length > 0) {
            const success = await applyGoogleTranslation(languageToUse);
            if (success) {
              return;
            }
          }
          
          if (attempts < maxAttempts) {
            // Progressive delay for smoother retry
            const delay = attempts <= 5 ? 300 : attempts <= 10 ? 500 : attempts <= 20 ? 800 : 1200;
            setTimeout(applyTranslationWithRetry, delay);
          }
        };
        
        // Start applying translation after a delay
        setTimeout(applyTranslationWithRetry, 600);
      }
    };

    // If Google Translate is already loaded, initialize immediately
    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.();
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-language-dropdown]")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const currentLanguageLabel = useMemo(
    () => languages.find((language) => language.code === selectedLanguage)?.label ?? "Deutsch",
    [selectedLanguage],
  );

  const handleLanguageChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setTranslateCookie(languageCode);
    setOpen(false);
    setIsTranslating(true);
    
    // Apply translation with robust retry logic
    let attempts = 0;
    const maxAttempts = 20;
    
    const applyTranslationWithRetry = async () => {
      attempts += 1;
      const success = await applyGoogleTranslation(languageCode);
      
      if (success) {
        setTimeout(() => {
          setIsTranslating(false);
        }, 400);
        return;
      }
      
      if (attempts < maxAttempts) {
        const delay = attempts <= 3 ? 200 : attempts <= 8 ? 400 : attempts <= 15 ? 600 : 1000;
        setTimeout(applyTranslationWithRetry, delay);
      } else {
        setIsTranslating(false);
      }
    };
    
    // Start immediately with first attempt
    await applyTranslationWithRetry();
  };

  return (
    <div className="relative" data-language-dropdown>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 w-full uppercase px-4 py-0.5 rounded-full font-serif text-lg md:text-[25px] font-bold font-mango whitespace-nowrap transition-all duration-300 bg-white/80 text-black hover:bg-blue-200 hover:text-black opacity-80 hover:shadow-md relative"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isTranslating}
      >
        <span>Language</span>
        <span className="text-[16px] leading-none">{currentLanguageLabel}</span>
        {isTranslating && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </button>

      {open ? (
        <div className="absolute right-full top-0 mr-3 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="max-h-72 overflow-y-auto py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-[25px] font-medium transition-colors hover:bg-pink/10 hover:text-pink ${
                  selectedLanguage === language.code ? "bg-pink/10 text-pink" : "text-black"
                }`}
                disabled={isTranslating}
              >
                <span>{language.label}</span>
                {selectedLanguage === language.code ? (
                  <span className="text-xs font-semibold">✓</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ position: "absolute", left: "-9999px", top: "-9999px" }} />
      
      {/* Loading overlay for smooth translation */}
      {isTranslating && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">Translating...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const token = Cookies.get("token");

  // create a local copy to avoid mutating the shared navItems constant
  const items = [...navItems];
  if (token) {
    items[0] = { name: "Log out", path: "/login" };
  } else {
    items[0] = { name: "Log in", path: "/login" };
  }

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
    localStorage.removeItem("googleSignIn");
  };

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-[99999] font-mango pointer-events-auto">
      <div className="flex flex-col items-center gap-2 border-l-2 border-black pl-6">
        {items.map((item) => {
          const isContentDaysRoute =
            pathname === "/content-days" || pathname.startsWith("/event");
          const isGalleryPage = pathname === "/gallery";
          const isTicketPage =
            pathname === "/ticket" || pathname.startsWith("/ticket/");
          const isActive =
            pathname === item.path ||
            (item.path === "/content-days" && isContentDaysRoute) ||
            (item.path === "/ticket" && isTicketPage);
          const isContentDays = item.path === "/content-days";
          const gallery = item.path === "/gallery";
          const ticket = item.path === "/ticket";
          
          if (item.name === "Log out") {
            return (
              <button
                key={item.path}
                onClick={handleLogout}
                type="button"
                className={`inline-flex items-center w-full px-4 py-0.5 uppercase rounded-full font-serif text-lg md:text-[25px] font-bold font-mango whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? ticket
                      ? "text-pink hover:text-pink bg-transparent opacity-80 hover:bg-blue-200"
                      : isContentDays
                        ? "text-pink hover:text-pink bg-white/80 opacity-80 hover:bg-blue-200"
                        : gallery
                          ? "text-pink hover:text-pink bg-white/80 md:bg-white/80 opacity-80 hover:bg-blue-200"
                          : "bg-white/80 text-pink hover:shadow-md opacity-80 hover:bg-blue-200"
                    : isGalleryPage
                      ? "bg-white/80 md:bg-white/80 text-black hover:bg-blue-200 md:hover:bg-blue-200 opacity-80 hover:text-black"
                      : isTicketPage
                        ? "bg-transparent text-black hover:bg-blue-200 opacity-80 hover:text-black"
                        : "bg-white/80 text-black hover:bg-blue-200 opacity-80 hover:text-black"
                }`}
              >
                {item.name}
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`inline-flex items-center w-full uppercase px-4 py-0.5 rounded-full font-serif text-lg md:text-[25px] font-bold font-mango whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? ticket
                    ? "text-pink hover:text-pink bg-transparent opacity-80 hover:bg-blue-200"
                    : isContentDays
                      ? "text-pink hover:text-pink bg-white/80 opacity-80 hover:bg-blue-200"
                      : gallery
                        ? "text-pink hover:text-pink bg-white/80 md:bg-white/80 opacity-80 hover:bg-blue-200"
                        : "bg-white/80 text-pink hover:shadow-md opacity-80 hover:bg-blue-200"
                  : isGalleryPage
                    ? "bg-white/80 md:bg-white/80 text-black hover:bg-blue-200 md:hover:bg-blue-200 opacity-80 hover:text-black"
                    : isTicketPage
                      ? "bg-transparent text-black hover:bg-blue-200 opacity-80 hover:text-black"
                      : "bg-white/80 text-black hover:bg-blue-200 opacity-80 hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          );
        })}

        <LanguageDropdown />
      </div>
    </nav>
  );
}