export default function GalleryCard({ item }) {
  return (
    <div className="rounded-xl border shadow-sm p-4 bg-white">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-64 object-cover rounded mb-3"
      />

      <h3 className="text-lg font-semibold">{item.name}</h3>

      <p className="text-sm text-gray-500 mt-1">
        Royalty: {item.royaltyPercent}%
      </p>

      <p className="text-xs text-gray-400 break-all mt-1">
        Receiver: {item.royaltyReceiver}
      </p>
    </div>
  );
}
