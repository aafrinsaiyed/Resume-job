import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FileText, Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white shadow-soft">
            <FileText size={20} />
          </span>
          <div>
            <div className="text-lg font-black tracking-tight text-gray-900">CareerCraft</div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em] text-gray-400">
              Resume • Jobs
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-gray-200 p-2 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-5 py-3 md:hidden">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block rounded-xl bg-brand px-3 py-3 text-center font-semibold text-white hover:bg-indigo-700"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;