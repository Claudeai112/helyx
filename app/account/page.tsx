import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Helyx Peptides account.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="mt-4 text-muted-foreground">Account management is coming soon.</p>
    </div>
  );
}
