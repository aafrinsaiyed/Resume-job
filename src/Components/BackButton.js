import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
    console.log("🔙 Back button clicked – navigated to previous page or fallback");
  };
  return (
    <button
      onClick={goBack}
      className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand transition"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
};

export default BackButton;