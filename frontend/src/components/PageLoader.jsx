import { LoaderIcon } from "lucide-react";

const PageLoader = ({ brandName = "Loading" }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Content container */}
      <div className="flex flex-col items-center gap-6">
        {/* Logo wrapper with subtle animation */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 animate-pulse rounded-full bg-blue-100"
            style={{ opacity: 0.3 }}
          ></div>
          <img
            src="/large.png"
            alt="Logo"
            className="relative z-10 h-20 w-20 object-contain"
          />
        </div>

        {/* Spinner */}
        <div className="relative">
          <LoaderIcon
            className="h-8 w-8 animate-spin text-blue-600"
            strokeWidth={1.5}
          />
        </div>

        {/* Brand text */}
        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">{brandName}</p>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while we set things up
          </p>
        </div>

        {/* Decorative progress indicator */}
        <div className="mt-4 flex gap-2">
          <div className="h-1 w-12 animate-pulse rounded-full bg-blue-400"></div>
          <div
            className="h-1 w-12 animate-pulse rounded-full bg-blue-300"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="h-1 w-12 animate-pulse rounded-full bg-blue-200"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Optional background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default PageLoader;
