"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PurePepsLogo } from "./brand/pure-peps-logo";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/category/glp-1", label: "GLP-1" },
  { href: "/stacks", label: "Stacks" },
  { href: "/consultation", label: "Consultation" },
  { href: "/waitlist?program=ambassador", label: "Ambassador" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl backdrop-saturate-150 border-b border-[rgba(40,224,200,0.15)] bg-[rgba(5,5,16,0.85)]"
          : ""
      }`}
    >
      <div className="flex w-full max-w-[1300px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <PurePepsLogo className="size-[38px] shrink-0 transition-[filter] duration-300" />
          <div className="font-display leading-tight">
            <span className="block text-[1.2rem] font-bold tracking-widest text-white">PURE PEPS</span>
            <span className="block text-[0.65rem] font-medium uppercase tracking-[3px] text-[#28e0c8]">
              Peptide
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group relative text-sm font-medium text-[#a0a0c0] transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 origin-right scale-x-0 bg-gradient-to-r from-[#28e0c8] to-[#00a896] transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-full bg-gradient-to-br from-[#28e0c8] to-[#00a896] px-6 py-2.5 text-[0.85rem] font-semibold text-[#050510] shadow-[0_4px_20px_rgba(40,224,200,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(40,224,200,0.5)]"
            >
              Start Consultation
            </Link>
          </li>
        </ul>

        <button
          aria-label="Toggle menu"
          className="flex flex-col gap-[5px] md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`block h-0.5 w-7 rounded-sm bg-white transition-all ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-7 rounded-sm bg-white transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-7 rounded-sm bg-white transition-all ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[calc(100%+1px)] mx-6 rounded-2xl border border-white/10 bg-[rgba(5,5,16,0.95)] p-6 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-lg font-medium text-[#a0a0c0] hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/consultation"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center rounded-full bg-gradient-to-br from-[#28e0c8] to-[#00a896] px-6 py-3 text-sm font-semibold text-[#050510]"
              >
                Start Consultation
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
