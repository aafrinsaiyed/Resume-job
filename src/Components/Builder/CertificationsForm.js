import { Award, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

const CertificationsForm = ({ list, onChange }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("📜 CertificationsForm mounted – current list:", list);
  }, [list]);

  const addCertification = () => {
    const trimmed = input.trim();
    if (trimmed) {
      const newList = [...list, trimmed];
      onChange(newList);
      console.log(`✅ Certification added: "${trimmed}"`);
      console.log("📦 New certification list:", newList);
    }
    setInput("");
  };

  const removeCertification = (index) => {
    const removed = list[index];
    const newList = list.filter((_, i) => i !== index);
    onChange(newList);
    console.log(`❌ Certification removed: "${removed}"`);
    console.log("📦 Updated certification list:", newList);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
          <Award size={19} />
        </span>
        <h2 className="font-black">Certifications</h2>
      </div>
      <div className="mt-5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCertification()}
          placeholder="Certification name"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-brand"
        />
        <button
          onClick={addCertification}
          className="grid w-12 place-items-center rounded-xl bg-brand text-white"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {list.map((x, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 font-semibold"
          >
            <span>{x}</span>
            <button
              onClick={() => removeCertification(i)}
              className="text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificationsForm;