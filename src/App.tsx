import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { imageManifest } from "./imageManifest";

type Route = "home" | "portfolio";

type GalleryImage = {
  src: string;
  caption: string;
  alt: string;
};

type ProjectSection = {
  name: string;
  images: string[];
};

type ProjectGroup = {
  name: string;
  images: string[];
  sections?: ProjectSection[];
};

type ServiceItem = {
  number: string;
  title: string;
  description: string;
};

const ABOUT_PARAGRAPHS = [
  "We believe great construction is about more than building - it's about creating spaces that improve the way people live and work. Based in London, we specialise in high-quality renovation, refurbishment, and building completion services, helping homeowners, landlords, and developers transform properties with confidence.",
  "Our team is passionate about delivering projects that combine craftsmanship, thoughtful design, and lasting quality. From the earliest planning stages through to the final finishes, we take pride in ensuring every detail is completed with care and professionalism. Whether it's a full property renovation, an interior refurbishment, or external improvements, we approach every project with the same commitment to excellence.",
  "As a member of the Federation of Master Builders, we are proud to be recognised as part of one of the UK's most respected construction organisations. This reflects our dedication to maintaining high industry standards, delivering reliable workmanship, and providing a service our clients can trust.",
  "We understand that every property project is a significant investment. That's why we focus on clear communication, dependable timelines, and results that genuinely enhance both the value and functionality of a space. Our goal is always to exceed expectations and leave our clients with a finished project they can be proud of."
] as const;

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Home Renovation Planning",
    description:
      "We start with a full site review, define your renovation goals, and convert them into a clear scope of works. This includes layout planning, budget alignment, timeline forecasting, and practical build sequencing to reduce delays."
  },
  {
    number: "02",
    title: "Structural Building Works",
    description:
      "Our team delivers load-bearing wall alterations, steel installations, openings, and core structural modifications. Every stage is coordinated with engineers and building control requirements to ensure safety, compliance, and durability."
  },
  {
    number: "03",
    title: "Interior Refurbishment",
    description:
      "We upgrade kitchens, bathrooms, living spaces, and bedrooms with high-quality materials and careful craftsmanship. From walls and ceilings to flooring and joinery, we focus on both aesthetics and long-term performance."
  },
  {
    number: "04",
    title: "Electrical & Plumbing Integration",
    description:
      "We coordinate certified electrical and plumbing works as part of the full build programme. This includes first-fix and second-fix services, ensuring utilities are safely installed, neatly finished, and aligned with your design."
  },
  {
    number: "05",
    title: "External Improvements",
    description:
      "We deliver facade repairs, rendering, painting, drainage improvements, and outdoor upgrades that protect and elevate your property. The focus is weather resilience, visual quality, and practical maintenance over time."
  },
  {
    number: "06",
    title: "Project Management & Client Updates",
    description:
      "From procurement and scheduling to on-site supervision, we manage the process end to end. Regular progress updates, milestone tracking, and transparent communication keep you informed and confident throughout the project."
  }
];

const HEADER_BASE_CLASSES =
  "fixed left-1/2 z-20 flex -translate-x-1/2 items-center justify-between border backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

const HEADER_SCROLLED_CLASSES =
  "top-3 w-[calc(100%-1.4rem)] max-w-[1040px] rounded-full border-[#4f2ab733] bg-white/65 px-4 py-3 shadow-[0_14px_35px_rgba(30,14,59,0.16)] md:px-6 lg:px-10 max-[640px]:top-[0.55rem] max-[640px]:w-[calc(100%-0.8rem)]";

const HEADER_TOP_CLASSES =
  "top-0 w-full max-w-[100%] rounded-none border-[#24183a00] border-b-[#24183a24] bg-[#f8f6ffbf] px-4 py-4 shadow-none md:px-6 lg:px-12";

const CAROUSEL_INTERVAL_MS = 3800;
const LOGO_RESTORE_DELAY_MS = 2800;
const ROUTE_FADE_MS = 220;

function getRouteFromHash(): Route {
  return window.location.hash === "#/portfolio" ? "portfolio" : "home";
}

function mapImagesToGallery(images: string[], projectName: string, label?: string): GalleryImage[] {
  return images.map((src, index) => {
    const sequence = String(index + 1).padStart(2, "0");
    const prefix = label ? `${projectName} - ${label}` : projectName;
    return {
      src,
      caption: `${prefix} - Image ${sequence}`,
      alt: `${prefix} completed project image ${sequence} by RJP Innovations`
    };
  });
}

function getProjectCoverImage(project: ProjectGroup): string | null {
  const thumbnailImage = project.images.find((src) => /\/thumbnail\.(jpg|jpeg|png|webp|avif)$/i.test(src));
  if (thumbnailImage) {
    return thumbnailImage;
  }

  const directOne = project.images.find((src) => /\/1\.[^/]+$/i.test(src));
  if (directOne) {
    return directOne;
  }
  if (project.images.length > 0) {
    return project.images[0];
  }

  if (!project.sections || project.sections.length === 0) {
    return null;
  }

  const afterSection = project.sections.find((section) => section.name.toLowerCase() === "after");
  const beforeSection = project.sections.find((section) => section.name.toLowerCase() === "before");
  const orderedSections = [afterSection, beforeSection, ...project.sections].filter(
    (section, index, array): section is ProjectSection => Boolean(section) && array.indexOf(section) === index
  );

  for (const section of orderedSections) {
    const oneImage = section.images.find((src) => /\/1\.[^/]+$/i.test(src));
    if (oneImage) {
      return oneImage;
    }
  }

  return orderedSections[0]?.images[0] ?? null;
}

function getProjectImageCount(project: ProjectGroup): number {
  const directCount = project.images.length;
  const sectionCount = (project.sections ?? []).reduce((total, section) => total + section.images.length, 0);
  return directCount + sectionCount;
}

function useScrolledState() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isScrolled;
}

function SiteHeader({ route }: { route: Route }) {
  const isScrolled = useScrolledState();

  return (
    <header className={[HEADER_BASE_CLASSES, isScrolled ? HEADER_SCROLLED_CLASSES : HEADER_TOP_CLASSES].join(" ")}>
      <a href="#/" className="text-base font-extrabold tracking-[0.02em] text-[#24183a] no-underline">
        RJP Innovations
      </a>
      <nav className="flex gap-4 max-[640px]:gap-2.5">
        <a
          href={route === "portfolio" ? "#/portfolio" : "#/portfolio"}
          className="text-sm font-semibold text-[#5d4e79] no-underline max-[640px]:text-[0.88rem]"
        >
          Portfolio
        </a>
        <a
          href="#contact"
          className="text-sm font-semibold text-[#5d4e79] no-underline max-[640px]:text-[0.88rem]"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

function HomePage() {
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
      }

      logoRestoreTimerRef.current = window.setTimeout(() => {
        setIsIntroLogoVisible(true);
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
      }
      if (autoAdvanceIntervalRef.current !== null) {
        window.clearInterval(autoAdvanceIntervalRef.current);
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
          <img
            src="/logos/logo.png"
            alt="RJP Innovations logo"
            className={[
              "w-[min(220px,62vw)] rounded-[22px] transition-opacity duration-500 sm:w-[min(320px,78vw)]",
              isIntroLogoVisible
                ? "opacity-100 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                : "opacity-0 sm:drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] max-[640px]:drop-shadow-none"
            ].join(" ")}
          />
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
            <a
              href="#/portfolio"
              className="inline-block rounded-full bg-[#6c3fe1] px-5 py-3 text-sm font-bold text-white no-underline transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f2ab7]"
            >
              View Portfolio
            </a>
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

function PortfolioPage() {
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [sectionOpenState, setSectionOpenState] = useState<Record<string, boolean>>({});

  const projectGroups = useMemo<ProjectGroup[]>(() => imageManifest.projects, []);
  const selectedProject = useMemo(
    () => projectGroups.find((project) => project.name === selectedProjectName) ?? null,
    [projectGroups, selectedProjectName]
  );
  const selectedProjectImages = useMemo(
    () => (selectedProject ? mapImagesToGallery(selectedProject.images, selectedProject.name) : []),
    [selectedProject]
  );
  const selectedProjectSections = useMemo(() => {
    if (!selectedProject?.sections || selectedProject.sections.length === 0) {
      return [];
    }

    const beforeSection = selectedProject.sections.find((section) => section.name.toLowerCase() === "before");
    const afterSection = selectedProject.sections.find((section) => section.name.toLowerCase() === "after");
    const remainingSections = selectedProject.sections.filter((section) => {
      const lower = section.name.toLowerCase();
      return lower !== "before" && lower !== "after";
    });

    return [beforeSection, afterSection, ...remainingSections].filter(
      (section): section is ProjectSection => Boolean(section)
    );
  }, [selectedProject]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setSectionOpenState({});
      return;
    }

    const nextState: Record<string, boolean> = {};
    const hasBeforeAfter =
      selectedProjectSections.some((section) => section.name.toLowerCase() === "before") &&
      selectedProjectSections.some((section) => section.name.toLowerCase() === "after");

    selectedProjectSections.forEach((section) => {
      const key = section.name.toLowerCase();
      if (hasBeforeAfter) {
        if (key === "before") {
          nextState[key] = false;
        } else if (key === "after") {
          nextState[key] = true;
        } else {
          nextState[key] = true;
        }
      } else {
        nextState[key] = true;
      }
    });

    setSectionOpenState(nextState);
  }, [selectedProject, selectedProjectSections]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  return (
    <>
      <main className="mx-auto w-[min(1100px,calc(100%-2rem))] pb-12 pt-[6.2rem] max-[640px]:w-[calc(100%-1rem)] max-[640px]:pt-[5.4rem]">
        <section className="pt-2">
          {!selectedProject ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">Portfolio</p>
                  <h1 className="mb-0 text-[clamp(1.5rem,3vw,2.3rem)] font-bold text-[#24183a]">Built Work Gallery</h1>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 px-1 pb-3 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                {projectGroups.map((project) => (
                  <button
                    key={project.name}
                    type="button"
                    className="cursor-pointer overflow-hidden rounded-[14px] border border-[#24183a24] bg-white text-left shadow-[0_8px_24px_rgba(9,21,15,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(9,21,15,0.2)]"
                    onClick={() => setSelectedProjectName(project.name)}
                  >
                    {getProjectCoverImage(project) && (
                      <img
                        src={getProjectCoverImage(project) ?? undefined}
                        alt={`${project.name} project preview`}
                        className="block aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="m-0 text-base font-bold text-[#24183a]">{project.name}</h3>
                      <p className="mt-1 text-sm text-[#5d4e79]">
                        {getProjectImageCount(project)} {getProjectImageCount(project) === 1 ? "image" : "images"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">Project</p>
                  <h1 className="mb-0 text-[clamp(1.5rem,3vw,2.3rem)] font-bold text-[#24183a]">{selectedProject.name}</h1>
                </div>
                <button
                  type="button"
                  className="cursor-pointer rounded-full border border-[#24183a24] bg-white px-4 py-2 text-sm font-bold text-[#24183a] transition-transform duration-200 hover:-translate-y-px"
                  onClick={() => setSelectedProjectName("")}
                >
                  Back to projects
                </button>
              </div>

              <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 px-1 pb-3 pt-3 max-[640px]:grid-cols-2 max-[640px]:gap-[0.7rem]">
                {selectedProjectSections.length > 0 ? (
                  <div className="col-span-full space-y-3">
                    {selectedProjectSections.map((section) => {
                      const sectionKey = section.name.toLowerCase();
                      const hasBeforeAfter =
                        selectedProjectSections.some((item) => item.name.toLowerCase() === "before") &&
                        selectedProjectSections.some((item) => item.name.toLowerCase() === "after");
                      const isOpen = sectionOpenState[sectionKey] ?? (hasBeforeAfter ? sectionKey !== "before" : true);
                      const sectionImages = mapImagesToGallery(section.images, selectedProject.name, section.name);

                      return (
                        <div key={section.name} className="overflow-hidden rounded-[14px] border border-[#24183a24] bg-white">
                          <button
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-between border-0 bg-[#f5f1ff] px-4 py-3 text-left"
                            onClick={() =>
                              setSectionOpenState((current) => ({
                                ...current,
                                [sectionKey]: !isOpen
                              }))
                            }
                            aria-expanded={isOpen}
                          >
                            <span className="text-base font-bold capitalize text-[#24183a]">{section.name}</span>
                            <span className="text-xl font-bold leading-none text-[#4f2ab7]">{isOpen ? "-" : "+"}</span>
                          </button>
                          <div
                            className={[
                              "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            ].join(" ")}
                          >
                            <div
                              className={[
                                "min-h-0 overflow-hidden transition-[padding] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                                isOpen ? "p-3" : "p-0"
                              ].join(" ")}
                            >
                              <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 max-[640px]:grid-cols-2 max-[640px]:gap-[0.7rem]">
                                {sectionImages.map((image) => (
                                  <figure
                                    className="m-0 cursor-pointer overflow-hidden rounded-[14px] border border-[#24183a24] bg-white shadow-[0_8px_24px_rgba(9,21,15,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(9,21,15,0.2)]"
                                    key={image.src}
                                    onClick={() => setLightbox(image)}
                                  >
                                    <img
                                      loading="lazy"
                                      src={image.src}
                                      alt={image.alt}
                                      className="block aspect-[4/3] w-full object-cover"
                                    />
                                    <figcaption className="px-3 py-3 text-[0.92rem] text-[#5d4e79]">{image.caption}</figcaption>
                                  </figure>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  selectedProjectImages.map((image) => (
                    <figure
                      className="m-0 cursor-pointer overflow-hidden rounded-[14px] border border-[#24183a24] bg-white shadow-[0_8px_24px_rgba(9,21,15,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(9,21,15,0.2)]"
                      key={image.src}
                      onClick={() => setLightbox(image)}
                    >
                      <img loading="lazy" src={image.src} alt={image.alt} className="block aspect-[4/3] w-full object-cover" />
                      <figcaption className="px-3 py-3 text-[0.92rem] text-[#5d4e79]">{image.caption}</figcaption>
                    </figure>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <div
        className={[
          "fixed inset-0 z-40 grid place-items-center bg-[rgba(6,9,8,0.86)] p-4 transition-opacity duration-200",
          lightbox ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
        aria-hidden={lightbox ? "false" : "true"}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setLightbox(null);
          }
        }}
      >
        <button
          className="absolute right-5 top-4 cursor-pointer border-0 bg-transparent text-5xl text-white"
          aria-label="Close image"
          onClick={() => setLightbox(null)}
        >
          &times;
        </button>
        {lightbox && (
          <>
            <img
              src={lightbox.src}
              alt={lightbox.caption}
              className="max-h-[78vh] max-w-[min(980px,95vw)] rounded-[14px] shadow-[0_24px_55px_rgba(0,0,0,0.5)]"
            />
            <p className="mt-2 text-center text-[#e7ece8]">{lightbox.caption}</p>
          </>
        )}
      </div>
    </>
  );
}
function App() {
  const [route, setRoute] = useState<Route>(getRouteFromHash());
  const [isRouteVisible, setIsRouteVisible] = useState(true);
  const routeRef = useRef<Route>(route);
  const routeSwapTimerRef = useRef<number | null>(null);
  const routeFadeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    const onHashChange = () => {
      const nextRoute = getRouteFromHash();
      if (nextRoute === routeRef.current) {
        return;
      }

      setIsRouteVisible(false);

      if (routeSwapTimerRef.current !== null) {
        window.clearTimeout(routeSwapTimerRef.current);
      }
      if (routeFadeFrameRef.current !== null) {
        window.cancelAnimationFrame(routeFadeFrameRef.current);
      }

      routeSwapTimerRef.current = window.setTimeout(() => {
        setRoute(nextRoute);
        window.scrollTo({ top: 0, behavior: "auto" });
        routeFadeFrameRef.current = window.requestAnimationFrame(() => {
          setIsRouteVisible(true);
        });
      }, ROUTE_FADE_MS);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(
    () => () => {
      if (routeSwapTimerRef.current !== null) {
        window.clearTimeout(routeSwapTimerRef.current);
      }
      if (routeFadeFrameRef.current !== null) {
        window.cancelAnimationFrame(routeFadeFrameRef.current);
      }
    },
    []
  );

  return (
    <>
      <Analytics />
      <div className="fixed -left-20 top-24 -z-10 h-80 w-80 rounded-full bg-[#b69bff] opacity-35 blur-[70px]" />
      <div className="fixed -right-28 -bottom-10 -z-10 h-[360px] w-[360px] rounded-full bg-[#d2beff] opacity-35 blur-[70px]" />
      <SiteHeader route={route} />
      <div
        className={[
          "transition-opacity duration-[220ms]",
          isRouteVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
      >
        {route === "portfolio" ? <PortfolioPage /> : <HomePage />}
      </div>
    </>
  );
}

export default App;
