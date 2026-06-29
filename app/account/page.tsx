import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { AuthForms } from "@/components/auth/auth-forms";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create your Helyx Peptides account.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-20">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>

      {user ? (
        <div className="mt-6 max-w-md rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="mt-1 font-medium text-foreground">{user.name ?? user.email}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Go to cart
            </Link>
            <SignOutButton />
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-muted-foreground">
            Sign in to your account, or create one to check out.
          </p>
          <div className="mt-6">
            <AuthForms />
          </div>
        </>
      )}
    </div>
  );
}
