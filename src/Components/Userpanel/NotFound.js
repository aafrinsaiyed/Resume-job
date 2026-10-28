import { Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.log("❌ 404 page reached");
  }, []);

  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-5 text-center">
      <div>
        <div className="text-8xl font-black text-brand">404</div>
        <h1 className="mt-3 text-3xl font-black">Page not found</h1>
        <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-brand px-6 py-3 font-bold text-white">
          Back Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;