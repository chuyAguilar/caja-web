import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel 468Club</h1>
        <p className="text-slate-600">Elige una vista.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/caja"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="text-3xl">💳</div>
          <h2 className="mt-2 text-lg font-semibold">Caja</h2>
          <p className="text-sm text-slate-600">
            Ver y administrar clientes, registrar pagos y altas.
          </p>
        </Link>
        <Link
          href="/dueno"
          className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="text-3xl">🧾</div>
          <h2 className="mt-2 text-lg font-semibold">Dueño</h2>
          <p className="text-sm text-slate-600">
            Total de dinero en caja y recolección.
          </p>
        </Link>
      </div>
    </div>
  );
}
