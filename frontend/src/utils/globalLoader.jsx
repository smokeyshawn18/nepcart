import { useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
});

export function GlobalLoadingBar() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  useEffect(() => {
    if (fetching > 0 || mutating > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [fetching, mutating]);

  return null;
}
