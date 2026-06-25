import { redirect } from "next/navigation";

// Stacks live in a section on the unified storefront; detail pages remain at /stacks/[slug].
export default function StacksPage() {
  redirect("/#stacks");
}
