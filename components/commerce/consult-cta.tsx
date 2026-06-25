import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConsultCTA({
  productName,
  status,
}: {
  productName: string;
  status: "ACTIVE" | "COMING_SOON" | "WAITLIST";
}) {
  if (status === "ACTIVE") {
    return (
      <Button
        size="lg"
        render={<Link href={`/consultation?product=${encodeURIComponent(productName)}`} />}
      >
        Start Consultation
      </Button>
    );
  }
  return (
    <Button
      size="lg"
      variant="outline"
      render={<Link href={`/waitlist?product=${encodeURIComponent(productName)}`} />}
    >
      Join Waitlist
    </Button>
  );
}
