import type { ProductCardData } from "@/components/commerce/product-card";

export type StorefrontItem = {
  card: ProductCardData;
  categorySlug: string;
  categoryName: string;
  mgs: number[];
  minPriceCents: number;
  haystack: string; // lowercased name+subtitle+overview+benefits+category, for search
  isPopular: boolean;
  isNew: boolean;
  popularityRank: number;
};

export type SortKey = "price-asc" | "price-desc" | "popularity" | "newest" | "best-selling";

export type FilterState = {
  categories: string[];
  priceMin: number | null;
  priceMax: number | null;
  mgs: number[];
  popularOnly: boolean;
  newOnly: boolean;
  query: string;
  sort: SortKey;
};

export const EMPTY_FILTER: FilterState = {
  categories: [], priceMin: null, priceMax: null, mgs: [],
  popularOnly: false, newOnly: false, query: "", sort: "popularity",
};

export function applyFilters(items: StorefrontItem[], s: FilterState): StorefrontItem[] {
  const q = s.query.trim().toLowerCase();
  return items.filter((it) => {
    if (s.categories.length && !s.categories.includes(it.categorySlug)) return false;
    if (s.priceMin != null && it.minPriceCents < s.priceMin) return false;
    if (s.priceMax != null && it.minPriceCents > s.priceMax) return false;
    if (s.mgs.length && !it.mgs.some((m) => s.mgs.includes(m))) return false;
    if (s.popularOnly && !it.isPopular) return false;
    if (s.newOnly && !it.isNew) return false;
    if (q && !it.haystack.includes(q)) return false;
    return true;
  });
}

export function applySort(items: StorefrontItem[], sort: SortKey): StorefrontItem[] {
  const a = [...items];
  switch (sort) {
    case "price-asc": a.sort((x, y) => x.minPriceCents - y.minPriceCents); break;
    case "price-desc": a.sort((x, y) => y.minPriceCents - x.minPriceCents); break;
    case "newest": a.sort((x, y) => Number(y.isNew) - Number(x.isNew) || x.popularityRank - y.popularityRank); break;
    case "popularity":
    case "best-selling": a.sort((x, y) => x.popularityRank - y.popularityRank); break;
  }
  return a;
}

export function filterAndSort(items: StorefrontItem[], s: FilterState): StorefrontItem[] {
  return applySort(applyFilters(items, s), s.sort);
}
