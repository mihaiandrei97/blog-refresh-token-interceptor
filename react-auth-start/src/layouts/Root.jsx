import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";

export function Root() {
  return (
    <div className="wrapper">
      <NavBar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
