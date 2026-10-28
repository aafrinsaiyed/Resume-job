import { BriefcaseBusiness, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

const ExperienceForm = ({ list, onChange }) => {
  useEffect(() => {
    console.log("💼 ExperienceForm mounted – current list:", list);
  }, [list]);

  const addExperience = () => {
    const newEntry = {
      id: Date.now(),
      role: "",
      company: "",
      duration: "",
      description: "",
    };
    const newList = [...list, newEntry];
    onChange(newList);
    console.log("➕ Experience added:", newEntry);
  };

  const updateExperience = (id, key, value) => {
    const updated = list.map((x) =>
      x.id === id ? { ...x, [key]: value } : x
    );
    onChange(updated);
    console.log(`✏️ Experience updated (${key}):`, { id, [key]: value });
  };

  const removeExperience = (id) => {
    const removed = list.find((x) => x.id === id);
    const newList = list.filter((x) => x.id !== id);
    onChange(newList);
    console.log(`❌ Experience removed:`, removed);
  };

  return (
    <Section
      title="Experience"
      icon={<BriefcaseBusiness size={19} />}
      action={
        <button
          onClick={addExperience}
          className="flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white"
        >
          <Plus size={14} /> Add
        </button>
      }
    >
      {list.length === 0 ? (
        <Empty text="No experience added yet." />
      ) : (
        list.map((x) => (
          <div
            key={x.id}
            className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["role", "Role"],
                ["company", "Company"],
                ["duration", "Duration"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  value={x[key] || ""}
                  onChange={(e) => updateExperience(x.id, key, e.target.value)}
                  placeholder={label}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-brand"
                />
              ))}
            </div>
            <textarea
              value={x.description || ""}
              onChange={(e) =>
                updateExperience(x.id, "description", e.target.value)
              }
              placeholder="What did you do?"
              rows="3"
              className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-brand"
            />
            <button
              onClick={() => removeExperience(x.id)}
              className="mt-3 flex items-center gap-1 text-xs font-bold text-red-500"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))
      )}
    </Section>
  );
};

const Section = ({ title, icon, action, children }) => (
  <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
          {icon}
        </span>
        <h2 className="font-black">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
);

const Empty = ({ text }) => (
  <div className="mt-5 rounded-2xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
    {text}
  </div>
);

export default ExperienceForm;