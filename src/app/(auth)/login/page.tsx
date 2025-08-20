'use client';

import { useState } from "react";
import { useLogin } from "@/features/auth/api/use-login-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("Admin123456");
  const { mutate, isPending, error, data } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-2 py-1"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Ingresando..." : "Login"}
      </button>

      {error && <p className="text-red-500">{error.message}</p>}
      {data && <p className="text-green-500">¡Login exitoso!</p>}
    </form>
  );
}
