import { GalleryImage, ProjectGroup, ProjectSection } from "../types";

export function mapImagesToGallery(images: string[], projectName: string, label?: string): GalleryImage[] {
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

export function getProjectCoverImage(project: ProjectGroup): string | null {
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

export function getProjectImageCount(project: ProjectGroup): number {
  const directCount = project.images.length;
  const sectionCount = (project.sections ?? []).reduce((total, section) => total + section.images.length, 0);
  return directCount + sectionCount;
}
