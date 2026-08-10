import { Link, useLocation } from "react-router";
import { PackageIcon, ClipboardListIcon } from "lucide-react";

const AdminNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-base-300 bg-base-100">
      <div className="flex h-16 items-center px-6">
        <Link to="/admin" className="text-xl font-bold">
          Admin Panel
        </Link>

        <nav className="ml-8 flex items-center gap-2">
          <Link
            to="/admin"
            className={`btn btn-ghost gap-2 ${
              isActive("/admin") ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <PackageIcon className="size-5" />
            Products
          </Link>

          <Link
            to="/admin/orders"
            className={`btn btn-ghost gap-2 ${
              isActive("/admin/orders") ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <ClipboardListIcon className="size-5" />
            Orders
          </Link>
        </nav>

        <Link to="/catalog" className="btn btn-outline btn-sm ml-auto">
          Back to Shop
        </Link>
      </div>
    </header>
  );
};

export default AdminNav;
