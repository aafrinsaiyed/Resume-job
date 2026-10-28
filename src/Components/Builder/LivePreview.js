import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

const LivePreview = ({ data }) => {
  const resumeRef = useRef(null);

  useEffect(() => {
    // console.log("👁️ LivePreview rendered with data:", data);
  }, [data]);

  const p = data?.personal || data?.personalInfo || {};
  const experiences = data?.experiences || data?.experience || [];

  // ✅ PDF Download Handler
  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${p.fullName || "Resume"}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="relative">
      {/* ✅ Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-xs font-bold text-white backdrop-blur hover:bg-white/30"
      >
        <Download size={14} /> Download PDF
      </button>

      <div
        ref={resumeRef}
        className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-soft"
      >
        <div className="bg-gradient-to-r from-indigo-950 to-brand p-7 text-white">
          {p.profilePic && (
            <div className="mb-4">
              <img
                src={p.profilePic}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-4 border-white/20 shadow-lg"
              />
            </div>
          )}

          <h1 className="text-3xl font-black">{p.fullName || "Your Name"}</h1>
          <p className="mt-1 font-semibold text-indigo-100">
            {p.jobTitle || "Target Job Title"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-indigo-100">
            {[p.email, p.phone, p.location]
              .filter(Boolean)
              .map((x) => (
                <span key={x} className="rounded-full bg-white/10 px-3 py-1">
                  {x}
                </span>
              ))}
          </div>
        </div>
        <div className="space-y-6 p-7 text-sm">
          <Block title="Profile">
            {data?.summary || "Your professional summary will appear here."}
          </Block>

          <Block title="Skills">
            <div className="flex flex-wrap gap-2">
              {data?.skills?.length ? (
                data.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 font-bold text-brand"
                  >
                    {s}
                  </span>
                ))
              ) : (
                "Add your skills."
              )}
            </div>
          </Block>

          <Block title="Experience">
            {experiences.length ? (
              experiences.map((x, i) => (
                <div key={x.id || i} className="mb-4">
                  <div className="font-black">
                    {x.role || "Role"} · {x.company || "Company"}
                  </div>
                  <div className="text-xs text-gray-400">{x.duration}</div>
                  <p className="mt-1 text-gray-600">{x.description}</p>
                </div>
              ))
            ) : (
              "Add your experience."
            )}
          </Block>

          <Block title="Education">
            {data?.education?.length ? (
              data.education.map((x, i) => (
                <div key={x.id || i} className="mb-3">
                  <b>{x.degree}</b>
                  <div className="text-gray-500">
                    {x.institute} · {x.year}
                  </div>
                </div>
              ))
            ) : (
              "Add your education."
            )}
          </Block>

          <Block title="Projects">
            {data?.projects?.length ? (
              data.projects.map((x, i) => (
                <div key={x.id || i} className="mb-3">
                  <b>{x.title}</b>
                  <p className="text-gray-600">{x.description}</p>
                  {x.link && (
                    <a
                      href={x.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-brand"
                    >
                      View project →
                    </a>
                  )}
                </div>
              ))
            ) : (
              "Add your projects."
            )}
          </Block>

          <Block title="Certifications">
            {data?.certifications?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.certifications.map((c, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-emerald-50 px-3 py-1.5 font-bold text-emerald-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              "Add your certifications."
            )}
          </Block>
        </div>
      </div>
    </div>
  );
};

const Block = ({ title, children }) => (
  <section>
    <h2 className="border-b border-gray-100 pb-2 text-xs font-black uppercase tracking-widest text-brand">
      {title}
    </h2>
    <div className="mt-3 leading-6 text-gray-700">{children}</div>
  </section>
);

export default LivePreview;