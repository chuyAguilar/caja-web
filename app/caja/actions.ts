"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase, hoyISO, normalizarTelefono } from "@/lib/supabase";

function refresh() {
  revalidatePath("/caja");
  revalidatePath("/dueno");
}

// Traduce errores comunes de Postgres a mensajes claros
function traducirError(msg: string): string {
  if (/duplicate key|unique/i.test(msg) && /telefono/i.test(msg))
    return "Ya existe un cliente con ese teléfono. Usa otro número o déjalo vacío.";
  if (/duplicate key|unique/i.test(msg))
    return "Ese registro ya existe (dato duplicado).";
  return msg;
}

function fallar(msg: string): never {
  redirect("/caja?error=" + encodeURIComponent(traducirError(msg)));
}

// Crear cliente + su primera inscripcion
export async function crearCliente(formData: FormData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const { telefono, error: telErr } = normalizarTelefono(String(formData.get("telefono") || ""));
  const edadRaw = String(formData.get("edad") || "").trim();
  const edad = edadRaw ? Number(edadRaw) : null;
  if (!nombre) fallar("El nombre es obligatorio.");
  if (telErr) fallar(telErr);

  const { data: cli, error } = await supabase
    .from("clientes")
    .insert({
      nombre,
      telefono,
      edad,
      fotos_entregadas: formData.get("fotos_entregadas") === "on",
      certificado_medico: formData.get("certificado_medico") === "on",
    })
    .select("id")
    .single();
  if (error || !cli) fallar(error?.message || "No se pudo crear el cliente.");

  const dia = String(formData.get("dia") || "");
  const hora = String(formData.get("hora") || "");
  if (dia && hora) {
    const { error: e2 } = await supabase.from("inscripciones").insert({
      cliente_id: cli!.id,
      dia,
      hora,
      carril: String(formData.get("carril") || "").trim() || null,
      categoria: String(formData.get("categoria") || "14+"),
      precio: Number(formData.get("precio") || 700),
      estatus: "activa",
    });
    if (e2) fallar("Cliente creado, pero la inscripción falló: " + e2.message);
  }
  refresh();
  redirect("/caja?ok=Cliente+creado");
}

export async function actualizarCliente(formData: FormData) {
  const id = Number(formData.get("id"));
  const edadRaw = String(formData.get("edad") || "").trim();
  const { telefono, error: telErr } = normalizarTelefono(String(formData.get("telefono") || ""));
  if (telErr) fallar(telErr);
  const { error } = await supabase
    .from("clientes")
    .update({
      nombre: String(formData.get("nombre") || "").trim(),
      telefono,
      edad: edadRaw ? Number(edadRaw) : null,
      fotos_entregadas: formData.get("fotos_entregadas") === "on",
      certificado_medico: formData.get("certificado_medico") === "on",
    })
    .eq("id", id);
  if (error) fallar(error.message);
  refresh();
  redirect("/caja?ok=Cliente+actualizado");
}

export async function eliminarCliente(formData: FormData) {
  await supabase.from("clientes").delete().eq("id", Number(formData.get("id")));
  refresh();
}

export async function crearInscripcion(formData: FormData) {
  const { error } = await supabase.from("inscripciones").insert({
    cliente_id: Number(formData.get("cliente_id")),
    dia: String(formData.get("dia") || ""),
    hora: String(formData.get("hora") || ""),
    carril: String(formData.get("carril") || "").trim() || null,
    categoria: String(formData.get("categoria") || "14+"),
    precio: Number(formData.get("precio") || 700),
    estatus: "activa",
  });
  if (error) fallar(error.message);
  refresh();
}

export async function eliminarInscripcion(formData: FormData) {
  await supabase.from("inscripciones").delete().eq("id", Number(formData.get("id")));
  refresh();
}

// Registrar / marcar un pago como pagado (suma a la caja via trigger)
export async function registrarPago(formData: FormData) {
  const inscripcion_id = Number(formData.get("inscripcion_id"));
  const mes = String(formData.get("mes") || "");
  const monto = Number(formData.get("monto") || 0);
  const metodo = String(formData.get("metodo") || "efectivo");
  if (!inscripcion_id || !mes) return;

  const { error } = await supabase.from("pagos").upsert(
    {
      inscripcion_id,
      mes,
      monto,
      metodo,
      estatus: "pagado",
      fecha_pago: hoyISO(),
      facturado: false,
    },
    { onConflict: "inscripcion_id,mes" }
  );
  if (error) fallar(error.message);
  refresh();
}

export async function eliminarPago(formData: FormData) {
  await supabase.from("pagos").delete().eq("id", Number(formData.get("id")));
  refresh();
}
