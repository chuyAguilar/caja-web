"use client";

// Formulario unico (sin anidar) para recolectar la caja, con confirmacion.
export default function RecolectarForm({
  action,
  total,
  disabled,
}: {
  action: (formData: FormData) => void;
  total: string;
  disabled?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Marcar como recolectado ${total}? Esto cierra el corte y reinicia el contador.`
          )
        )
          e.preventDefault();
      }}
      className="mt-4 flex flex-wrap items-end gap-2"
    >
      <input
        name="notas"
        placeholder="Nota (opcional): p. ej. recolectado por transferencia"
        className="min-w-[220px] flex-1 rounded border border-white/40 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-50"
      >
        Marcar como recolectado
      </button>
    </form>
  );
}
