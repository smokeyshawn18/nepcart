import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import PageLoader from "../components/PageLoader";

export function GlobalLoader() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  const loading = fetching > 0 || mutating > 0;

  if (!loading) return null;

  return <PageLoader />;
}
