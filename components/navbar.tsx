"use client";
import Link from "next/link";
import { useState } from "react";
import { HelyxLogo } from "@/components/brand/helyx-logo";
import { useCart } from "@/components/cart/cart-provider";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/category/glp-1", label: "GLP-1" },
  { href: "/category/healing", label: "Healing" },
  { href: "/category/fat-loss", label: "Fat Loss" },
  { href: "/stacks", label: "Stacks" },
  { href: "/bulk", label: "Bulk Orders" },
  { href: "/ambassador", label: "Ambassador" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="shrink-0"><HelyxLogo /></Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/account" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Account</Link>
          <Link href="/cart" className="relative text-sm font-medium text-foreground">
            Cart
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">{count}</span>
            )}
          </Link>
          <button type="button" aria-label="Menu" className="lg:hidden" onClick={() => setOpen((o) => !o)}>
            <span className="block h-0.5 w-5 bg-foreground" /><span className="mt-1 block h-0.5 w-5 bg-foreground" /><span className="mt-1 block h-0.5 w-5 bg-foreground" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-6 py-4 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
