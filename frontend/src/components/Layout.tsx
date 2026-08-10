import { Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
