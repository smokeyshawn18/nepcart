import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export function useFeaturedProducts(page = 1, limit = 5) {
  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["featured-products", page, limit],
    queryFn: () =>
      apiFetch(`/api/products/featured?page=${page}&limit=${limit}`),
    placeholderData: (prev) => prev,
    staleTime: 30 * 60 * 1000, // 30 minutes (half of backend TTL)
    gcTime: 60 * 60 * 1000, // 1 hour (matches backend Redis TTL)
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    refetchOnMount: false, // Don't refetch if data exists
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: 2,
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
