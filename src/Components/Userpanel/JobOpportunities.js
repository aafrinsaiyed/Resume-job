// ✅ PATCHED: uses `api` helper, sends token on resume fetch, hides closed jobs
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, MapPin, Search, Sparkles } from "lucide-react";
import UserNavbar from "./UserNavbar";
import api from "../../utils/api";

const JobOpportunities = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [resume, setResume] = useState(null);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userId = currentUser?._id || currentUser?.id;

    if (userId) {
      api.get(`/get-resume/${userId}`)
        .then((res) => setResume(res.data.data))
        .catch((err) => console.error("Error fetching resume:", err));
    }

    api.get("/get-jobs")
      .then((res) => {
        // ✅ only show open jobs to users
        const openOnly = (res.data.data || []).filter((j) => (j.status || "open") === "open");
        setAllJobs(openOnly);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const userSkills = (resume?.skills || []).map((x) => x.toLowerCase());

  const matches = useMemo(() => {
    const filtered = allJobs
      .map((j) => ({
        ...j,
        match: Math.round(
          (j.skills.filter((s) => userSkills.includes(s.toLowerCase())).length /
            Math.max(j.skills.length, 1)) *
            100
        ),
      }))
      .filter(
        (j) =>
          (type === "All" || j.type === type) &&
          (j.title + " " + j.company + " " + j.location + " " + j.skills.join(" "))
            .toLowerCase()
            .includes(search.toLowerCase())
      )
      .sort((a, b) => b.match - a.match);

    return filtered;
  }, [allJobs, userSkills, type, search]);

  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-[2rem] bg-white p-7 shadow-soft">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">Job Opportunities</p>
              <h1 className="mt-1 text-3xl font-black">Find roles that fit you</h1>
              <p className="mt-2 text-gray-500">Recommendations are based on skills entered in your resume.</p>
            </div>
            <Link to="/builder" className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-brand">
              Update Resume
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_180px]">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4">
              <Search className="text-gray-400" size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 outline-none"
                placeholder="Search jobs, companies, skills..."
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
            >
              <option>All</option>
              <option>Full Time</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {matches.length ? (
            matches.map((job) => <JobCard key={job._id || job.id} job={job} />)
          ) : (
            <div className="col-span-full rounded-3xl bg-white p-10 text-center text-gray-500">
              No jobs found.
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(() =>
    JSON.parse(localStorage.getItem("savedJobs") || "[]").some((x) => (x._id || x.id) === (job._id || job.id))
  );

  const toggleSave = () => {
    const old = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const next = saved ? old.filter((x) => (x._id || x.id) !== (job._id || job.id)) : [...old, job];
    localStorage.setItem("savedJobs", JSON.stringify(next));
    setSaved(!saved);
  };

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
            <Sparkles size={13} /> {job.match || 0}% Match
          </span>
          <h2 className="mt-3 text-xl font-black">{job.title}</h2>
          <p className="mt-1 font-semibold text-gray-500">{job.company}</p>
        </div>
        <button
          onClick={toggleSave}
          className={`rounded-xl p-2 ${saved ? "bg-indigo-50 text-brand" : "bg-gray-50 text-gray-400"}`}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span>•</span>
        <span>{job.type}</span>
        <span>•</span>
        <span>{job.salary}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.map((s) => (
          <span key={s} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
            {s}
          </span>
        ))}
      </div>
      <Link
        to={`/jobs/${job._id || job.id}`}
        className="mt-6 block rounded-2xl bg-gray-900 py-3 text-center text-sm font-bold text-white hover:bg-brand"
      >
        View Job Details
      </Link>
    </article>
  );
};

export default JobOpportunities;