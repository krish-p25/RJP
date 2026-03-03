import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { imageManifest } from "./imageManifest";

type Category = "finishes" | "works";

type GalleryImage = {
  src: string;
  caption: string;
  alt: string;
};

function mapToGallery(list: string[], category: Category): GalleryImage[] {
  return list.map((src, index) => ({
    src,
    caption:
      category === "finishes"
        ? `Finished Project ${String(index + 1).padStart(2, "0")}`
        : `Construction Work ${String(index + 1).padStart(2, "0")}`,
    alt:
      category === "finishes"
        ? `Completed property renovation and finishing project ${String(index + 1).padStart(2, "0")} by RJP Innovations`
        : `Building and renovation construction process image ${String(index + 1).padStart(2, "0")} by RJP Innovations`
  }));
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>("finishes");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [galleryHeight, setGalleryHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const finishesRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);

  const finishImages = useMemo(() => mapToGallery(imageManifest.finishes, "finishes"), []);
  const workImages = useMemo(() => mapToGallery(imageManifest.works, "works"), []);

  const measureGalleryHeight = useCallback(() => {
    const activePanel = activeCategory === "finishes" ? finishesRef.current : worksRef.current;
    if (activePanel) {
      setGalleryHeight(activePanel.scrollHeight);
    }
  }, [activeCategory]);

  const handleImageLoad = useCallback(() => {
    measureGalleryHeight();
  }, [measureGalleryHeight]);

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
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useLayoutEffect(() => {
    measureGalleryHeight();
  }, [measureGalleryHeight, finishImages.length, workImages.length]);

  useEffect(() => {
    const onResize = () => measureGalleryHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureGalleryHeight]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Analytics />
      <div className="fixed -left-20 top-24 -z-10 h-80 w-80 rounded-full bg-[#b69bff] opacity-35 blur-[70px]" />
      <div className="fixed -right-28 -bottom-10 -z-10 h-[360px] w-[360px] rounded-full bg-[#d2beff] opacity-35 blur-[70px]" />

      <header
        className={[
          "fixed left-1/2 z-20 flex -translate-x-1/2 items-center justify-between border backdrop-blur-md transition-[top,width,padding,border-radius,background-color,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          isScrolled
            ? "top-3 w-[calc(100%-1.4rem)] max-w-[1040px] rounded-full border-[#4f2ab733] bg-white/65 px-4 py-3 shadow-[0_14px_35px_rgba(30,14,59,0.16)] md:px-6 lg:px-10 max-[640px]:top-[0.55rem] max-[640px]:w-[calc(100%-0.8rem)]"
            : "top-0 w-full max-w-none rounded-none border-x-0 border-t-0 border-b-[#24183a24] bg-[#f8f6ffbf] px-4 py-4 shadow-none md:px-6 lg:px-12"
        ].join(" ")}
      >
        <a href="#" className="text-base font-extrabold tracking-[0.02em] text-[#24183a] no-underline">
          RJP Innovations
        </a>
        <nav className="flex gap-4 max-[640px]:gap-2.5">
          <a href="#portfolio" className="text-sm font-semibold text-[#5d4e79] no-underline max-[640px]:text-[0.88rem]">
            Portfolio
          </a>
          <a href="#contact" className="text-sm font-semibold text-[#5d4e79] no-underline max-[640px]:text-[0.88rem]">
            Contact
          </a>
        </nav>
      </header>

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
              <p className="mb-4">
                We believe great construction is about more than building - it&apos;s about creating spaces that
                improve the way people live and work. Based in London, we specialise in high-quality renovation,
                refurbishment, and building completion services, helping homeowners, landlords, and developers
                transform properties with confidence.
              </p>
              <p className="mb-4">
                Our team is passionate about delivering projects that combine craftsmanship, thoughtful design, and
                lasting quality. From the earliest planning stages through to the final finishes, we take pride in
                ensuring every detail is completed with care and professionalism. Whether it&apos;s a full property
                renovation, an interior refurbishment, or external improvements, we approach every project with the
                same commitment to excellence.
              </p>
              <p className="mb-4">
                As a member of the Federation of Master Builders, we are proud to be recognised as part of one of the
                UK&apos;s most respected construction organisations. This reflects our dedication to maintaining high
                industry standards, delivering reliable workmanship, and providing a service our clients can trust.
              </p>
              <p className="mb-0">
                We understand that every property project is a significant investment. That&apos;s why we focus on
                clear communication, dependable timelines, and results that genuinely enhance both the value and
                functionality of a space. Our goal is always to exceed expectations and leave our clients with a
                finished project they can be proud of.
              </p>
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
              href="#portfolio"
              className="inline-block rounded-full bg-[#6c3fe1] px-5 py-3 text-sm font-bold text-white no-underline transition-transform duration-200 hover:-translate-y-px hover:bg-[#4f2ab7]"
            >
              View Portfolio
            </a>
            <a
              href="#contact"
              className="inline-block rounded-full border border-[#24183a24] px-5 py-3 text-sm font-bold text-[#24183a] no-underline transition-transform duration-200 hover:-translate-y-px"
            >
              Contac Us
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <article className="rounded-[18px] border border-[#24183a24] bg-white p-5 shadow-[0_24px_60px_rgba(29,14,56,0.14)]">
              <span className="text-sm font-extrabold text-[#4f2ab7]">01</span>
              <h3 className="mb-2 mt-1 text-xl font-bold text-[#24183a]">Home Renovation Planning</h3>
              <p className="text-[#5d4e79]">We assess your property, define renovation scope, and build a practical delivery plan.</p>
            </article>
            <article className="rounded-[18px] border border-[#24183a24] bg-white p-5 shadow-[0_24px_60px_rgba(29,14,56,0.14)]">
              <span className="text-sm font-extrabold text-[#4f2ab7]">02</span>
              <h3 className="mb-2 mt-1 text-xl font-bold text-[#24183a]">Structural Building Works</h3>
              <p className="text-[#5d4e79]">
                We manage construction works, material quality, and milestone tracking in house, ensuring a high quality of work.
              </p>
            </article>
            <article className="rounded-[18px] border border-[#24183a24] bg-white p-5 shadow-[0_24px_60px_rgba(29,14,56,0.14)]">
              <span className="text-sm font-extrabold text-[#4f2ab7]">03</span>
              <h3 className="mb-2 mt-1 text-xl font-bold text-[#24183a]">Refurbishment & Finishing</h3>
              <p className="text-[#5d4e79]">We complete premium interior and exterior finishes to elevate long-term property value.</p>
            </article>
          </div>
        </section>

        <section id="portfolio" className="reveal pt-[clamp(2rem,5vw,4rem)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">Portfolio</p>
              <h2 className="mb-0 text-[clamp(1.4rem,2.8vw,2.2rem)] font-bold text-[#24183a]">Built Work Gallery</h2>
            </div>
            <div
              className="flex translate-y-[0.45rem] gap-1 rounded-full bg-[#efe9ff] p-1 max-[640px]:w-full max-[640px]:translate-y-0 max-[640px]:justify-between"
              role="tablist"
              aria-label="Portfolio category"
            >
              <button
                className={[
                  "cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-bold",
                  activeCategory === "finishes" ? "bg-white text-[#24183a]" : "bg-transparent text-[#5d4e79]"
                ].join(" ")}
                data-filter="finishes"
                role="tab"
                aria-selected={activeCategory === "finishes"}
                onClick={() => setActiveCategory("finishes")}
              >
                Finished Projects
              </button>
              <button
                className={[
                  "cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-bold",
                  activeCategory === "works" ? "bg-white text-[#24183a]" : "bg-transparent text-[#5d4e79]"
                ].join(" ")}
                data-filter="works"
                role="tab"
                aria-selected={activeCategory === "works"}
                onClick={() => setActiveCategory("works")}
              >
                Construction Process
              </button>
            </div>
          </div>

          <div
            className="relative mt-5 overflow-hidden transition-[height] duration-[420ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            aria-live="polite"
            style={{ height: galleryHeight > 0 ? `${galleryHeight}px` : undefined }}
          >
            <div
              ref={finishesRef}
              className={[
                "absolute left-0 right-0 top-0 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 transition-all duration-300 max-[640px]:grid-cols-2 max-[640px]:gap-[0.7rem]",
                activeCategory === "finishes" ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              ].join(" ")}
            >
              {finishImages.map((image) => (
                <figure
                  className="m-0 cursor-pointer overflow-hidden rounded-[14px] border border-[#24183a24] bg-white shadow-[0_8px_24px_rgba(9,21,15,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(9,21,15,0.2)]"
                  key={image.src}
                  onClick={() => setLightbox(image)}
                >
                  <img
                    loading="lazy"
                    src={image.src}
                    alt={image.alt}
                    onLoad={handleImageLoad}
                    className="block aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="px-3 py-3 text-[0.92rem] text-[#5d4e79]">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
            <div
              ref={worksRef}
              className={[
                "absolute left-0 right-0 top-0 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 transition-all duration-300 max-[640px]:grid-cols-2 max-[640px]:gap-[0.7rem]",
                activeCategory === "works" ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              ].join(" ")}
            >
              {workImages.map((image) => (
                <figure
                  className="m-0 cursor-pointer overflow-hidden rounded-[14px] border border-[#24183a24] bg-white shadow-[0_8px_24px_rgba(9,21,15,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(9,21,15,0.2)]"
                  key={image.src}
                  onClick={() => setLightbox(image)}
                >
                  <img
                    loading="lazy"
                    src={image.src}
                    alt={image.alt}
                    onLoad={handleImageLoad}
                    className="block aspect-[4/3] w-full bg-[#f3efff] object-contain"
                  />
                  <figcaption className="px-3 py-3 text-[0.92rem] text-[#5d4e79]">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="reveal pt-[clamp(2rem,5vw,4rem)]">
          <div className="rounded-[18px] border border-[#24183a24] bg-gradient-to-br from-white to-[#f2ecff] p-[clamp(1.1rem,4vw,2rem)]">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4f2ab7]">Let's Build</p>
            <h2 className="mb-4 text-[clamp(1.4rem,2.8vw,2.2rem)] font-bold text-[#24183a]">
              Plan Your Next Development With RJP Innovations
            </h2>
            <p className="mb-5 max-w-[54ch] text-[#5d4e79]">
              Share your project requirements and we'll guide you from concept to completion.
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

      <div
        className={[
          "fixed inset-0 z-40 grid place-items-center bg-[rgba(6,9,8,0.86)] p-4 transition-opacity duration-200",
          lightbox ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
        id="lightbox"
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

export default App;
