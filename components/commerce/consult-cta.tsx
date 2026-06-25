import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConsultCTA({
  productName,
  status,
  unlocked = false,
}: {
  productName: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST";
  unlocked?: boolean;
}) {
  if (unlocked && status === "ACTIVE") {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-primary">Access active</span>
        <Button size="lg" render={<Link href="/cart" />}>Continue to your order</Button>
      </div>
    );
  }
  if (status === "ACTIVE") {
    return (
      <Button size="lg" render={<Link href={`/consultation?product=${encodeURIComponent(productName)}`} />}>
        Start Consultation
      </Button>
    );
  }
  return (
    <Button size="lg" variant="outline" render={<Link href={`/waitlist?product=${encodeURIComponent(productName)}`} />}>
      Join Waitlist
    </Button>
  );
}
