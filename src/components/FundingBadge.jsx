export default function FundingBadge({ isFullyFunded }) {
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
        isFullyFunded ? "bg-blue-600 text-white" : "bg-gray-800 text-white/90",
      ].join(" ")}
    >
      {isFullyFunded ? "Fully Funded" : "Not Fully Funded"}
    </span>
  );
}
