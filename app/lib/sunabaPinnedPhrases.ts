import { pickLocalized, SUNABA_PROJECTS } from "./sunabaProjects";

const BASE_PHRASES = [
  "sunaba",
  "すなば",
  "sandbox",
  "HTML",
  "CSS",
  "React",
  "TypeScript",
  "Vike",
  "anime.js",
  "WebGL",
  "shader",
  "LookDev",
  "scroll",
  "motion",
  "canvas",
  "experiment",
  "prototype",
  "playground",
  "creative coding",
  "portfolio",
  "2D",
  "index",
  "wip",
  "live",
  "build",
  "deploy",
  "git",
  "vite",
  "tailwind",
  "three.js",
  "noise",
  "grain",
  "marquee",
  "sticky",
  "burst",
  "barcode",
] as const;

const projectTitles = SUNABA_PROJECTS.flatMap((project) => [
  pickLocalized(project.title, "ja"),
  pickLocalized(project.title, "en"),
]);

export const SUNABA_PINNED_PHRASES: readonly string[] = [
  ...BASE_PHRASES,
  ...projectTitles,
];
