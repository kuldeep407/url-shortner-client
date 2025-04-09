import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="pt-24 px-4 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
