import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export function useFeaturedProducts(page = 1, limit = 4) {
  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["featured-products", page, limit],
    queryFn: () =>
      apiFetch(`/api/products/featured?page=${page}&limit=${limit}`),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    page: data?.page ?? page,
    limit,
    isLoading,
    isPlaceholderData,
    error,
  };
}
