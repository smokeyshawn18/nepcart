import { Link, useSearchParams } from "react-router";
import { useCart } from "../store/cart";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2Icon, PackageIcon, XCircleIcon } from "lucide-react";
import { apiFetch } from "../lib/api";

function EsewaReturnPage() {
  const clearCart = useCart((s) => s.clear);
  const [params] = useSearchParams();
  const data = params.get("data");
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  // Prevents a duplicate verify call under React StrictMode, which
  // deliberately double-invokes effects in dev. Without this guard, the
  // first call succeeds (creates the order, consumes the checkout
  // session) and the second call fails with "session not found" - a
  // false-negative error, not a real problem.
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!data) {
      setStatus("error");
      setErrorMessage("Missing payment confirmation data.");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    let cancelled = false;

    apiFetch(`/api/checkout/esewa/verify?data=${encodeURIComponent(data)}`)
      .then(() => {
        if (cancelled) return;
        clearCart();
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err?.message ?? "Payment verification failed.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (status === "verifying") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <span
          className="loading loading-spinner loading-lg text-primary"
          aria-hidden
        />
        <p className="mt-4 text-base-content/70">Confirming your payment…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="avatar placeholder mx-auto mb-4">
          <div className="w-16 rounded-full bg-error/20 text-error flex items-center justify-center">
            <XCircleIcon className="size-10" aria-hidden />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-base-content">
          We couldn&apos;t confirm your payment
        </h1>
        <p className="mt-4 text-base-content/70">{errorMessage}</p>
        <Link to="/cart" className="btn btn-primary mt-8">
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="avatar placeholder mx-auto mb-4">
        <div className="w-16 rounded-full bg-success/20 text-success flex items-center justify-center">
          <CheckCircle2Icon className="size-10" aria-hidden />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-base-content">
        Thanks for your order
      </h1>

      <p className="mt-4 text-base-content/70">
        Your payment was confirmed. Open your order for{" "}
        <strong className="text-base-content">support chat</strong>. We&apos;ll
        send video invites in that thread when needed.
      </p>

      <Link to="/orders" className="btn btn-primary mt-8 gap-2">
        <PackageIcon className="size-4" aria-hidden />
        View orders
      </Link>
    </div>
  );
}

export default EsewaReturnPage;
