import { z } from "zod";

/**
 * About content — bio, experience, education.
 *
 * Every value is a marked placeholder in the requested minimal style.
 * The bio intentionally sits in the 40–60 word "answer-first" range required
 * by the AEO guidelines (it must read as a complete, self-contained answer to
 * "Who is VYN – CoCreation Lab?").
 */

const answerSchema = z.string().min(1);

const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  period: z.string().min(1),
});

const aboutSchema = z.object({
  updatedAt: z.string().date(),
  title: answerSchema,
  answer: answerSchema,
  bio: answerSchema,
  experienceAnswer: answerSchema,
  educationAnswer: answerSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});

export type ExperienceEntry = z.infer<typeof experienceSchema>;
export type EducationEntry = z.infer<typeof educationSchema>;

export type About = z.infer<typeof aboutSchema>;

export const about: About = aboutSchema.parse({
  updatedAt: "2026-10-17",
  title: "About VYN – CoCreation Lab",
  // Answer-first: 40–60 words, self-contained.
  answer:
    "VYN – CoCreation Lab is the web developing practice behind this portfolio: a small team that designs and codes websites end to end. Work spans AI-assisted tools, CMS builds and hand-coded applications, delivered as fast, accessible, search-ready sites with verifiable results you can inspect on the project pages.",
  // PLACEHOLDER — replace with the real bio (~40–60 words, keep answer-first).
  bio: "{{BIO — 40–60 words: who VYN is, the specialisation, what makes it different, where you work. This paragraph ships as the answer to “Who is VYN – CoCreation Lab?” in search and AI summaries.}}",
  experienceAnswer:
    "VYN works across three modes of delivery — AI-assisted builds, CMS projects and fully hand-coded applications — for clients of different sizes. The fuller record lives on the projects page.",
  // PLACEHOLDER entries
  experience: [
    {
      role: "{{ROLE}}",
      company: "{{COMPANY}}",
      period: "{{PERIOD, e.g. 2022 – 2025}}",
      summary: "{{WHAT YOU SHIPPED AND WHY IT MATTERED}}",
    },
    {
      role: "{{ROLE}}",
      company: "{{COMPANY}}",
      period: "{{PERIOD}}",
      summary: "{{WHAT YOU SHIPPED AND WHY IT MATTERED}}",
    },
  ],
  educationAnswer:
    "Formal education path — replace the placeholder entries with real degrees, years and institutions.",
  education: [
    {
      degree: "{{DEGREE}}",
      institution: "{{INSTITUTION}}",
      period: "{{PERIOD}}",
    },
    {
      degree: "{{DEGREE}}",
      institution: "{{INSTITUTION}}",
      period: "{{PERIOD}}",
    },
  ],
});

export const aboutPageAnswer: string = about.answer;
