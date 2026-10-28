import { useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const templates = ["Modern Minimal", "Classic Professional", "Creative Edge", "Executive"];

const TemplateSelect = () => {
  const [selected, setSelected] = useState(() => {
    const stored = localStorage.getItem("template") || templates[0];
    return stored;
  });

  const chooseTemplate = (t) => {
    setSelected(t);
    localStorage.setItem("template", t);
  };

  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <p className="text-sm font-black uppercase tracking-widest text-brand">Templates</p>
        <h1 className="mt-1 text-3xl font-black">Choose your resume style</h1>
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((t) => (
            <button
              key={t}
              onClick={() => chooseTemplate(t)}
              className={`rounded-3xl border-2 bg-white p-4 text-left shadow-soft ${
                selected === t ? "border-brand" : "border-transparent"
              }`}
            >
              <div className="aspect-[3/4] rounded-2xl bg-gray-50 p-5">
                <div className="h-4 w-2/3 rounded bg-gray-900" />
                <div className="mt-5 h-2 w-full rounded bg-gray-200" />
                <div className="mt-2 h-2 w-4/5 rounded bg-gray-200" />
                <div className="mt-8 grid grid-cols-3 gap-2">
                  <span className="h-24 rounded bg-indigo-100" />
                  <span className="col-span-2 h-24 rounded bg-gray-100" />
                </div>
              </div>
              <h2 className="mt-4 font-black">{t}</h2>
              <p className="mt-1 text-xs text-gray-500">{selected === t ? "Selected" : "Click to select"}</p>
            </button>
          ))}
        </div>
        <Link to="/preview" className="mt-8 inline-block rounded-2xl bg-brand px-6 py-3 font-bold text-white">
          Continue to Preview
        </Link>
      </main>
    </>
  );
};

export default TemplateSelect;