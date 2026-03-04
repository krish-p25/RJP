export type Route = "home" | "portfolio";

export type GalleryImage = {
  src: string;
  caption: string;
  alt: string;
};

export type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  imgClassName: string;
  wrapperClassName?: string;
  skeletonClassName?: string;
  loading?: "lazy" | "eager";
  visible?: boolean;
  onLoad?: () => void;
};

export type ProjectSection = {
  name: string;
  images: string[];
};

export type ProjectGroup = {
  name: string;
  images: string[];
  sections?: ProjectSection[];
};

export type ServiceItem = {
  number: string;
  title: string;
  description: string;
};
