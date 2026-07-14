import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api.js";

export function useProductPage() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => apiFetch(`/api/products/${slug}`),
    enabled: Boolean(slug),
  });

  return {
    slug,
    product: data?.product ?? null,
    isLoading,
    error,
  };
}
