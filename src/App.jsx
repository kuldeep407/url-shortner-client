import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/features/auth/Login";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import ShortUrl from "./components/pages/ShortUrlForm";
import Layout from "./components/common/Layout";
import BasicTable from "./components/pages/Table";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/short-url" element={<ShortUrl />} />
            <Route path="/table" element={<BasicTable />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
