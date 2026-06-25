"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  filterAndSort,
  EMPTY_FILTER,
  type StorefrontItem,
  type FilterState,
  type SortKey,
} from "@/lib/storefront-filter";
import { ProductCard } from "@/components/commerce/product-card";

type Category = { slug: string; name: string };

type FilterPanelProps = {
  state: FilterState;
  categories: Category[];
  mgOptions: number[];
  onChange: (partial: Partial<FilterState>) => void;
  onClear: () => void;
};

function FilterPanel({ state, categories, mgOptions, onChange, onClear }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Category</p>
        <div className="flex flex-col gap-1.5">
          {categories.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                checked={state.categories.includes(c.slug)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...state.categories, c.slug]
                    : state.categories.filter((s) => s !== c.slug);
                  onChange({ categories: next });
                }}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={state.priceMin ?? ""}
            onChange={(e) =>
              onChange({ priceMin: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            value={state.priceMax ?? ""}
            onChange={(e) =>
              onChange({ priceMax: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
          />
        </div>
      </div>

      {/* MG strength */}
      {mgOptions.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">MG strength</p>
          <div className="flex flex-col gap-1.5">
            {mgOptions.map((mg) => (
              <label
                key={mg}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={state.mgs.includes(mg)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...state.mgs, mg]
                      : state.mgs.filter((m) => m !== mg);
                    onChange({ mgs: next });
                  }}
                />
                {mg}mg
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Popular / New arrivals */}
      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={state.popularOnly}
            onChange={(e) => onChange({ popularOnly: e.target.checked })}
          />
          Popular
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={state.newOnly}
            onChange={(e) => onChange({ newOnly: e.target.checked })}
          />
          New arrivals
        </label>
      </div>

      {/* Clear all */}
      <button
        type="button"
        onClick={onClear}
        className="self-start text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}

export function Storefront({
  items,
  categories,
}: {
  items: StorefrontItem[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const purposeSlug = searchParams.get("purpose");

  const [state, setState] = useState<FilterState>(() => {
    if (purposeSlug) {
      return { ...EMPTY_FILTER, categories: [purposeSlug] };
    }
    return { ...EMPTY_FILTER };
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const mgOptions = [...new Set(items.flatMap((i) => i.mgs))].sort((a, b) => a - b);

  const onChange = (partial: Partial<FilterState>) =>
    setState((s) => ({ ...s, ...partial }));

  const onClear = () => setState({ ...EMPTY_FILTER });

  const results = filterAndSort(items, state);

  return (
    <div className="flex min-h-0 gap-8">
      {/* Left sidebar — desktop only */}
      <aside className="hidden lg:block w-56 shrink-0">
        <FilterPanel
          state={state}
          categories={categories}
          mgOptions={mgOptions}
          onChange={onChange}
          onClear={onClear}
        />
      </aside>

      {/* Main column */}
      <div className="min-w-0 flex-1">
        {/* Toolbar: mobile filter button + search + sort */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            Filters
          </button>

          <input
            type="search"
            placeholder="Search products…"
            value={state.query}
            onChange={(e) => onChange({ query: e.target.value })}
            className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
          />

          <select
            value={state.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortKey })}
            className="rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
          >
            <option value="price-asc">Price low→high</option>
            <option value="price-desc">Price high→low</option>
            <option value="popularity">Popularity</option>
            <option value="newest">Newest</option>
            <option value="best-selling">Best selling</option>
          </select>
        </div>

        {/* Result count */}
        <p className="mb-3 text-sm text-muted-foreground">
          {results.length} product{results.length !== 1 ? "s" : ""}
        </p>

        {/* Product grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((it) => (
              <ProductCard key={it.card.slug} product={it.card} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            No products match your filters.
          </p>
        )}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-foreground">Filters</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            <FilterPanel
              state={state}
              categories={categories}
              mgOptions={mgOptions}
              onChange={onChange}
              onClear={onClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}
