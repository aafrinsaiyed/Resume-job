// ✅ PATCHED: uses `api` helper + description/status fields
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    api.get(`/get-job/${id}`)
      .then((res) => {
        const job = res.data.data;
        if (job) {
          setForm({
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            type: job.type || "Full Time",
            salary: job.salary || "",
            skills: (job.skills || []).join(", "),
            description: job.description || "",
            status: job.status || "open",
          });
        }
      })
      .catch(() => navigate("/admin/jobs"));
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const updatedJob = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      await api.put(`/update-job/${id}`, updatedJob);
      navigate("/admin/jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      setError(err.response?.data?.message || "Failed to update job");
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black">Edit Job</h1>
            <p className="mt-1 text-gray-500">Update the job details.</p>
          </div>
          <BackButton fallback="/admin/jobs" />
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-2 grid gap-4 sm:grid-cols-2">
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
            <button className="sm:col-span-2 rounded-xl bg-brand py-3 font-bold text-white">
              Update Job
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditJob;