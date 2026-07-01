import { supabase, fmtMXN } from "@/lib/supabase";
import RecolectarForm from "@/components/RecolectarForm";
import { recolectarCaja } from "./actions";

export const dynamic = "force-dynamic";

function fecha(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

export default async function DuenoPage() {
  const { data: caja } = await supabase.from("v_caja_actual").select("*").maybeSingle();
  const { data: historial } = await supabase
    .from("cortes_caja")
    .select("*")
    .eq("recolectado", true)
    .order("recolectado_en", { ascending: false })
    .limit(50);

  const total = Number(caja?.total || 0);
  const cortes: any[] = historial || [];
  const totalHistorico = cortes.reduce((a, c) => a + Number(c.monto_total || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dueño · Caja</h1>

      {/* Total en caja */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-700 to-sky-500 p-6 text-white shadow">
        <div className="text-sm opacity-80">Dinero en caja por recolectar</div>
        <div className="mt-1 text-4xl font-extrabold">{fmtMXN(total)}</div>
        <div className="mt-1 text-sm opacity-80">
          {caja?.num_pagos || 0} pagos · corte abierto desde {fecha(caja?.abierto_en)}
        </div>

        <RecolectarForm action={recolectarCaja} total={fmtMXN(total)} disabled={total <= 0} />
        <p className="mt-2 text-xs opacity-70">
          La nota se aplica al confirmar con el botón. Al recolectar, el monto queda en el historial y la caja vuelve a $0.
        </p>
      </div>

      {/* Historial */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Historial de recolecciones</h2>
          <span className="text-sm text-slate-500">Total histórico: {fmtMXN(totalHistorico)}</span>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-1">Recolectado</th>
              <th className="py-1">Monto</th>
              <th className="py-1">Abierto desde</th>
              <th className="py-1">Nota</th>
            </tr>
          </thead>
          <tbody>
            {cortes.length === 0 && (
              <tr><td colSpan={4} className="py-3 text-slate-400">Aún no hay recolecciones.</td></tr>
            )}
            {cortes.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="py-2">{fecha(c.recolectado_en)}</td>
                <td className="py-2 font-medium">{fmtMXN(Number(c.monto_total || 0))}</td>
                <td className="py-2 text-slate-500">{fecha(c.abierto_en)}</td>
                <td className="py-2 text-slate-500">{c.notas || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
