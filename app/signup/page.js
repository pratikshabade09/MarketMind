"use client";
import { useRouter } from "next/navigation";
import AuthCard from "..api/components/AuthCard";

export default function Signup() {
  const router = useRouter();

  const handleSignup = () => {
    localStorage.setItem("user", "loggedIn");
    router.push("/");
  };

  return (
    <AuthCard title="Create your account ✨">
      <input className="auth-input" placeholder="Full Name" />
      <input className="auth-input" placeholder="Email" />
      <input className="auth-input" type="password" placeholder="Password" />

      <button className="auth-btn" onClick={handleSignup}>
        Sign Up
      </button>

      <div className="auth-link">
        Already have an account? <a href="/login">Login</a>
      </div>
    </AuthCard>
  );
}