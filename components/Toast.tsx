"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Aviso temporal: aparece, se auto-oculta y limpia el query de la URL.
export default function Toast({ ok, error }: { ok?: string; error?: string }) {
  const router = useRouter();
  const msg = error || ok || "";
  const isError = !!error;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!msg) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      router.replace("/caja"); // quita ?ok= / ?error= para que no reaparezca
    }, 4000);
    return () => clearTimeout(t);
  }, [msg, router]);

  if (!msg || !visible) return null;

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm shadow-lg ${
        isError
          ? "border border-red-300 bg-red-50 text-red-700"
          : "border border-emerald-300 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? "⚠️ " : "✓ "}
      {msg}
    </div>
  );
}
