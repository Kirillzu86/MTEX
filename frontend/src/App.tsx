import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <HomePage />
      <footer className="site-footer">
        <span>Мебельные технологии</span>
        <a href="https://www.instagram.com/mebelnyetekhnologi__furniture/">Instagram</a>
      </footer>
    </div>
  );
}
