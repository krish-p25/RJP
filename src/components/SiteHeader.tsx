import { Link, useLocation } from "react-router-dom";
import { useScrolledState } from "../hooks/useScrolledState";
import { HEADER_BASE_CLASSES, HEADER_SCROLLED_CLASSES, HEADER_TOP_CLASSES } from "../constants";

export function SiteHeader() {
  const isScrolled = useScrolledState();
  const location = useLocation();

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname !== "/") {
      return;
    }
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={[HEADER_BASE_CLASSES, isScrolled ? HEADER_SCROLLED_CLASSES : HEADER_TOP_CLASSES].join(" ")}>
      <Link to="/" className="text-base font-extrabold tracking-[0.02em] text-[#24183a] no-underline">
        RJP Innovations
      </Link>
      <nav className="flex gap-4 max-[640px]:gap-2.5">
        <Link
          to="/portfolio"
          className="text-sm font-semibold text-[#5d4e79] no-underline max-[640px]:text-[0.88rem]"
        >
          Portfolio
        </Link>
        <a
          href="#contact"
          onClick={scrollToContact}
          className="text-sm font-semibold text-[#5d4e79] no-underline max-[640px]:text-[0.88rem]"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
