"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Size = "default" | "sm" | "lg";

// Add-to-cart button that flashes an animated checkmark + "Added" for a moment
// after a click, so the client gets clear confirmation the item was added.
export function AddToCartButton({
  onAdd,
  label = "Add to cart",
  className,
  size = "default",
}: {
  onAdd: () => void;
  label?: string;
  className?: string;
  size?: Size;
}) {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleClick = () => {
    onAdd();
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button className={className} size={size} onClick={handleClick} aria-live="polite">
      {added ? (
        <span className="inline-flex items-center gap-1.5">
          <svg className="add-check size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 13l4 4L19 7" />
          </svg>
          Added
        </span>
      ) : (
        label
      )}
    </Button>
  );
}
