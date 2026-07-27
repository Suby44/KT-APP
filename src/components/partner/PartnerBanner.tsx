import { usePartnerView } from "../../context/PartnerViewContext";

export function PartnerBanner() {
  const { unlink } = usePartnerView();
  return (
    <div className="flex items-center justify-between bg-lavender-100 px-5 py-2 text-xs font-medium text-lavender-600">
      <span>👀 Viewing your partner's data (read-only)</span>
      <button type="button" onClick={unlink} className="underline">
        Unlink
      </button>
    </div>
  );
}
