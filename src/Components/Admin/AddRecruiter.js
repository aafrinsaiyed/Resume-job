import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Upload, Building2 } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const AddRecruiter = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    companyLogo: "", // 👈 Naya field
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Cloudinary Logo Upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, companyLogo: res.data.url });
    } catch (err) {
      console.error(err);
      alert("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/admin/create-recruiter", form);
      navigate("/admin/recruiters");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create recruiter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <UserPlus />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                Admin
              </p>
              <h1 className="text-3xl font-black">Add Recruiter</h1>
            </div>
          </div>
          <BackButton fallback="/admin/recruiters" />
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h2 className="text-xl font-black">Create a new recruiter</h2>
          <p className="mt-1 text-sm text-gray-500">
            Recruiters can post jobs, manage applicants, and update the hiring pipeline.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            
            {/* ✅ Company Logo Upload */}
            <div className="sm:col-span-2 flex items-center gap-5 rounded-2xl border border-dashed border-gray-200 p-5">
              <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                {form.companyLogo ? (
                  <img src={form.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="text-gray-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand">
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload Company Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-400">JPG, PNG. Max 2MB.</p>
              </div>
            </div>

            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Field
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="sm:col-span-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 rounded-xl bg-brand py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Recruiter"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

const Field = ({ label, name, value, onChange, type = "text", required = false, className = "" }) => (
  <label className={`text-sm font-bold ${className}`}>
    {label}
    <input
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
    />
  </label>
);

export default AddRecruiter;