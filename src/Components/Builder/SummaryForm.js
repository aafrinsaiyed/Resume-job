import { FileText, Sparkles } from "lucide-react";
import { useEffect } from "react";

const SummaryForm = ({ value, onChange }) => {
  useEffect(() => {
    console.log("📝 SummaryForm loaded – current value:", value);
  }, [value]);

  const suggestSummary = () => {
    const suggestion =
      value ||
      "Motivated professional with strong problem-solving skills, practical project experience and a passion for continuous learning.";
    onChange(suggestion);
    console.log("✨ Suggested summary:", suggestion);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    console.log("✏️ Summary updated:", e.target.value);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand">
            <FileText size={19} />
          </span>
          <div>
            <h2 className="font-black">Professional Summary</h2>
            <p className="text-xs text-gray-400">
              A short introduction for recruiters.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={suggestSummary}
          className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-brand"
        >
          <Sparkles size={14} /> Suggest
        </button>
      </div>
      <textarea
        value={value || ""}
        onChange={handleChange}
        rows="5"
        className="mt-5 w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-brand focus:ring-4 focus:ring-indigo-50"
        placeholder="Write a professional summary..."
      />
    </section>
  );
};

export default SummaryForm;