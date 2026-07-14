import { useSearchParams } from "react-router";
import { apiFetch } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";

export function useHomeCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category")?.trim() ?? "";

  const setCategory = (category) => {
    const next = new URLSearchParams(searchParams);

    if (!category) next.delete("category");
    else next.set("category", category);

    setSearchParams(next, { replace: true });
  };

  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => apiFetch("/api/products/categories"),
  });

  const {
    data: productsData,
    isLoading: loadingList,
    error,
  } = useQuery({
    queryKey: ["products", categoryFilter],
    queryFn: () =>
      apiFetch(
        categoryFilter
          ? `/api/products?category=${encodeURIComponent(categoryFilter)}`
          : "/api/products",
      ),
  });

  const categories = categoriesData?.categories ?? [];
  const products = productsData?.products ?? [];
  const categoryChipsLoading = loadingCategories && categories.length === 0;

  return {
    categoryFilter,
    setCategory,
    categories,
    products,
    categoryChipsLoading,
    loadingCategories,
    loadingList,
    error,
  };
}
