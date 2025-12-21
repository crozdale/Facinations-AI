import { Link } from "react-router-dom";

export default function ActionLink({ to, children }) {
  return (
    <Link
      to={to}
      className="
        inline-flex items-center justify-center
        rounded-md
        border border-blue-600
        bg-blue-50
        px-4 py-2
        text-sm font-semibold
        text-blue-700
        hover:bg-blue-100
        hover:border-blue-700
        transition
      "
    >
      {children}
    </Link>
  );
}
