import { BRAND } from "../brand/brandAssets";

export default function Footer() {
  return (
    <footer className="flex justify-center py-10 border-t bg-white">
      <img
        src={BRAND.FACINATIONS.SIGIL}
        alt="Façinations Sigil"
        className="h-12 w-auto opacity-80"
      />
    </footer>
  );
}

