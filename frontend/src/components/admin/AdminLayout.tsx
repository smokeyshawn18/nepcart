import { Outlet } from "react-router";
import AdminNav from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminNav />

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
