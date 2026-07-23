import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export function useHomeCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => apiFetch("/api/products/categories"),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  return {
    categories: data?.categories ?? [],
    loadingCategories: isLoading,
    error,
  };
}
