import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookmarkX } from "lucide-react";
import UserNavbar from "./UserNavbar";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setJobs(stored);
  }, []);

  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-sm font-black uppercase tracking-widest text-brand">Your shortlist</p>
        <h1 className="mt-1 text-3xl font-black">Saved Jobs</h1>
        <div className="mt-7 space-y-4">
          {jobs.length ? (
            jobs.map((j) => (
              <div
                key={j._id || j.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-soft"
              >
                <div>
                  <h2 className="font-black">{j.title}</h2>
                  <p className="text-sm text-gray-500">
                    {j.company} · {j.location}
                  </p>
                </div>
                <Link
                  to={`/jobs/${j._id || j.id}`}
                  className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white"
                >
                  View
                </Link>
              </div>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center">
              <BookmarkX className="mx-auto text-gray-300" />
              <p className="mt-3 font-bold text-gray-500">No saved jobs yet.</p>
              <Link to="/jobs" className="mt-4 inline-block font-bold text-brand">
                Explore jobs →
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default SavedJobs;