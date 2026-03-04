import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { imageManifest } from "../imageManifest";
import { ABOUT_PARAGRAPHS, CAROUSEL_INTERVAL_MS, LOGO_RESTORE_DELAY_MS, SERVICES } from "../constants";

export function HomePage() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isIntroLogoVisible, setIsIntroLogoVisible] = useState(true);
  const logoRestoreTimerRef = useRef<number | null>(null);
  const autoAdvanceIntervalRef = useRef<number | null>(null);

  const carouselImages = useMemo(() => {
    if (imageManifest.carousel.length > 0) {
      return imageManifest.carousel;
    }
    if (imageManifest.finishes.length > 0) {
      return imageManifest.finishes;
    }
    return imageManifest.works;
  }, []);

  const restartAutoAdvance = useCallback(() => {
    if (autoAdvanceIntervalRef.current !== null) {
      window.clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
    }

    if (carouselImages.length < 2) {
      return;
    }

    autoAdvanceIntervalRef.current = window.setInterval(() => {
      setCarouselIndex((current) => (current + 1) % carouselImages.length);
    }, CAROUSEL_INTERVAL_MS);
  }, [carouselImages.length]);

  const cycleCarousel = useCallback(
    (direction: 1 | -1) => {
      if (carouselImages.length === 0) {
        return;
      }

      setCarouselIndex((current) => (current + direction + carouselImages.length) % carouselImages.length);
      restartAutoAdvance();
      setIsIntroLogoVisible(false);

      if (logoRestoreTimerRef.current !== null) {
        window.clearTimeout(logoRestoreTimerRef.current);
        logoRestoreTimerRef.current = null;
      }

      logoRestoreTimerRef.current = window.setTimeout(() => {
        setIsIntroLogoVisible(true);
        logoRestoreTimerRef.current = null;
      }, LOGO_RESTORE_DELAY_MS);
    },
    [carouselImages.length, restartAutoAdvance]
  );

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    restartAutoAdvance();
    return () => {
      if (autoAdvanceIntervalRef.current !== null) {
        window.clearInterval(autoAdvanceIntervalRef.current);
        autoAdvanceIntervalRef.current = null;
      }
    };
  }, [restartAutoAdvance]);

  useEffect(
    () => () => {
      if (logoRestoreTimerRef.current !== null) {
        window.clearTimeout(logoRestoreTimerRef.current);
        logoRestoreTimerRef.current = null;
      }
      if (autoAdvanceIntervalRef.current !== null) {
        window.clearInterval(autoAdvanceIntervalRef.current);
        autoAdvanceIntervalRef.current = null;
      }
    },
    []
  );

  return (
    <>
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        {carouselImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="Featured completed renovation project by RJP Innovations"
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
              index === carouselIndex ? "opacity-100" : "opacity-0"
            ].join(" ")}
          />
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,26,0.46)_0%,rgba(13,8,26,0.56)_48%,rgba(13,8,26,0.72)_100%)]" />

        <button
          type="button"
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-[rgba(14,12,26,0.42)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-1/2 hover:scale-[1.04] hover:border-white/75 hover:bg-[rgba(14,12,26,0.62)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,12,26,0.55)] sm:left-4 sm:h-12 sm:w-12"
          onClick={() => cycleCarousel(-1)}
        >
          <span aria-hidden="true" className="text-[1.2rem] leading-none sm:text-[1.6rem]">
            &#8249;
          </span>
        </button>

        <button
          type="button"
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-[rgba(14,12,26,0.42)] text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-1/2 hover:scale-[1.04] hover:border-white/75 hover:bg-[rgba(14,12,26,0.62)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(14,12,26,0.55)] sm:right-4 sm:h-12 sm:w-12"
          onClick={() => cycleCarousel(1)}
        >
          <span aria-hidden="true" className="text-[1.2rem] leading-none sm:text-[1.6rem]">
            &#8250;
          </span>
        </button>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="grid w-[min(220px,62vw)] place-items-center  sm:w-[min(320px,78vw)]">
            <img
              src="/logos/logo.png"
              alt="RJP Innovations logo"
              className={[
                "h-full w-full rounded-[22px] object-contain transition-opacity duration-500",
                isIntroLogoVisible
                  ? "opacity-100 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                  : "opacity-0 sm:drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] max-[640px]:drop-shadow-none"
              ].join(" ")}
            />
          </div>
          <p
            className={[
              "mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 transition-opacity duration-500",
              isIntroLogoVisible ? "opacity-100" : "opacity-0"
            ].join(" ")}
          >
            Scroll to explore
          </p>
        </div>
      </section>

      <main className="mx-auto w-[min(1100px,calc(100%-2rem))] pb-12 pt-[clamp(3.8rem,5.8vw,4.4rem)] max-[640px]:w-[calc(100%-1rem)] max-[640px]:pt-[3.4rem]">
        <section className="reveal pb-0 pt-[clamp(3rem,7vw,6rem)] max-[640px]:pt-[1.1rem]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">
            Building Contractor, Renovation & Property Development
          </p>
          <h1 className="mb-4 max-w-[20ch] text-[clamp(2rem,5vw,3.8rem)] font-extrabold leading-[1.08] text-[#24183a]">
            <span className="block">Built Perfect.</span>
            <span className="block">Finished Better.</span>
          </h1>

          <div className="max-w-[66ch] lg:max-w-full">
            <div
              className={[
                "relative overflow-hidden text-[clamp(1rem,1.7vw,1.2rem)] text-[#5d4e79] transition-[max-height] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                isAboutExpanded ? "max-h-[120rem]" : "max-h-[10.5rem] about-collapse-mask"
              ].join(" ")}
            >
              {ABOUT_PARAGRAPHS.map((paragraph, index) => (
                <p key={paragraph} className={index === ABOUT_PARAGRAPHS.length - 1 ? "mb-0" : "mb-4"}>
                  {paragraph}
                </p>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 cursor-pointer border-0 bg-transparent p-0 text-sm font-bold text-[#4f2ab7] transition-opacity duration-200 hover:opacity-75"
              onClick={() => setIsAboutExpanded((current) => !current)}
              aria-expanded={isAboutExpanded}
            >
              {isAboutExpanded ? "Read less" : "Read more"}
            </button>
          </div>

          <div className="my-6 flex flex-wrap gap-3">
            <Link
              to="/portfolio"
              className="inline-block rounded-full bg-[#6c3fe1] px-5 py-3 text-sm font-bold text-white no-underline transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f2ab7]"
            >
              View Portfolio
            </Link>
            <a
              href="#contact"
              className="inline-block rounded-full border border-[#24183a24] px-5 py-3 text-sm font-bold text-[#24183a] no-underline transition-transform duration-200 hover:-translate-y-px"
            >
              Contact Us
            </a>
          </div>
        </section>

        <section id="process" className="reveal mt-0 pt-[clamp(2rem,5vw,4rem)]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">
              Construction & Renovation Services
            </p>
            <h2 className="mb-4 text-[clamp(1.4rem,2.8vw,2.2rem)] font-bold text-[#24183a]">
              Residential Building Services We Deliver
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <article
                key={service.number}
                className="rounded-[18px] border border-[#24183a24] bg-white p-5 shadow-[0_24px_60px_rgba(29,14,56,0.14)]"
              >
                <span className="text-sm font-extrabold text-[#4f2ab7]">{service.number}</span>
                <h3 className="mb-2 mt-1 text-xl font-bold text-[#24183a]">{service.title}</h3>
                <p className="text-[#5d4e79]">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="reveal pt-[clamp(2rem,5vw,4rem)]">
          <div className="rounded-[18px] border border-[#24183a24] bg-gradient-to-br from-white to-[#f2ecff] p-[clamp(1.1rem,4vw,2rem)]">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">Let&apos;s Build</p>
            <h2 className="mb-4 text-[clamp(1.4rem,2.8vw,2.2rem)] font-bold text-[#24183a]">
              Plan Your Next Development With RJP Innovations
            </h2>
            <p className="mb-5 max-w-[54ch] text-[#5d4e79]">
              Share your project requirements and we&apos;ll guide you from concept to completion.
            </p>
            <a
              className="inline-block rounded-full bg-[#6c3fe1] px-5 py-3 text-sm font-bold text-white no-underline transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f2ab7]"
              href="https://api.whatsapp.com/send/?phone=447957306323&text=Hi%2C%20I%27m%20looking%20for%20a%20quote%20for%20some%20work%20on%20my%20property.%20Could%20you%20let%20me%20know%20if%20you%27re%20available%20to%20discuss%3F&type=phone_number&app_absent=0"
              target="_blank"
              rel="noreferrer"
            >
              Message on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
