"use client";

import { ReactNode } from "react";

// Boton de submit dentro de un <form action={...}> con confirmacion.
export default function ConfirmButton({
  action,
  message,
  hidden,
  children,
  className,
}: {
  action: (formData: FormData) => void;
  message: string;
  hidden?: { name: string; value: string | number }[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {hidden?.map((h) => (
        <input key={h.name} type="hidden" name={h.name} value={String(h.value)} />
      ))}
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
