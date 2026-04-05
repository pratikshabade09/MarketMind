"use client";
import { useRouter } from "next/navigation";
import AuthCard from "..api/components/AuthCard";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // dummy login (no backend needed)
    localStorage.setItem("user", "loggedIn");
    router.push("/");
  };

  return (
    <AuthCard title="Login to MarketMind 🚀">
      <input className="auth-input" placeholder="Email" />
      <input className="auth-input" type="password" placeholder="Password" />

      <button className="auth-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="auth-link">
        Don’t have an account? <a href="/signup">Sign Up</a>
      </div>
    </AuthCard>
  );
}