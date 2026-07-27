import { Button } from "../../components/ui/Button";

export function PartnerStatusScreen({ message, onUnlink }: { message: string; onUnlink: () => void }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-cream-50 px-6 text-center">
      <div className="mb-4 text-5xl">🔄</div>
      <p className="max-w-xs text-neutral-600">{message}</p>
      <Button variant="secondary" className="mt-6" onClick={onUnlink}>
        Use a different code
      </Button>
    </div>
  );
}
