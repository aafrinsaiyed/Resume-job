// ✅ FIXED:
//  - No redirect loop
//  - Handles "no resume yet" gracefully (shows CTA instead of blank/redirect)
//  - Edit button goes to /builder?mode=edit
//  - Uses `api` helper (token auto-attached)
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileText, Plus } from "lucide-react";
import LivePreview from "../Builder/LivePreview";
import UserNavbar from "./UserNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const Preview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    api
      .get(`/get-resume/${userId}`)
      .then((res) => {
        setData(res.data.data || null);
      })
      .catch((err) => {
        console.error("Error fetching preview resume:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <UserNavbar />
        <main className="mx-auto max-w-4xl px-5 py-10 text-center text-gray-500">
          Loading preview...
        </main>
      </>
    );
  }

  // No resume yet — show a CTA, don't redirect
  if (!data) {
    return (
      <>
        <UserNavbar />
        <main className="mx-auto max-w-4xl px-5 py-10">
          <div className="mb-6 flex items-center justify-between">
            <BackButton fallback="/dashboard" />
          </div>
          <div className="rounded-[2rem] bg-white p-12 text-center shadow-soft">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <FileText />
            </div>
            <h1 className="mt-5 text-2xl font-black">No resume yet</h1>
            <p className="mt-2 text-gray-500">
              You haven't created a resume. Start building one to preview it here.
            </p>
            <Link
              to="/builder"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 font-bold text-white hover:bg-indigo-700"
            >
              <Plus size={18} /> Start Building
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Has resume — show preview
  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand">
              Resume Preview
            </p>
            <h1 className="text-3xl font-black">Your professional resume</h1>
          </div>
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" />
            <Link
              to="/builder?mode=edit"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Edit
            </Link>
          </div>
        </div>
        <LivePreview data={data} />
      </main>
    </>
  );
};

export default Preview;