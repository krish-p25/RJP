import { ServiceItem } from "../types";

export const ABOUT_PARAGRAPHS = [
  "We believe great construction is about more than building - it's about creating spaces that improve the way people live and work. Based in London, we specialise in high-quality renovation, refurbishment, and building completion services, helping homeowners, landlords, and developers transform properties with confidence.",
  "Our team is passionate about delivering projects that combine craftsmanship, thoughtful design, and lasting quality. From the earliest planning stages through to the final finishes, we take pride in ensuring every detail is completed with care and professionalism. Whether it's a full property renovation, an interior refurbishment, or external improvements, we approach every project with the same commitment to excellence.",
  "As a member of the Federation of Master Builders, we are proud to be recognised as part of one of the UK's most respected construction organisations. This reflects our dedication to maintaining high industry standards, delivering reliable workmanship, and providing a service our clients can trust.",
  "We understand that every property project is a significant investment. That's why we focus on clear communication, dependable timelines, and results that genuinely enhance both the value and functionality of a space. Our goal is always to exceed expectations and leave our clients with a finished project they can be proud of."
] as const;

export const SERVICES: ServiceItem[] = [
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

export const HEADER_BASE_CLASSES =
  "fixed left-1/2 z-20 flex -translate-x-1/2 items-center justify-between border backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

export const HEADER_SCROLLED_CLASSES =
  "top-3 w-[calc(100%-1.4rem)] max-w-[1040px] rounded-full border-[#4f2ab733] bg-white/65 px-4 py-3 shadow-[0_14px_35px_rgba(30,14,59,0.16)] md:px-6 lg:px-10 max-[640px]:top-[0.55rem] max-[640px]:w-[calc(100%-0.8rem)]";

export const HEADER_TOP_CLASSES =
  "top-0 w-full max-w-[100%] rounded-none border-[#24183a00] border-b-[#24183a24] bg-[#f8f6ffbf] px-4 py-4 shadow-none md:px-6 lg:px-12";

export const CAROUSEL_INTERVAL_MS = 3800;
export const LOGO_RESTORE_DELAY_MS = 2800;
