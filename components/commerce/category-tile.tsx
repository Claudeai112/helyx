import Link from "next/link";

export function CategoryTile({
  category,
}: {
  category: { slug: string; name: string; description: string };
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40"
    >
      <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
    </Link>
  );
}
