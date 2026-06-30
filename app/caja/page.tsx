import { supabase, mesActual, fmtMXN, DIAS, CATEGORIAS, METODOS, HORAS, CARRILES, PRECIOS } from "@/lib/supabase";
import ConfirmButton from "@/components/ConfirmButton";
import {
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  crearInscripcion,
  eliminarInscripcion,
  registrarPago,
  eliminarPago,
} from "./actions";

export const dynamic = "force-dynamic";

const input = "w-full rounded border border-slate-300 px-2 py-1 text-sm";
const btn = "rounded bg-sky-600 px-3 py-1 text-sm font-medium text-white hover:bg-sky-700";
const btnGhost = "rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50";

type CajaProps = { searchParams: { error?: string; ok?: string } };

export default async function CajaPage({ searchParams }: CajaProps) {
  const mes = mesActual();

  const { data: clientes } = await supabase
    .from("clientes")
    .select(
      "id,nombre,telefono,edad,curp,fotos_entregadas,certificado_medico,inscripciones(id,dia,hora,carril,categoria,precio,estatus,pagos(id,mes,monto,metodo,estatus,fecha_pago))"
    )
    .order("nombre");

  const { data: caja } = await supabase.from("v_caja_actual").select("*").maybeSingle();

  const lista: any[] = clientes || [];

  return (
    <div className="space-y-6">
      {searchParams?.error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
          ⚠️ {searchParams.error}
        </div>
      )}
      {searchParams?.ok && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          ✓ {searchParams.ok}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Caja</h1>
        <div className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
          <span className="text-xs opacity-80">En caja (corte actual)</span>
          <div className="text-lg font-bold">
            {fmtMXN(Number(caja?.total || 0))}{" "}
            <span className="text-xs font-normal opacity-80">· {caja?.num_pagos || 0} pagos</span>
          </div>
        </div>
      </div>

      {/* Nuevo cliente */}
      <details className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-semibold">➕ Nuevo cliente</summary>
        <form action={crearCliente} className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-sm">Nombre*
            <input name="nombre" required className={input} />
          </label>
          <label className="text-sm">Teléfono (10 dígitos)
            <input name="telefono" placeholder="7712345678" className={input} />
          </label>
          <label className="text-sm">Edad
            <input name="edad" type="number" min="1" className={input} />
          </label>
          <div className="sm:col-span-3 mt-1 text-xs font-semibold text-slate-500">Primera inscripción (opcional)</div>
          <label className="text-sm">Día
            <select name="dia" className={input}>
              <option value="">—</option>
              {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label className="text-sm">Hora
            <select name="hora" className={input}>
              <option value="">—</option>
              {HORAS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </label>
          <label className="text-sm">Categoría
            <select name="categoria" className={input}>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm">Carril
            <select name="carril" className={input}>
              <option value="">(sin carril)</option>
              {CARRILES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm">Precio
            <select name="precio" className={input}>
              {PRECIOS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </label>
          <div className="sm:col-span-3 flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="fotos_entregadas" /> Fotos entregadas
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="certificado_medico" /> Certificado médico
            </label>
            <button className={btn}>Guardar cliente</button>
          </div>
        </form>
      </details>

      {/* Lista de clientes */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500">{lista.length} clientes</h2>
        {lista.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Datos del cliente (editable) */}
            <div className="flex flex-wrap items-end gap-2">
              <form action={actualizarCliente} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={c.id} />
                <label className="text-xs">Nombre
                  <input name="nombre" defaultValue={c.nombre} className={input} />
                </label>
                <label className="text-xs">Teléfono
                  <input name="telefono" defaultValue={c.telefono || ""} className={input} />
                </label>
                <label className="text-xs">Edad
                  <input name="edad" type="number" defaultValue={c.edad ?? ""} className={`${input} w-20`} />
                </label>
                <label className="flex items-center gap-1 text-xs" title="Entregó 2 fotos tamaño infantil">
                  <input type="checkbox" name="fotos_entregadas" defaultChecked={!!c.fotos_entregadas} /> Fotos
                </label>
                <label className="flex items-center gap-1 text-xs" title="Entregó certificado médico de natación">
                  <input type="checkbox" name="certificado_medico" defaultChecked={!!c.certificado_medico} /> Cert. médico
                </label>
                <button className={btnGhost}>Guardar</button>
              </form>
              <ConfirmButton
                action={eliminarCliente}
                message={`¿Eliminar a ${c.nombre} y todas sus inscripciones?`}
                hidden={[{ name: "id", value: c.id }]}
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Eliminar
              </ConfirmButton>
            </div>

            {/* Inscripciones */}
            <div className="mt-3 space-y-2">
              {(c.inscripciones || []).map((i: any) => {
                const pago = (i.pagos || []).find((p: any) => p.mes === mes);
                const pagado = pago?.estatus === "pagado";
                return (
                  <div key={i.id} className="rounded-lg bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium capitalize">{i.dia} {String(i.hora).slice(0, 5)}</span>
                      <span className="text-slate-500">· {i.categoria}{i.carril ? ` · carril ${i.carril}` : ""} · {fmtMXN(Number(i.precio))}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          pagado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {mes}: {pagado ? "pagado" : "pendiente"}
                      </span>
                      <ConfirmButton
                        action={eliminarInscripcion}
                        message="¿Eliminar esta inscripción?"
                        hidden={[{ name: "id", value: i.id }]}
                        className="ml-auto text-xs text-red-500 hover:underline"
                      >
                        quitar
                      </ConfirmButton>
                    </div>
                    {!pagado && (
                      <form action={registrarPago} className="mt-2 flex flex-wrap items-end gap-2">
                        <input type="hidden" name="inscripcion_id" value={i.id} />
                        <input type="hidden" name="mes" value={mes} />
                        <label className="text-xs">Monto
                          <input name="monto" type="number" step="0.01" defaultValue={Number(i.precio)} className={`${input} w-24`} />
                        </label>
                        <label className="text-xs">Método
                          <select name="metodo" className={input}>
                            {METODOS.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </label>
                        <button className={btn}>Registrar pago</button>
                      </form>
                    )}
                  </div>
                );
              })}

              {/* Agregar inscripción */}
              <details className="text-xs">
                <summary className="cursor-pointer text-sky-600">+ agregar inscripción</summary>
                <form action={crearInscripcion} className="mt-2 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="cliente_id" value={c.id} />
                  <select name="dia" required className={input}>
                    <option value="">Día</option>
                    {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select name="hora" required className={input}>
                    <option value="">Hora</option>
                    {HORAS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
                  </select>
                  <select name="categoria" className={input}>
                    {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select name="carril" className={input}>
                    <option value="">(sin carril)</option>
                    {CARRILES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select name="precio" className={input}>
                    {PRECIOS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <button className={btnGhost}>Agregar</button>
                </form>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
