import { useState } from "react";

import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="app-shell">
      <Header search={search} onSearchChange={setSearch} />
      <HomePage search={search} onSearchChange={setSearch} />
      <footer className="site-footer">
        <div>
          <strong>Мебельные технологии</strong>
          <span>Фурнитура, комплектующие и решения для производства мебели</span>
        </div>
        <a href="https://www.instagram.com/mebelnyetekhnologi__furniture/">Instagram</a>
      </footer>
    </div>
  );
}
