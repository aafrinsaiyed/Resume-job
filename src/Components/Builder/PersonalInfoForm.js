import { UserRound, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../utils/api";

const PersonalInfoForm = ({ data, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    console.log("👤 PersonalInfoForm loaded with data:", data);
  }, [data]);

  const updateField = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    onChange(newData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image (JPG, PNG).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image size must be less than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError("");

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.url;
      onChange({ ...data, profilePic: imageUrl });
      console.log("✅ Image uploaded to Cloudinary:", imageUrl);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setUploadError(
        err.response?.data?.message || "Failed to upload image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    ["fullName", "Full Name"],
    ["jobTitle", "Target Job Title"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["location", "Location"],
    ["linkedin", "LinkedIn"],
    ["github", "GitHub"],
  ];

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <Header
        icon={<UserRound size={19} />}
        title="Personal Information"
        text="Tell employers who you are."
      />

      <div className="mt-6 flex items-center gap-5 rounded-2xl border border-dashed border-gray-200 p-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
          {data?.profilePic ? (
            <img src={data.profilePic} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <UserRound className="text-gray-400" size={24} />
          )}
        </div>
        <div className="flex-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-brand">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload Profile Picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG supported. Max 2MB.</p>
          {uploadError && (
            <p className="mt-1 text-xs font-semibold text-red-500">{uploadError}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label]) => (
          <label key={name} className="text-sm font-bold text-gray-700">
            {label}
            <input
              name={name}
              value={data?.[name] || ""}
              onChange={updateField}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 font-medium outline-none focus:border-brand focus:ring-4 focus:ring-indigo-50"
            />
          </label>
        ))}
      </div>
    </section>
  );
};

const Header = ({ icon, title, text }) => (
  <div className="flex items-center gap-3">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
      {icon}
    </span>
    <div>
      <h2 className="font-black">{title}</h2>
      <p className="text-xs text-gray-400">{text}</p>
    </div>
  </div>
);

export default PersonalInfoForm;