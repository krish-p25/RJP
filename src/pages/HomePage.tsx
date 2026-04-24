import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { imageManifest } from "../imageManifest";
import { ABOUT_PARAGRAPHS, CAROUSEL_INTERVAL_MS, LOGO_RESTORE_DELAY_MS, SERVICES } from "../constants";
import { getProjectCoverImage, getProjectImageCount } from "../utils/projectHelpers";

export function HomePage() {
  const location = useLocation();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [glareStage, setGlareStage] = useState<"idle" | "section" | "button">("idle");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isIntroLogoVisible, setIsIntroLogoVisible] = useState(true);
  const logoRestoreTimerRef = useRef<number | null>(null);
  const autoAdvanceIntervalRef = useRef<number | null>(null);

  const projectGroups = useMemo(() => imageManifest.projects, []);

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
    if (location.hash === "#contact") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        setTimeout(() => contactSection.scrollIntoView({ behavior: "smooth" }), 100);
        // Glare sequence: section first, then button after section glare completes
        const t1 = window.setTimeout(() => setGlareStage("section"), 800);
        const t2 = window.setTimeout(() => setGlareStage("button"), 1700);
        const t3 = window.setTimeout(() => setGlareStage("idle"), 2550);
        return () => {
          window.clearTimeout(t1);
          window.clearTimeout(t2);
          window.clearTimeout(t3);
        };
      }
    }
  }, [location.hash]);

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
      {/* Full-screen carousel hero */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden">
        {carouselImages.map((src, index) => {
          const animations = ["ken-burns-zoom-in", "ken-burns-pan-right", "ken-burns-zoom-out", "ken-burns-pan-left"];
          const animationClass = animations[index % animations.length];

          return (
            <img
              key={src}
              src={src}
              alt="Featured completed renovation project by RJP Innovations"
              className={[
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                animationClass,
                index === carouselIndex ? "opacity-100" : "opacity-0"
              ].join(" ")}
            />
          );
        })}

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
          <div className="grid w-[min(220px,62vw)] place-items-center sm:w-[min(320px,78vw)]">
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

      {/* Main content — white card floats below hero with breathing room */}
      <main className="pb-12">
        {/* Intro card */}
        <div className="mx-auto w-[min(1100px,calc(100%-2rem))] pt-5 max-[640px]:w-[calc(100%-1rem)] max-[640px]:pt-4">
          <section className="reveal rounded-[20px] border border-[rgba(108,63,225,0.08)] bg-white p-7 shadow-[0_-4px_40px_rgba(79,42,183,0.09),0_8px_32px_rgba(79,42,183,0.08)] max-[640px]:p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4f2ab7]">
              Building Contractor, Renovation & Property Development
            </p>
            <h1 className="mb-4 max-w-[20ch] font-fraunces text-[clamp(2rem,5vw,3.8rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[#24183a]">
              <span className="block">Built Perfect.</span>
              <span className="block">Finished Better.</span>
            </h1>

            <div className="max-w-[66ch] lg:max-w-full">
              <div
                className={[
                  "relative overflow-hidden text-[clamp(1rem,1.7vw,1.2rem)] font-light text-[#5d4e79] transition-[max-height] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
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
                className="mt-2 cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-[#4f2ab7] transition-opacity duration-200 hover:opacity-75"
                onClick={() => setIsAboutExpanded((current) => !current)}
                aria-expanded={isAboutExpanded}
              >
                {isAboutExpanded ? "Read less" : "Read more"}
              </button>
            </div>

            <div className="my-6 flex flex-wrap gap-3">
              <Link
                to="/portfolio"
                className="inline-block rounded-lg bg-[#6c3fe1] px-5 py-3 text-sm font-semibold text-white no-underline transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f2ab7]"
              >
                View Portfolio
              </Link>
              <a
                href="#contact"
                className="inline-block rounded-lg border border-[#24183a24] px-5 py-3 text-sm font-medium text-[#24183a] no-underline transition-transform duration-200 hover:-translate-y-px"
              >
                Contact Us
              </a>
            </div>
          </section>
        </div>

        {/* Services + Contact */}
        <div className="mx-auto w-[min(1100px,calc(100%-2rem))] max-[640px]:w-[calc(100%-1rem)]">
          {/* ── Projects bento showcase ── */}
          <section className="reveal mt-0 pt-[clamp(2rem,5vw,4rem)]">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4f2ab7]">
                  Featured Work
                </p>
                <h2 className="font-fraunces text-[clamp(1.4rem,2.8vw,2.2rem)] font-bold tracking-[-0.01em] text-[#24183a]">
                  Recent Projects
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="flex items-center gap-1 text-sm font-semibold text-[#4f2ab7] no-underline opacity-80 transition-opacity duration-200 hover:opacity-100"
              >
                View all <span aria-hidden="true" className="text-base">→</span>
              </Link>
            </div>

            {/* Asymmetric bento grid
                Desktop (3 col, 2 row):
                  [Ealing — col-span-2] [Hammersmith — row-span-2]
                  [Maida Vale]          [Mayo Court]
                Mobile: 2-col equal grid                            */}
            <div className="grid grid-cols-2 gap-3 lg:h-[520px] lg:grid-cols-3 lg:grid-rows-2">
              {projectGroups.map((project, index) => {
                const thumbnail = getProjectCoverImage(project);
                const count = getProjectImageCount(project);

                const bentoClass = [
                  index === 0 ? "lg:col-span-2" : "",
                  index === 1 ? "lg:row-span-2" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Link
                    key={project.name}
                    to={`/portfolio/${encodeURIComponent(project.name)}`}
                    className={[
                      "group relative block aspect-[4/3] overflow-hidden rounded-[16px] no-underline lg:aspect-auto",
                      bentoClass
                    ].join(" ")}
                  >
                    {/* Photo */}
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={`${project.name} renovation project`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                    )}

                    {/* Gradient overlay — lifts slightly on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,6,24,0.86)] via-[rgba(12,6,24,0.26)] to-[rgba(12,6,24,0.08)] transition-all duration-500 group-hover:from-[rgba(12,6,24,0.65)] group-hover:via-[rgba(12,6,24,0.16)]" />

                    {/* Corner bracket — top right */}
                    <div className="absolute right-3 top-3 h-[14px] w-[14px] border-r border-t border-white/30 transition-colors duration-300 group-hover:border-[#b69bff]/80" />
                    {/* Corner bracket — bottom left */}
                    <div className="absolute bottom-[4.5rem] left-3 h-[14px] w-[14px] border-b border-l border-white/30 transition-colors duration-300 group-hover:border-[#b69bff]/80" />

                    {/* Photo count badge — top left */}
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-sm">
                      <span className="text-[10px] font-medium tracking-[0.08em] text-white/70">
                        {count} photos
                      </span>
                    </div>

                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-fraunces text-[clamp(0.95rem,1.6vw,1.15rem)] font-semibold leading-snug text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                        {project.name}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="translate-y-2 text-[11px] font-medium tracking-[0.06em] text-white/55 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                          View project
                        </span>
                        <span className="translate-x-1 text-sm text-white/70 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100">
                          →
                        </span>
                      </div>
                    </div>

                    {/* Inset ring on hover */}
                    <div className="absolute inset-0 rounded-[16px] ring-1 ring-inset ring-transparent transition-all duration-300 group-hover:ring-[rgba(108,63,225,0.45)]" />
                  </Link>
                );
              })}
            </div>
          </section>

          <section id="process" className="reveal mt-0 pt-[clamp(2rem,5vw,4rem)]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4f2ab7]">
                Construction & Renovation Services
              </p>
              <h2 className="mb-6 font-fraunces text-[clamp(1.4rem,2.8vw,2.2rem)] font-bold tracking-[-0.01em] text-[#24183a]">
                Residential Building Services We Deliver
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <article
                  key={service.number}
                  className="rounded-[14px] border border-[rgba(108,63,225,0.1)] bg-white p-5 shadow-[0_2px_16px_rgba(79,42,183,0.08)]"
                >
                  <span className="font-fraunces text-sm font-light italic text-[#6c3fe1]">{service.number}</span>
                  <h3 className="mb-2 mt-1 font-fraunces text-xl font-semibold leading-[1.2] text-[#24183a]">{service.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-[#5d4e79]">{service.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="reveal pt-[clamp(2rem,5vw,4rem)]">
            <div className="relative overflow-hidden rounded-[16px] border border-[rgba(108,63,225,0.1)] bg-white p-[clamp(1.4rem,4vw,2rem)] shadow-[0_2px_16px_rgba(79,42,183,0.08)] sm:flex sm:items-center sm:justify-between sm:gap-8">
              {glareStage === "section" && <div aria-hidden="true" className="glare-section" />}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4f2ab7]">Let&apos;s Build</p>
                <h2 className="mb-3 font-fraunces text-[clamp(1.4rem,2.8vw,2rem)] font-bold tracking-[-0.01em] text-[#24183a]">
                  Plan Your Next Development With RJP Innovations
                </h2>
                <p className="mb-5 max-w-[54ch] text-sm font-light text-[#5d4e79] sm:mb-0">
                  Share your project requirements and we&apos;ll guide you from concept to completion.
                </p>
              </div>
              <a
                className="relative inline-block shrink-0 overflow-hidden rounded-lg bg-[#6c3fe1] px-5 py-3 text-sm font-semibold text-white no-underline transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f2ab7]"
                href="https://api.whatsapp.com/send/?phone=447957306323&text=Hi%2C%20I%27m%20looking%20for%20a%20quote%20for%20some%20work%20on%20my%20property.%20Could%20you%20let%20me%20know%20if%20you%27re%20available%20to%20discuss%3F&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
              >
                {glareStage === "button" && <span aria-hidden="true" className="glare-button" />}
                Message on WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
