export function filterJobs(
  jobs,
  {
    query = "",
    location = "",
    salary = "",
    experience = "",
    type = "",
    sort = "newest",
  } = {},
) {
  const q = query.trim().toLowerCase();
  const filtered = jobs.filter(
    (j) =>
      (!q ||
        `${j.title} ${j.company} ${j.skills.join(" ")}`
          .toLowerCase()
          .includes(q)) &&
      (!location || j.location === location) &&
      (!salary || j.minSalary >= Number(salary)) &&
      (!experience || j.experience === experience) &&
      (!type || j.type === type),
  );
  return filtered.sort((a, b) =>
    sort === "salary-high"
      ? b.maxSalary - a.maxSalary
      : sort === "salary-low"
        ? a.minSalary - b.minSalary
        : a.postedDays - b.postedDays,
  );
}
export function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
