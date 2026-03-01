import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react"
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
      <div className="bg-orb bg-orb-a" />
      <div className="bg-orb bg-orb-b" />

      <header className={`site-header ${isScrolled ? "island" : ""}`}>
        <a href="#" className="brand">
          RJP Innovations
        </a>
        <nav>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero reveal">
          <p className="eyebrow">Building Contractor, Renovation & Property Development</p>
          <h1>
            <span className="hero-title-line">Built Perfect.</span>
            <span className="hero-title-line">Finished Better.</span>
          </h1>
          <p className="lead">
            RJP Innovations delivers high-quality home renovation, structural construction, and property
            refurbishment projects with disciplined site management and premium finishes.
          </p>
          <div className="hero-actions">
            <a href="#portfolio" className="btn btn-primary">
              View Portfolio
            </a>
            <a href="#contact" className="btn btn-ghost">
              Start a Project
            </a>
          </div>
          <div className="stats-grid">
            <article>
              <h2>{finishImages.length}+</h2>
              <p>Finished works showcased</p>
            </article>
            <article>
              <h2>{workImages.length}</h2>
              <p>On-site execution snapshots</p>
            </article>
            <article>
              <h2>End-to-end</h2>
              <p>Planning, construction, and finishing</p>
            </article>
          </div>
        </section>

        <section id="process" className="section reveal">
          <div className="section-head">
            <p className="eyebrow">Construction & Renovation Services</p>
            <h2>Residential Building Services We Deliver</h2>
          </div>
          <div className="process-grid">
            <article className="process-card">
              <span>01</span>
              <h3>Home Renovation Planning</h3>
              <p>We assess your property, define renovation scope, and build a practical delivery plan.</p>
            </article>
            <article className="process-card">
              <span>02</span>
              <h3>Structural Building Works</h3>
              <p>We manage construction works, material quality, and milestone tracking in house, ensuring a high quality of work.</p>
            </article>
            <article className="process-card">
              <span>03</span>
              <h3>Refurbishment & Finishing</h3>
              <p>We complete premium interior and exterior finishes to elevate long-term property value.</p>
            </article>
          </div>
        </section>

        <section id="portfolio" className="section reveal">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2>Built Work Gallery</h2>
            </div>
            <div className="toggle-group" role="tablist" aria-label="Portfolio category">
              <button
                className={`toggle-btn ${activeCategory === "finishes" ? "active" : ""}`}
                data-filter="finishes"
                role="tab"
                aria-selected={activeCategory === "finishes"}
                onClick={() => setActiveCategory("finishes")}
              >
                Finished Projects
              </button>
              <button
                className={`toggle-btn ${activeCategory === "works" ? "active" : ""}`}
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
            className="gallery-stage"
            aria-live="polite"
            style={{ height: galleryHeight > 0 ? `${galleryHeight}px` : undefined }}
          >
            <div
              ref={finishesRef}
              className={`gallery-grid gallery-panel ${activeCategory === "finishes" ? "active" : ""}`}
            >
              {finishImages.map((image) => (
                <figure className="card" key={image.src} onClick={() => setLightbox(image)}>
                  <img loading="lazy" src={image.src} alt={image.alt} onLoad={handleImageLoad} />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
            <div
              ref={worksRef}
              className={`gallery-grid gallery-panel ${activeCategory === "works" ? "active" : ""}`}
            >
              {workImages.map((image) => (
                <figure className="card" key={image.src} onClick={() => setLightbox(image)}>
                  <img
                    loading="lazy"
                    src={image.src}
                    alt={image.alt}
                    className="work-image"
                    onLoad={handleImageLoad}
                  />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section reveal">
          <div className="contact-card">
            <p className="eyebrow">Let's Build</p>
            <h2>Plan Your Next Development With RJP Innovations</h2>
            <p>Share your project requirements and we'll guide you from concept to completion.</p>
            <a
              className="btn btn-primary"
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
        className={`lightbox ${lightbox ? "open" : ""}`}
        id="lightbox"
        aria-hidden={lightbox ? "false" : "true"}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setLightbox(null);
          }
        }}
      >
        <button className="lightbox-close" aria-label="Close image" onClick={() => setLightbox(null)}>
          &times;
        </button>
        {lightbox && (
          <>
            <img src={lightbox.src} alt={lightbox.caption} />
            <p>{lightbox.caption}</p>
          </>
        )}
      </div>
    </>
  );
}

export default App;
