import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const JobForm = () => {
  const { id } = useParams(); // undefined if creating
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    salary: "",
    skills: "",
    description: "",
    status: "open",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/recruiter/jobs`) // reuse list; fetch by id from list
        .then((res) => {
          const found = (res.data.data || []).find((j) => j._id === id);
          if (!found) {
            navigate("/recruiter/jobs");
            return;
          }
          setForm({
            title: found.title || "",
            company: found.company || "",
            location: found.location || "",
            type: found.type || "Full Time",
            salary: found.salary || "",
            skills: (found.skills || []).join(", "),
            description: found.description || "",
            status: found.status || "open",
          });
        })
        .catch(() => navigate("/recruiter/jobs"));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/recruiter/jobs/${id}`, payload);
      } else {
        await api.post("/recruiter/jobs", payload);
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RecruiterNavbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black">
              {isEdit ? "Edit Job" : "Post a New Job"}
            </h1>
            <p className="mt-1 text-gray-500">
              {isEdit ? "Update your job details." : "Create a new job listing."}
            </p>
          </div>
          <BackButton fallback="/recruiter/jobs" />
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {[
              ["title", "Job Title"],
              ["company", "Company"],
              ["location", "Location"],
              ["salary", "Salary"],
              ["skills", "Skills (comma separated)"],
            ].map(([name, label]) => (
              <label key={name} className="text-sm font-bold">
                {label}
                <input
                  name={name}
                  required
                  value={form[name]}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
                />
              </label>
            ))}
            <label className="text-sm font-bold">
              Job Type
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
              >
                <option>Full Time</option>
                <option>Internship</option>
                <option>Part Time</option>
              </select>
            </label>
            <label className="text-sm font-bold">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="sm:col-span-2 text-sm font-bold">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="About the role..."
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
              />
            </label>
            <button
              disabled={loading}
              className="sm:col-span-2 rounded-xl bg-brand py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : isEdit ? "Update Job" : "Publish Job"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default JobForm;