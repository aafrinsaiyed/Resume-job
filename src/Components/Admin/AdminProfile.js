// ✅ UPDATED: Added Cloudinary Profile Picture upload + preview
import { useEffect, useState } from "react";
import { UserRound, Mail, Phone, MapPin, Lock, Camera } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const AdminProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    profilePic: "", // 👈 Naya field
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;

    api.get(`/get-singleuser/${userId}`)
      .then((res) => {
        const u = res.data.data;
        if (u) {
          setForm({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
            password: "",
            profilePic: u.profilePic || "", // 👈 Load karein
          });
        }
      })
      .catch((err) => console.error("Error fetching admin profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Cloudinary Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, profilePic: res.data.url });
      setSuccess("Image uploaded! Click 'Save Changes'.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;

    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      const res = await api.put(`/update-user/${userId}`, payload);
      const updatedUser = res.data.data;

      const newStored = {
        ...currentUser,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profilePic: updatedUser.profilePic || "", // 👈 LocalStorage update
      };
      localStorage.setItem("currentUser", JSON.stringify(newStored));

      setSuccess("Profile updated successfully!");
      setForm({ ...form, password: "" });
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <UserRound />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">Admin</p>
              <h1 className="text-3xl font-black">My Profile</h1>
            </div>
          </div>
          <BackButton fallback="/admin" />
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          {success && (
            <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-600">{success}</div>
          )}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</div>
          )}

          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              
              {/* ✅ Profile Picture Upload Section */}
              <div className="sm:col-span-2 flex items-center gap-5 rounded-2xl border border-dashed border-gray-200 p-5">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                  {form.profilePic ? (
                    <img src={form.profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="text-gray-400" size={32} />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                      ...
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand">
                    <Camera size={16} />
                    {uploading ? "Uploading..." : "Change Profile Picture"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-400">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <label className="text-sm font-bold">
                Full Name
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4">
                  <UserRound size={18} className="text-gray-400" />
                  <input name="name" value={form.name} onChange={handleChange} className="w-full py-3 outline-none" required />
                </div>
              </label>

              <label className="text-sm font-bold">
                Email Address
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4">
                  <Mail size={18} className="text-gray-400" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full py-3 outline-none" required />
                </div>
              </label>

              <label className="text-sm font-bold">
                Phone Number
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4">
                  <Phone size={18} className="text-gray-400" />
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full py-3 outline-none" placeholder="Optional" />
                </div>
              </label>

              <label className="text-sm font-bold">
                Address
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4">
                  <MapPin size={18} className="text-gray-400" />
                  <input name="address" value={form.address} onChange={handleChange} className="w-full py-3 outline-none" placeholder="Optional" />
                </div>
              </label>

              <label className="sm:col-span-2 text-sm font-bold">
                New Password (leave blank to keep current)
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4">
                  <Lock size={18} className="text-gray-400" />
                  <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full py-3 outline-none" placeholder="••••••••" />
                </div>
              </label>

              <button type="submit" className="sm:col-span-2 rounded-xl bg-brand py-3 font-bold text-white hover:bg-indigo-700">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminProfile;