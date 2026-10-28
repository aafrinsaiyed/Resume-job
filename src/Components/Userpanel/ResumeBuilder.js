// ✅ FIXED — Critical fixes:
//  1. Auto-save ONLY runs after initial load (prevents wiping user data on mount)
//  2. Deep merges nested objects (personal) so partial saves work
//  3. Supports ?mode=edit for the "Edit" button from Preview
//  4. Empty resume → starts fresh (safe)
import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, BriefcaseBusiness } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PersonalInfoForm from "../Builder/PersonalInfoForm";
import SummaryForm from "../Builder/SummaryForm";
import ExperienceForm from "../Builder/ExperienceForm";
import EducationForm from "../Builder/EducationForm";
import SkillsForm from "../Builder/SkillsForm";
import ProjectsForm from "../Builder/ProjectsForm";
import CertificationsForm from "../Builder/CertificationsForm";
import LivePreview from "../Builder/LivePreview";
import UserNavbar from "./UserNavbar";
import api from "../../utils/api";

const initialData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    jobTitle: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

const ResumeBuilder = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?._id || currentUser?.id || "guest";

  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const [resumeData, setResumeData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ gate for auto-save
  const previewRef = useRef(null);

  // -------- LOAD --------
  useEffect(() => {
    if (userId === "guest") {
      setIsLoaded(true);
      return;
    }

    api
      .get(`/get-resume/${userId}`)
      .then((res) => {
        const stored = res.data.data;
        if (stored) {
          // ✅ Deep merge so partial data is safe
          setResumeData({
            personal: { ...initialData.personal, ...(stored.personal || {}) },
            summary: stored.summary || "",
            experiences: stored.experiences || stored.experience || [], // backward-compat
            education: stored.education || [],
            skills: stored.skills || [],
            projects: stored.projects || [],
            certifications: stored.certifications || [],
          });
        }
        // if no stored → keep initialData (fresh resume)
      })
      .catch((err) => {
        console.error("Error fetching resume:", err);
      })
      .finally(() => {
        setIsLoaded(true); // ✅ allow saves only after load completes
      });
  }, [userId]);

  // -------- AUTO SAVE --------
  // ✅ Skip the very first render (isLoaded === false).
  //    Only save once real data has been loaded (or guest is ready).
  useEffect(() => {
    if (!isLoaded) return;
    if (userId === "guest") return;

    const timeout = setTimeout(() => {
      api
        .post("/save-resume", { userId, ...resumeData })
        .catch((err) => console.error("Error auto-saving resume:", err));
    }, 600); // ✅ debounce 600ms so we don't spam on every keystroke

    return () => clearTimeout(timeout);
  }, [resumeData, userId, isLoaded]);

  const updateSection = (section, value) => {
    setResumeData((prev) => ({ ...prev, [section]: value }));
  };

  const completion = useMemo(() => {
    const checks = [
      !!resumeData.personal?.fullName,
      !!resumeData.personal?.email,
      !!resumeData.personal?.jobTitle,
      !!resumeData.summary,
      resumeData.experiences?.length > 0,
      resumeData.education?.length > 0,
      resumeData.skills?.length > 0,
      resumeData.projects?.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [resumeData]);

  const scrollPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand">
              Resume Builder
            </p>
            <h1 className="mt-1 text-3xl font-black">
              {isEditMode ? "Edit your resume" : "Create your career profile"}
            </h1>
            <p className="mt-2 text-gray-500">
              Your information is saved automatically to the database.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-soft">
              <span className="text-xs font-bold text-gray-400">COMPLETION</span>
              <div className="text-xl font-black text-brand">{completion}%</div>
            </div>
            <Link
              to="/jobs"
              className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-5 py-3 font-bold text-brand hover:bg-indigo-100"
            >
              <BriefcaseBusiness size={18} /> Find Jobs
            </Link>
            <Link
              to="/preview"
              className="flex items-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white hover:bg-indigo-700"
            >
              <Eye size={18} /> Preview
            </Link>
          </div>
        </div>

        {!isLoaded ? (
          <div className="py-20 text-center text-gray-500 font-semibold">
            Loading your resume...
          </div>
        ) : (
          <div className="grid gap-7 lg:grid-cols-7">
            <div className="space-y-5 lg:col-span-4">
              <PersonalInfoForm
                data={resumeData.personal || {}}
                onChange={(v) => updateSection("personal", v)}
              />
              <SummaryForm
                value={resumeData.summary}
                onChange={(v) => updateSection("summary", v)}
              />
              <ExperienceForm
                list={resumeData.experiences || []}
                onChange={(v) => updateSection("experiences", v)}
              />
              <EducationForm
                list={resumeData.education || []}
                onChange={(v) => updateSection("education", v)}
              />
              <SkillsForm
                list={resumeData.skills || []}
                onChange={(v) => updateSection("skills", v)}
              />
              <ProjectsForm
                list={resumeData.projects || []}
                onChange={(v) => updateSection("projects", v)}
              />
              <CertificationsForm
                list={resumeData.certifications || []}
                onChange={(v) => updateSection("certifications", v)}
              />
            </div>
            <div ref={previewRef} className="lg:col-span-3">
              <div className="sticky top-24">
                <LivePreview data={resumeData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ResumeBuilder;