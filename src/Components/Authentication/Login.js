// ✅ PATCHED:
//  - Removed hardcoded admin@gmail.com check — now uses real backend role
//  - Redirects based on role: admin → /admin, recruiter → /recruiter, user → /dashboard
//  - Stores token in localStorage
//  - Same design/UI — no visual changes
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // If already logged in, redirect based on role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "recruiter") navigate("/recruiter");
      else navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email: form.email,
        password: form.password,
      });

      if (response.data.status === 1) {
        const uData = response.data.data;
        const token = response.data.token || "";

        localStorage.setItem("token", token);

        const userData = {
          _id: uData._id,
          name: uData.name,
          email: uData.email,
          phone: uData.phone,
          address: uData.address,
          company: uData.company || "",
          role: uData.role || "user", // ✅ from backend now
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // ✅ Role-based redirect
        if (userData.role === "admin") navigate("/admin");
        else if (userData.role === "recruiter") navigate("/recruiter");
        else navigate("/dashboard");
      } else {
        setError(response.data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Server error during login. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-indigo-950 to-brand p-12 text-white lg:block">
          <p className="font-black tracking-tight">CareerCraft</p>
          <h1 className="mt-24 text-5xl font-black leading-tight">Turn your skills into opportunities.</h1>
          <p className="mt-5 text-indigo-100">Create your resume and discover roles that fit your profile.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
          <h2 className="text-3xl font-black text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-500">Sign in to continue to your career dashboard.</p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <label className="mt-7 block text-sm font-bold text-gray-700">Email</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 focus-within:border-brand">
            <Mail size={18} className="text-gray-400" />
            <input
              className="w-full py-3 outline-none"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <label className="mt-5 block text-sm font-bold text-gray-700">Password</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 focus-within:border-brand">
            <LockKeyhole size={18} className="text-gray-400" />
            <input
              className="w-full py-3 outline-none"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="mt-3 text-right">
            <Link to="/forgot-password" className="text-sm font-bold text-brand">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-bold text-white hover:bg-indigo-700"
          >
            Sign In <ArrowRight size={18} />
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{" "}
            <Link to="/register" className="font-bold text-brand">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;