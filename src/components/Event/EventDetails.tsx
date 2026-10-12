"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  quantity: number;
};

type ParsedSection = {
  id: string;
  title: string;
  fullContent: string;
  previewContent: string;
  hasMore: boolean;
};

type EventDetailsProps = {
  hideSecureTicketButton?: boolean;
  onSecureTicketClick?: () => void;
  eventContent?: string;
  slots?: Slot[];
  id: string;
};

export default function EventDetails({
  hideSecureTicketButton = false,
  onSecureTicketClick,
  eventContent,
  slots = [],
  id,
}: EventDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldHideSecureTicketButton =
    hideSecureTicketButton ||
    pathname === "/event/registration" ||
    pathname === "/event/billing" ||
    pathname === "/event/participate" ||
    pathname === "/event/checkout";

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Group slots by date
  const groupedSlots = useMemo(() => {
    const grouped: Record<string, Slot[]> = {};
    slots.forEach((slot) => {
      const date = new Date(slot.date);
      const dateKey = date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });
    return grouped;
  }, [slots]);

  // Helper function to get text content from HTML
  const getTextContent = (html: string): string => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || "";
  };

  // Helper function to count words in text
  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Helper function to truncate HTML to approximately 70 words
  const truncateHtmlToWords = (
    html: string,
    wordLimit: number = 70,
  ): string => {
    if (typeof window === "undefined") {
      // Server-side fallback: strip HTML and truncate
      const text = html.replace(/<[^>]*>/g, "");
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const truncated = words.slice(0, wordLimit).join(" ");
      return truncated + (words.length > wordLimit ? " ..." : "");
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Get all text nodes
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, {
      acceptNode: () => NodeFilter.FILTER_ACCEPT,
    });

    let wordCount = 0;
    let currentNode = walker.nextNode();

    while (currentNode && wordCount < wordLimit) {
      const text = currentNode.textContent || "";
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const remainingWords = wordLimit - wordCount;

      if (words.length <= remainingWords) {
        wordCount += words.length;
      } else {
        // Truncate the current node
        const truncatedText = words.slice(0, remainingWords).join(" ");
        currentNode.textContent = truncatedText;
        wordCount = wordLimit;
        break;
      }

      currentNode = walker.nextNode();
    }

    // Remove nodes after the truncation point
    while (currentNode) {
      const nextNode = walker.nextNode();
      if (currentNode.parentNode) {
        currentNode.parentNode.removeChild(currentNode);
      }
      currentNode = nextNode;
    }

    // Remove empty parent nodes
    const cleanEmptyNodes = (node: Node): void => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        // Check if element has no children or only whitespace text
        if (
          element.children.length === 0 &&
          (!element.textContent || element.textContent.trim() === "")
        ) {
          element.parentNode?.removeChild(element);
        } else {
          // Recursively clean children
          Array.from(element.children).forEach((child) =>
            cleanEmptyNodes(child),
          );
        }
      }
    };

    cleanEmptyNodes(tempDiv);

    return tempDiv.innerHTML;
  };

  // Clean HTML content by removing existing toggle buttons
  const cleanContent = (html: string): string => {
    if (typeof window === "undefined") return html;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove any button elements that contain "Show Less" or "Read More"
    const buttons = tempDiv.querySelectorAll("button");
    buttons.forEach((button) => {
      const text = button.textContent?.toLowerCase() || "";
      if (text.includes("show less") || text.includes("read more")) {
        button.remove();
      }
    });

    // Remove any div wrappers that might contain only buttons
    const divs = tempDiv.querySelectorAll("div");
    divs.forEach((div) => {
      // Check if div has no meaningful content (only empty text nodes or no children)
      if (
        div.children.length === 0 &&
        (!div.textContent || div.textContent.trim() === "")
      ) {
        div.remove();
      }
    });

    return tempDiv.innerHTML;
  };

  // Parse HTML content into sections
  const parsedSections: ParsedSection[] = useMemo(() => {
    if (!eventContent) return [];

    const sections: ParsedSection[] = [];

    // Server-side parsing fallback
    if (typeof window === "undefined") {
      // Simple server-side parsing - look for h2 tags in the HTML
      const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
      const matches = eventContent.matchAll(h2Regex);
      let match;
      let index = 0;

      while ((match = matches.next().value) !== undefined) {
        const title = match[1]?.trim() || "";
        // For server-side, we just use the entire content without truncation
        const fullContent = eventContent;
        const textContent = eventContent.replace(/<[^>]*>/g, "");
        const wordCount = countWords(textContent);
        const hasMore = wordCount > 70;

        let sectionKey = `section_${index}`;
        const titleLower = title.toLowerCase();
        if (titleLower.includes("whom") || titleLower.includes("for whom"))
          sectionKey = "forWhom";
        else if (titleLower.includes("what do you get"))
          sectionKey = "whatDoYouGet";
        else if (titleLower.includes("where")) sectionKey = "where";
        else if (
          titleLower.includes("how") &&
          !titleLower.includes("expensive")
        )
          sectionKey = "how";
        else if (titleLower.includes("expensive")) sectionKey = "howExpensive";
        else if (titleLower.includes("important")) sectionKey = "important";
        else if (titleLower.includes("who")) sectionKey = "who";

        sections.push({
          id: sectionKey,
          title,
          fullContent,
          previewContent: fullContent.slice(0, 500) + (hasMore ? " ..." : ""),
          hasMore,
        });
        index++;
      }
      return sections;
    }

    // Client-side parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(eventContent, "text/html");

    // Find all h2 elements (section headers)
    const headers = doc.querySelectorAll("h2");

    headers.forEach((header, index) => {
      let nextElement = header.nextElementSibling;
      const contentElements: Element[] = [];

      // Collect all elements until next h2
      while (nextElement && nextElement.tagName !== "H2") {
        contentElements.push(nextElement);
        nextElement = nextElement.nextElementSibling;
      }

      // Get the title text
      const title = header.textContent?.trim() || "";

      // Generate a key for this section
      let sectionKey = `section_${index}`;
      const titleLower = title.toLowerCase();
      if (titleLower.includes("whom") || titleLower.includes("for whom"))
        sectionKey = "forWhom";
      else if (titleLower.includes("what do you get"))
        sectionKey = "whatDoYouGet";
      else if (titleLower.includes("where")) sectionKey = "where";
      else if (titleLower.includes("how") && !titleLower.includes("expensive"))
        sectionKey = "how";
      else if (titleLower.includes("expensive")) sectionKey = "howExpensive";
      else if (titleLower.includes("important")) sectionKey = "important";
      else if (titleLower.includes("who")) sectionKey = "who";

      // Convert content elements to HTML string and clean it
      const rawContent = contentElements.map((el) => el.outerHTML).join("");
      const fullContent = cleanContent(rawContent);

      // Check if content has more than 70 words
      const textContent = getTextContent(fullContent);
      const wordCount = countWords(textContent);
      const hasMore = wordCount > 70;

      // Generate preview content (first 70 words)
      let previewContent = fullContent;
      if (hasMore) {
        previewContent = truncateHtmlToWords(fullContent, 70);
      }

      sections.push({
        id: sectionKey,
        title,
        fullContent,
        previewContent,
        hasMore,
      });
    });

    return sections;
  }, [eventContent]);

  // Helper function to get section by id
  const getSection = (id: string): ParsedSection | undefined => {
    return parsedSections.find((s) => s.id === id);
  };

  // Format time slot display
  const formatTimeSlot = (slot: Slot): string => {
    return `${slot.startTime} - ${slot.endTime} | ${slot.quantity} ${slot.quantity === 1 ? "place" : "places"}`;
  };

  // Format date header
  const formatDateHeader = (dateStr: string): string => {
    const [day, month, year] = dateStr.split(".");
    return `${day}.${month}.${year}`;
  };

  // Render section component
  const renderSection = (sectionId: string, sectionTitle?: string) => {
    const section = getSection(sectionId);
    if (!section) return null;

    const isExpanded = expandedSections[sectionId] || false;

    return (
      <div className="mt-20 space-y-7" key={sectionId}>
        <h2 className="text-[24px] font-peter-test font-bold mt-16">
          {sectionTitle || section.title}
        </h2>
        <div className="text-text text-base md:text-xl">
          <div
            dangerouslySetInnerHTML={{
              __html: isExpanded ? section.fullContent : section.previewContent,
            }}
          />
        </div>
        {section.hasMore && (
          <button
            type="button"
            onClick={() => toggleSection(sectionId)}
            className="text-sm md:text-base font-semibold underline text-title hover:opacity-70 transition-opacity cursor-pointer"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mx-auto md:w-[1000px] bg-secondary p-4 md:p-16 py-10 md:py-16 space-y-6">
        <h3 className="text-4xl leading-[0.6] md:text-[104px] font-rosmerta text-title">
          Details
          <p className="font-butler text-xl uppercase md:text-[40px] text-title font-blod ml-10">
            Everything you need to know
          </p>
        </h3>

        {/* FOR WHOM Section */}
        {renderSection("forWhom")}

        {/* WHEN Section - Dynamic from slots */}
        <div className="mt-20 space-y-7">
          <h2 className="text-[24px] font-peter-test font-bold mt-16">WHEN?</h2>
          <p className="text-text text-base md:text-xl">
            Multiple days with different time slots available. <br />
            Choose the period that suits you best. <br />
            (If you would like to come as a group, please let us know.)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-start text-black/70 font-railway">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date}>
              <p className="font-bold text-black text-xl">
                {formatDateHeader(date)}
              </p>
              <ol className="list-decimal pl-4 md:pl-5 space-y-1 mt-1">
                {dateSlots.map((slot) => (
                  <li key={slot.id}>{formatTimeSlot(slot)}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* WHAT DO YOU GET Section */}
        {renderSection("whatDoYouGet")}

        {/* WHERE Section */}
        {renderSection("where")}

        {/* HOW Section */}
        {renderSection("how")}

        {/* HOW EXPENSIVE Section */}
        {renderSection("howExpensive")}

        {/* IMPORTANT Section */}
        {renderSection("important")}

        {/* WHO Section */}
        {renderSection("who")}
      </div>

      <div className="mx-auto md:w-[1000px] p-4 md:p-16 py-10 md:my-16 bg-white">
        {!shouldHideSecureTicketButton && (
          <button
            type="button"
            onClick={() => {
              onSecureTicketClick?.();
              router.push(`/event/registration?id=${id}`);
              setTimeout(() => {
                const registrationElement =
                  document.getElementById("registration");
                if (registrationElement) {
                  registrationElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 100);
            }}
            className="mx-auto mt-16 block rounded-full bg-black px-8 py-3 text-base tracking-[0.2em] text-white transition hover:opacity-90 font-railway"
          >
            Secure Your Ticket
          </button>
        )}
      </div>
    </div>
  );
}
