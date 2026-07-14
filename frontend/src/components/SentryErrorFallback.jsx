import { Link } from "react-router";

export function SentryErrorFallback() {
  return (
    <div className="mx-auto max-w-md rounded-box border border-base-300 bg-base-100 p-8 text-center">
      <p className="text-base-content/80">Something went wrong. The error was reported.</p>

      <Link to="/" className="btn btn-primary btn-sm mt-6">
        Back to shop
      </Link>
    </div>
  );
}
