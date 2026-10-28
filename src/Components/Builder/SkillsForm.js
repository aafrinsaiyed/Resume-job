import { Plus, Tags, X } from "lucide-react";
import { useState, useEffect } from "react";

const SkillsForm = ({ list, onChange }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("🏷️ SkillsForm mounted – current list:", list);
  }, [list]);

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      const newList = [...list, trimmed];
      onChange(newList);
      console.log(`✅ Skill added: "${trimmed}"`);
      console.log("📦 Updated skill list:", newList);
    } else if (list.includes(trimmed)) {
      console.warn(`⚠️ Skill "${trimmed}" already exists.`);
    }
    setInput("");
  };

  const removeSkill = (skill) => {
    const newList = list.filter((x) => x !== skill);
    onChange(newList);
    console.log(`❌ Skill removed: "${skill}"`);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
          <Tags size={19} />
        </span>
        <h2 className="font-black">Skills</h2>
      </div>
      <div className="mt-5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          placeholder="e.g. React, Figma, SQL"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-brand"
        />
        <button
          onClick={addSkill}
          className="grid w-12 place-items-center rounded-xl bg-brand text-white"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {list.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-bold text-brand"
          >
            {s}
            <button onClick={() => removeSkill(s)}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </section>
  );
};

export default SkillsForm;