// ✅ PATCHED: now stores token from backend (if any) + redirects based on role
//    (new registrations will always be role: "user")
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserRound, Mail, LockKeyhole } from "lucide-react";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/add-user", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      const newUser = response.data.data;
      const userData = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role || "user",
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      // No token returned on register — user must log in for a token
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed or email already exists.");
      console.error(err);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", Icon: UserRound, type: "text" },
    { name: "email", label: "Email", Icon: Mail, type: "email" },
    { name: "password", label: "Password", Icon: LockKeyhole, type: "password" },
    { name: "confirm", label: "Confirm Password", Icon: LockKeyhole, type: "password" },
  ];

  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft sm:p-10"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand">
          <UserRound />
        </div>

        <h1 className="mt-5 text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-gray-500">
          Start building your resume and exploring jobs.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {fields.map(({ name, label, Icon, type }) => (
          <div key={name} className="mt-5">
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 focus-within:border-brand">
              <Icon size={18} className="text-gray-400" />
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                className="w-full py-3 outline-none"
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-7 w-full rounded-2xl bg-brand py-3.5 font-bold text-white hover:bg-indigo-700"
        >
          Create Account
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-brand">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Registration;