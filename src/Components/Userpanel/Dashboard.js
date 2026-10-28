
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Plus,
  Target,
  UserRound,
} from "lucide-react";
import UserNavbar from "./UserNavbar";
import ChatBot from "../ChatBot";
import api from "../../utils/api";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );
    const userId = currentUser?._id || currentUser?.id;

    if (userId) {
      api.get(`/get-resume/${userId}`)
        .then((res) => {
          const stored = res.data.data;
          setResume(stored);
          setSkills(stored?.skills || []);
        })
        .catch((err) =>
          console.error("Error fetching resume:", err)
        );
    }
  }, []);

  return (
    <>
      <UserNavbar />

      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="rounded-[2rem] bg-gradient-to-r from-indigo-950 to-brand p-8 text-white shadow-soft">
          <p className="text-sm font-bold text-indigo-200">
            WELCOME BACK
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Your career dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Build your resume and discover opportunities that match your profile.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/builder"
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-brand"
            >
              <Plus size={18} /> Build Resume
            </Link>

            <Link
              to="/jobs"
              className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold"
            >
              <BriefcaseBusiness size={18} /> Find Jobs
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <Stat
            icon={<FileText />}
            title="Resume"
            value={resume ? "In Progress" : "Not Started"}
          />
          <Stat
            icon={<Target />}
            title="Skills Added"
            value={skills.length}
          />
          <Stat
            icon={<BriefcaseBusiness />}
            title="Recommended Jobs"
            value={skills.length ? "8+" : "Add skills"}
          />
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-soft">
            <h2 className="text-xl font-black">Quick actions</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Action
                to="/builder"
                icon={<FileText />}
                text="Edit Resume"
              />
              <Action
                to="/jobs"
                icon={<BriefcaseBusiness />}
                text="View Jobs"
              />
              <Action
                to="/templates"
                icon={<FileText />}
                text="Choose Template"
              />
              <Action
                to="/profile"
                icon={<UserRound />}
                text="Update Profile"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-soft">
            <h2 className="text-xl font-black">
              Your profile snapshot
            </h2>
            <p className="mt-2 text-gray-500">
              Skills used for recommendations:
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-indigo-50 px-3 py-2 text-sm font-bold text-brand"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <Link to="/builder" className="font-bold text-brand">
                  Add skills to get recommendations →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Chatbot for User Panel */}
      <ChatBot panel="user" />
    </>
  );
};

const Stat = ({ icon, title, value }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
      {icon}
    </div>
    <p className="mt-5 text-sm font-bold text-gray-400">{title}</p>
    <p className="mt-1 text-2xl font-black">{value}</p>
  </div>
);

const Action = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold hover:border-indigo-100 hover:bg-indigo-50"
  >
    <span className="text-brand">{icon}</span>
    {text}
  </Link>
);

export default Dashboard;
