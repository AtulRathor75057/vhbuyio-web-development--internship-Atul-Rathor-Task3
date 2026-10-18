export const KEY = "jobflow-v1";
const defaults = {
  saved: [],
  applications: [],
  activities: [],
  theme: "light",
  profile: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "Frontend Developer",
    location: "Bengaluru, India",
    bio: "Frontend developer passionate about accessible, intuitive digital experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    linkedin: "",
    github: "",
    website: "",
    resumeName: "",
  },
};
export function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    if (value && typeof value === "object")
      return {
        ...structuredClone(defaults),
        ...value,
        profile: { ...defaults.profile, ...value.profile },
      };
  } catch {}
  return structuredClone(defaults);
}
export function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
export function mutate(fn) {
  const data = read();
  fn(data);
  return write(data);
}
export function log(text) {
  mutate((s) => {
    s.activities.unshift({
      id: crypto.randomUUID(),
      text,
      at: new Date().toISOString(),
    });
    s.activities = s.activities.slice(0, 35);
  });
}
export function exportJSON() {
  return JSON.stringify(read(), null, 2);
}
export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (
    !parsed ||
    !Array.isArray(parsed.saved) ||
    !Array.isArray(parsed.applications) ||
    typeof parsed.profile !== "object" ||
    parsed.profile === null
  )
    throw Error("Invalid JobFlow data format");
  const clean = {
    ...read(),
    saved: parsed.saved.filter(Number.isInteger),
    applications: parsed.applications.filter(
      (a) =>
        a &&
        typeof a === "object" &&
        typeof a.company === "string" &&
        typeof a.title === "string",
    ),
    activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    profile: { ...read().profile, ...parsed.profile },
    theme: parsed.theme === "dark" ? "dark" : "light",
  };
  write(clean);
}
export const statusList = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];
