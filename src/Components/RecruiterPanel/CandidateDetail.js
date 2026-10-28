import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserRound } from "lucide-react";
import RecruiterNavbar from "./RecruiterNavbar";
import BackButton from "../BackButton";
import LivePreview from "../Builder/LivePreview";
import api from "../../utils/api";

const CandidateDetail = () => {
  const { userId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/recruiter/candidates/${userId}/resume`)
      .then((res) => setResume(res.data.data))
      .catch((err) => {
        console.error(err);
        setError("Candidate resume not available or you don't have access.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <>
      <RecruiterNavbar />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-brand">
              <UserRound />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand">
                Candidate
              </p>
              <h1 className="text-3xl font-black">Resume</h1>
            </div>
          </div>
          <BackButton fallback="/recruiter/pipeline" />
        </div>

        {loading && <div className="text-center py-16 text-gray-500">Loading...</div>}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {resume ? (
              <LivePreview data={resume} />
            ) : (
              <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-soft">
                This candidate hasn't created a resume yet.
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default CandidateDetail;