// Shared by the desktop nav and the mobile menu (Header.tsx, MobileNav.tsx)
// so a future new section only needs to be added once.
export const NAV_ITEMS = [
  { id: "about", key: "about" },
  { id: "experience", key: "experience" },
  { id: "case-studies", key: "caseStudies" },
  { id: "projects", key: "projects" },
  { id: "skills", key: "skills" },
  { id: "working-style", key: "workingStyle" },
  { id: "education", key: "education" },
  { id: "contact", key: "contact" },
] as const;
