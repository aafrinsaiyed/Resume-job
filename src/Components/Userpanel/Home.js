import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, FileText, Sparkles, Target } from "lucide-react";
import Navbar from "../Navbar";

const features = [
  ["Build a polished resume", "Complete guided sections and see your resume update instantly.", FileText],
  ["Discover matching jobs", "Your skills, education and experience help surface relevant opportunities.", Target],
  ["Keep everything organized", "Save your resume and bookmarked jobs in one simple dashboard.", BriefcaseBusiness],
];

const Home = () => {
  useEffect(() => {
    console.log("🏠 Home page loaded");
  }, []);

  return (
    <div className="min-h-screen bg-soft">
      <Navbar />
      <main>
        <section className="overflow-hidden bg-gradient-to-br from-indigo-950 via-brand to-violet-600 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> Resume + Career Platform
              </span>
              <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                Build your resume. <span className="text-indigo-200">Find your next job.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                Create a professional resume and discover job opportunities that match your skills, education and experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-brand shadow-xl hover:bg-indigo-50"
                >
                  Create Resume <ArrowRight size={18} />
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-3 font-bold hover:bg-white/15"
                >
                  Explore Jobs
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <div className="rounded-3xl bg-white p-6 text-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand">Profile Match</p>
                      <h3 className="mt-1 text-2xl font-black">Frontend Developer</h3>
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-xl font-black text-brand">
                      92%
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {["React", "JavaScript", "Tailwind CSS", "Responsive Design"].map((skill) => (
                      <div key={skill} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
                        <CheckCircle2 className="text-emerald-500" size={18} />
                        <span className="font-semibold">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-black uppercase tracking-widest text-brand">Everything in one place</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">From resume creation to job discovery.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(([title, text, Icon]) => (
              <div key={title} className="rounded-3xl border border-gray-200 bg-white p-7 shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-2 leading-7 text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;