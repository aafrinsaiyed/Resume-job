import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) navigate("/dashboard");
  }, [navigate]);

  const handleSendReset = () => {
    if (!email) return;

    // Simulate sending reset link
    const resetRequests = JSON.parse(localStorage.getItem("resetRequests") || "[]");
    resetRequests.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem("resetRequests", JSON.stringify(resetRequests));

    console.log(`🔐 Reset link requested for: ${email}`);
    console.log("📦 Stored reset requests:", resetRequests);

    setSent(true);

    // Auto-hide the success message after 5 seconds
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand">
          <Mail />
        </div>

        <h1 className="mt-5 text-3xl font-black">Reset password</h1>
        <p className="mt-2 text-gray-500">
          Enter your email to receive reset instructions.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">
            ✅ Reset link sent! Check your console for details.
          </div>
        ) : (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-6 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-brand"
              placeholder="you@example.com"
            />
            <button
              onClick={handleSendReset}
              className="mt-4 w-full rounded-2xl bg-brand py-3 font-bold text-white hover:bg-indigo-700"
            >
              Send Reset Link
            </button>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-600"
        >
          <ArrowLeft size={16} /> Back to login
        </Link>
      </div>
    </main>
  );
};

export default ForgotPassword;