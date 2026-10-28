import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

const ProjectsForm = ({ list, onChange }) => {
  useEffect(() => {
    console.log("📁 ProjectsForm mounted – current list:", list);
  }, [list]);

  const addProject = () => {
    const newEntry = { id: Date.now(), title: "", description: "", link: "" };
    const newList = [...list, newEntry];
    onChange(newList);
    console.log("➕ Project added:", newEntry);
  };

  const updateProject = (id, key, value) => {
    const updated = list.map((x) =>
      x.id === id ? { ...x, [key]: value } : x
    );
    onChange(updated);
    console.log(`✏️ Project updated (${key}):`, { id, [key]: value });
  };

  const removeProject = (id) => {
    const removed = list.find((x) => x.id === id);
    const newList = list.filter((x) => x.id !== id);
    onChange(newList);
    console.log(`❌ Project removed:`, removed);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
            <FolderKanban size={19} />
          </span>
          <h2 className="font-black">Projects</h2>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {list.map((x) => (
        <div key={x.id} className="mt-5 rounded-2xl bg-gray-50 p-4">
          <input
            value={x.title || ""}
            onChange={(e) => updateProject(x.id, "title", e.target.value)}
            placeholder="Project title"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-brand"
          />
          <textarea
            value={x.description || ""}
            onChange={(e) => updateProject(x.id, "description", e.target.value)}
            placeholder="Project description"
            rows="3"
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-brand"
          />
          <input
            value={x.link || ""}
            onChange={(e) => updateProject(x.id, "link", e.target.value)}
            placeholder="Project URL"
            className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-brand"
          />
          <button
            onClick={() => removeProject(x.id)}
            className="mt-3 flex items-center gap-1 text-xs font-bold text-red-500"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      ))}
    </section>
  );
};

export default ProjectsForm;