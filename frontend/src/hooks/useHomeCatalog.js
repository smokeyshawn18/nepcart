import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api.js";

export function useHomeCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFilter = searchParams.get("category")?.trim() ?? "";
  const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
  const limit = 6;

  const setCategory = (category) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", "1");
        if (!category) next.delete("category");
        else next.set("category", category);
        return next;
      },
      { replace: true },
    );
  };

  const setPage = (nextPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(nextPage));
        return next;
      },
      { replace: true },
    );
  };

  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => apiFetch("/api/products/categories"),
  });

  const {
    data: productsData,
    isLoading: loadingList,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["products", { category: categoryFilter, page, limit }],
    queryFn: () =>
      apiFetch(
        `/api/products?page=${page}&limit=${limit}${
          categoryFilter
            ? `&category=${encodeURIComponent(categoryFilter)}`
            : ""
        }`,
      ),
    placeholderData: (previousData) => previousData,
  });

  return {
    categoryFilter,
    setCategory,
    page,
    setPage,
    limit,
    categories: categoriesData?.categories ?? [],
    products: productsData?.products ?? [],
    total: productsData?.total ?? 0,
    hasMore: productsData?.hasMore ?? false,
    loadingCategories,
    loadingList,
    isPlaceholderData,
    error,
    categoryChipsLoading: loadingCategories,
  };
}
