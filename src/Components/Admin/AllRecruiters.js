// ✅ NEW: Lists all recruiters with Edit + Delete actions
//  - Edit opens a small inline modal to update name, company, phone
//  - Delete asks for confirmation
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Pencil, Trash2, UserPlus, X } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import BackButton from "../BackButton";
import api from "../../utils/api";

const AllRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchRecruiters = async () => {
    try {
      const res = await api.get("/get-user");
      const all = res.data.data || [];
      setRecruiters(all.filter((u) => u.role === "recruiter"));
    } catch (err) {
      console.error("Error fetching recruiters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete recruiter "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/delete-user/${id}`);
      fetchRecruiters();
    } catch (err) {
      console.error("Error deleting recruiter:", err);
      alert(err.response?.data?.message || "Failed to delete recruiter");
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await api.put(`/update-user/${editing._id}`, {
        name: editing.name,
        phone: editing.phone,
        company: editing.company,
      });
      setEditing(null);
      fetchRecruiters();
    } catch (err) {
      console.error("Error updating recruiter:", err);
      alert(err.response?.data?.message || "Failed to update recruiter");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <ListChecks />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                Admin
              </p>
              <h1 className="text-3xl font-black">All Recruiters</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BackButton fallback="/admin" />
            <Link
              to="/admin/recruiters/add"
              className="flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <UserPlus size={17} /> Add Recruiter
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 font-semibold">Loading...</div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-5">Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5">Company</th>
                    <th className="p-5">Phone</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.length ? (
                    recruiters.map((r) => (
                      <tr key={r._id} className="border-t border-gray-100">
                        <td className="p-5 font-bold">{r.name}</td>
                        <td className="p-5">{r.email}</td>
                        <td className="p-5">{r.company || "—"}</td>
                        <td className="p-5">{r.phone || "—"}</td>
                        <td className="p-5">
                          <button
                            onClick={() => setEditing({ ...r })}
                            className="mr-2 inline-block rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(r._id, r.name)}
                            className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-gray-500">
                        No recruiters yet.{" "}
                        <Link
                          to="/admin/recruiters/add"
                          className="font-bold text-brand"
                        >
                          Add your first recruiter →
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black">Edit Recruiter</h2>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-3">
              <label className="text-sm font-bold block">
                Name
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
                />
              </label>
              <label className="text-sm font-bold block">
                Phone
                <input
                  value={editing.phone || ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
                />
              </label>
              <label className="text-sm font-bold block">
                Company
                <input
                  value={editing.company || ""}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
                />
              </label>
              <p className="text-xs text-gray-500">
                Email and password cannot be changed here.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-brand py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllRecruiters;