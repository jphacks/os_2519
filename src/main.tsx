import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./app/login/LoginPage";
import SettingsPage from "./app/settings/page";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/category/:id/LoginPage" element={<LoginPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      {/* 必要に応じて他のルートを追加 */}
    </Routes>
  </BrowserRouter>
);
