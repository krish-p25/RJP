import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { imageManifest } from "../imageManifest";
import { GalleryImage, ProjectGroup, ProjectSection } from "../types";
import { ImageWithSkeleton } from "../components/ImageWithSkeleton";
import { Lightbox } from "../components/Lightbox";
import { mapImagesToGallery, getProjectCoverImage, getProjectImageCount } from "../utils/projectHelpers";

export function PortfolioPage() {
  const { projectName } = useParams<{ projectName?: string }>();
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sectionOpenState, setSectionOpenState] = useState<Record<string, boolean>>({});
  const previousProjectNameRef = useRef<string | undefined>(projectName);

  const projectGroups = useMemo<ProjectGroup[]>(() => imageManifest.projects, []);
  const selectedProject = useMemo(
    () => (projectName ? projectGroups.find((project) => project.name === decodeURIComponent(projectName)) ?? null : null),
    [projectGroups, projectName]
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

  // Flatten all visible images for lightbox navigation
  const allVisibleImages = useMemo(() => {
    if (!selectedProject) return [];

    if (selectedProjectSections.length > 0) {
      // When there are sections, include images from open sections only
      const images: GalleryImage[] = [];
      selectedProjectSections.forEach((section) => {
        const sectionKey = section.name.toLowerCase();
        const isOpen = sectionOpenState[sectionKey];
        if (isOpen) {
          images.push(...mapImagesToGallery(section.images, selectedProject.name, section.name));
        }
      });
      return images;
    } else {
      // When no sections, return direct project images
      return selectedProjectImages;
    }
  }, [selectedProject, selectedProjectSections, selectedProjectImages, sectionOpenState]);

  const currentLightboxImage = lightboxIndex !== null ? allVisibleImages[lightboxIndex] : null;

  const handleNextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < allVisibleImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const openLightbox = (image: GalleryImage) => {
    const index = allVisibleImages.findIndex((img) => img.src === image.src);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  // Scroll to top when portfolio page first loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (projectName && !selectedProject) {
      navigate("/portfolio", { replace: true });
    }
  }, [projectName, selectedProject, navigate]);

  useEffect(() => {
    if (!previousProjectNameRef.current && projectName) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    previousProjectNameRef.current = projectName;
  }, [projectName]);

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
                    onClick={() => navigate(`/portfolio/${encodeURIComponent(project.name)}`)}
                  >
                    {getProjectCoverImage(project) && (
                      <ImageWithSkeleton
                        src={getProjectCoverImage(project) as string}
                        alt={`${project.name} project preview`}
                        imgClassName="block aspect-[4/3] w-full object-cover"
                        loading="lazy"
                        skeletonClassName="bg-[#efe9ff]"
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
                  onClick={() => navigate("/portfolio")}
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
                                    onClick={() => openLightbox(image)}
                                  >
                                    <ImageWithSkeleton
                                      loading="lazy"
                                      src={image.src}
                                      alt={image.alt}
                                      imgClassName="block aspect-[4/3] w-full object-cover"
                                      skeletonClassName="bg-[#efe9ff]"
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
                      onClick={() => openLightbox(image)}
                    >
                      <ImageWithSkeleton
                        loading="lazy"
                        src={image.src}
                        alt={image.alt}
                        imgClassName="block aspect-[4/3] w-full object-cover"
                        skeletonClassName="bg-[#efe9ff]"
                      />
                      <figcaption className="px-3 py-3 text-[0.92rem] text-[#5d4e79]">{image.caption}</figcaption>
                    </figure>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <Lightbox
        image={currentLightboxImage}
        onClose={handleCloseLightbox}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
        hasNext={lightboxIndex !== null && lightboxIndex < allVisibleImages.length - 1}
        hasPrevious={lightboxIndex !== null && lightboxIndex > 0}
      />
    </>
  );
}
