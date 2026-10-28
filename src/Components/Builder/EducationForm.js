import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

const EducationForm = ({ list, onChange }) => {
  useEffect(() => {
    console.log("🎓 EducationForm mounted – current list:", list);
  }, [list]);

  const addEducation = () => {
    const newEntry = { id: Date.now(), degree: "", institute: "", year: "" };
    const newList = [...list, newEntry];
    onChange(newList);
    console.log("➕ Education added:", newEntry);
    console.log("📦 Updated education list:", newList);
  };

  const updateEducation = (id, key, value) => {
    const updated = list.map((x) =>
      x.id === id ? { ...x, [key]: value } : x
    );
    onChange(updated);
    console.log(`✏️ Education updated (${key}):`, { id, [key]: value });
  };

  const removeEducation = (id) => {
    const removed = list.find((x) => x.id === id);
    const newList = list.filter((x) => x.id !== id);
    onChange(newList);
    console.log(`❌ Education removed:`, removed);
    console.log("📦 Updated education list:", newList);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
            <GraduationCap size={19} />
          </span>
          <h2 className="font-black">Education</h2>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {list.map((x) => (
        <div
          key={x.id}
          className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2"
        >
          {[
            ["degree", "Degree"],
            ["institute", "Institute"],
            ["year", "Year"],
          ].map(([key, label]) => (
            <input
              key={key}
              value={x[key] || ""}
              onChange={(e) => updateEducation(x.id, key, e.target.value)}
              placeholder={label}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-brand"
            />
          ))}
          <button
            onClick={() => removeEducation(x.id)}
            className="flex items-center gap-1 text-xs font-bold text-red-500"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      ))}
    </section>
  );
};

export default EducationForm;