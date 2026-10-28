// ✅ PATCHED: apply-job now sends token via `api` (backend requires auth)
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, MapPin, CheckCircle } from "lucide-react";
import BackButton from "../BackButton";
import UserNavbar from "./UserNavbar";
import api from "../../utils/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.get(`/get-job/${id}`)
      .then((res) => setJob(res.data.data))
      .catch((err) => console.error("Error fetching job details:", err));
  }, [id]);

  const handleApply = async () => {
    if (!job) return;

    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!user) {
      alert("Please log in to apply.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/apply-job", {
        jobId: job._id || job.id,
        candidate: user.name || user.email,
      });
      alert("✅ Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      console.error("Error applying to job:", err);
      alert(err.response?.data?.message || "Failed to apply. Please try again.");
    }
  };

  if (!job) return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-4 flex items-center justify-between">
          <BackButton fallback="/jobs" />
          <span className="text-sm text-gray-400">Job Details</span>
        </div>
        <div className="mt-5 rounded-[2rem] bg-white p-8 shadow-soft">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-brand">{job.type}</span>
          <h1 className="mt-4 text-4xl font-black">{job.title}</h1>
          <p className="mt-2 text-lg font-bold text-gray-500">{job.company}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-gray-500">
            <span className="flex items-center gap-2"><MapPin size={17} /> {job.location}</span>
            <span className="flex items-center gap-2"><BriefcaseBusiness size={17} /> {job.salary}</span>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_280px]">
            <div>
              <h2 className="text-xl font-black">About the role</h2>
              <p className="mt-3 leading-8 text-gray-600">
                {job.description || "We are looking for a motivated professional to join our team. You will work on real projects, collaborate with the team and contribute to product development."}
              </p>
              <h2 className="mt-8 text-xl font-black">Required skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">{job.skills.map(s => <span key={s} className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-bold text-brand">{s}</span>)}</div>
            </div>
            <aside className="h-fit rounded-3xl bg-gray-50 p-5">
              <h3 className="font-black">Ready to apply?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">Use your resume profile to apply for this opportunity.</p>
              <button
                onClick={handleApply}
                className="mt-5 w-full rounded-2xl bg-brand py-3 font-bold text-white hover:bg-indigo-700"
              >
                Apply Now
              </button>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default JobDetails;