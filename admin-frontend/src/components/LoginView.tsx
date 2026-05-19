import { LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";

import { login, setToken } from "../api/client";

type LoginViewProps = {
  onLogin: () => void;
};

export function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(username, password);
      setToken(response.token);
      onLogin();
    } catch {
      setError("Неверный логин или пароль.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <LockKeyhole size={26} />
        </div>
        <h1>MTEX Admin</h1>
        <p>Вход для сотрудников мебельного магазина.</p>
        <label>
          Логин
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>
        <label>
          Пароль
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Входим" : "Войти"}
        </button>
        {error && <span className="error-text">{error}</span>}
      </form>
    </main>
  );
}
