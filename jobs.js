const companyNames = [
  "Linear Labs",
  "NovaStack",
  "PixelCraft",
  "CloudNine",
  "Orbit Digital",
  "Brightbyte",
  "Nexora",
  "CodeNest",
  "Atlas Systems",
  "Vivid Studio",
  "Launchpad",
  "Zephyr Tech",
  "Monarch AI",
  "Evergreen Tech",
  "Synapse Labs",
  "Northstar",
  "Mosaic",
  "RippleWorks",
  "PulsePoint",
  "Vertex",
];
const roles = [
  "Frontend Developer",
  "Junior Web Developer",
  "UI Engineer",
  "React Developer",
  "Full Stack Engineer",
  "Product Designer",
  "Data Analyst",
  "Backend Developer",
  "Software Engineer",
  "UX Designer",
  "QA Engineer",
  "JavaScript Developer",
  "Mobile App Developer",
  "DevOps Associate",
  "Technical Support Engineer",
  "Business Analyst",
  "UI/UX Developer",
  "Node.js Developer",
  "Python Developer",
  "Web Developer",
];
const places = [
  "Bengaluru",
  "Remote",
  "Hyderabad",
  "Pune",
  "Delhi NCR",
  "Mumbai",
  "Chennai",
  "Remote",
  "Noida",
  "Gurugram",
];
const descriptions = [
  "Build delightful, responsive user experiences with a collaborative product team. You will translate ideas into polished interfaces, contribute to engineering decisions, and help ship features used by thousands of people.",
  "Join a growing team focused on making complex software feel effortless. Collaborate with designers, engineers, and stakeholders to deliver reliable, accessible digital products.",
  "Own meaningful features from planning through launch. Write maintainable code, review pull requests, improve performance, and grow your craft with supportive teammates.",
];
const skillsByRole = [
  ["HTML", "CSS", "JavaScript", "React"],
  ["HTML", "CSS", "JavaScript", "Git"],
  ["Figma", "CSS", "JavaScript", "Accessibility"],
  ["React", "TypeScript", "Redux", "CSS"],
  ["React", "Node.js", "SQL", "TypeScript"],
  ["Figma", "User Research", "Prototyping"],
  ["Excel", "SQL", "Python", "Power BI"],
  ["Node.js", "Express", "MongoDB"],
  ["Java", "Git", "REST APIs"],
  ["Figma", "Wireframing", "UX Research"],
  ["Testing", "Cypress", "JavaScript"],
  ["JavaScript", "HTML", "CSS", "APIs"],
  ["Kotlin", "Android", "Firebase"],
  ["AWS", "Docker", "Linux"],
  ["Troubleshooting", "Communication", "SQL"],
  ["Excel", "SQL", "Documentation"],
  ["HTML", "CSS", "Figma", "React"],
  ["Node.js", "Express", "REST APIs"],
  ["Python", "Django", "SQL"],
  ["HTML", "CSS", "JavaScript", "Git"],
];
export const jobs = roles.map((title, i) => ({
  id: i + 1,
  title,
  company: companyNames[i],
  location: places[i % places.length],
  minSalary: [5, 6, 8, 9, 12, 7, 6, 10, 8, 7, 5, 6, 6, 9, 4, 7, 5, 8, 7, 5][i],
  maxSalary: [
    8, 9, 13, 15, 20, 12, 11, 18, 14, 12, 8, 11, 10, 16, 7, 12, 9, 14, 12, 9,
  ][i],
  experience:
    i % 5 === 0 ? "0–2 years" : i % 4 === 0 ? "3–5 years" : "1–3 years",
  type: i % 7 === 0 ? "Contract" : i % 6 === 0 ? "Internship" : "Full-time",
  skills: skillsByRole[i],
  description: descriptions[i % 3],
  postedDays: i % 6,
  featured: i < 6,
  about: `${companyNames[i]} builds thoughtful digital products with a focus on innovation, inclusivity, and continuous learning.`,
  responsibilities: [
    "Deliver maintainable, production-ready solutions.",
    "Collaborate closely with teammates across design and engineering.",
    "Participate in reviews, planning and iterative improvements.",
  ],
  requirements: [
    "Strong understanding of core technical fundamentals.",
    "Ability to communicate and work effectively with a team.",
    "Curiosity and willingness to learn new tools and techniques.",
  ],
}));
export const salaryText = (j) => `₹${j.minSalary}–${j.maxSalary} LPA`;
export const getJob = (id) => jobs.find((j) => j.id === Number(id));
export const initials = (name) =>
  name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
