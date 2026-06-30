"use server";

import { revalidatePath } from "next/cache";
import { supabase, hoyISO } from "@/lib/supabase";

function refresh() {
  revalidatePath("/caja");
  revalidatePath("/dueno");
}

// Crear cliente + su primera inscripcion
export async function crearCliente(formData: FormData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim() || null;
  const edadRaw = String(formData.get("edad") || "").trim();
  const edad = edadRaw ? Number(edadRaw) : null;
  if (!nombre) return;

  const { data: cli, error } = await supabase
    .from("clientes")
    .insert({ nombre, telefono, edad })
    .select("id")
    .single();
  if (error || !cli) throw new Error(error?.message || "No se pudo crear el cliente");

  const dia = String(formData.get("dia") || "");
  const hora = String(formData.get("hora") || "");
  if (dia && hora) {
    await supabase.from("inscripciones").insert({
      cliente_id: cli.id,
      dia,
      hora,
      carril: String(formData.get("carril") || "").trim() || null,
      categoria: String(formData.get("categoria") || "14+"),
      precio: Number(formData.get("precio") || 700),
      estatus: "activa",
    });
  }
  refresh();
}

export async function actualizarCliente(formData: FormData) {
  const id = Number(formData.get("id"));
  const edadRaw = String(formData.get("edad") || "").trim();
  await supabase
    .from("clientes")
    .update({
      nombre: String(formData.get("nombre") || "").trim(),
      telefono: String(formData.get("telefono") || "").trim() || null,
      edad: edadRaw ? Number(edadRaw) : null,
    })
    .eq("id", id);
  refresh();
}

export async function eliminarCliente(formData: FormData) {
  await supabase.from("clientes").delete().eq("id", Number(formData.get("id")));
  refresh();
}

export async function crearInscripcion(formData: FormData) {
  await supabase.from("inscripciones").insert({
    cliente_id: Number(formData.get("cliente_id")),
    dia: String(formData.get("dia") || ""),
    hora: String(formData.get("hora") || ""),
    carril: String(formData.get("carril") || "").trim() || null,
    categoria: String(formData.get("categoria") || "14+"),
    precio: Number(formData.get("precio") || 700),
    estatus: "activa",
  });
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

  await supabase.from("pagos").upsert(
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
  refresh();
}

export async function eliminarPago(formData: FormData) {
  await supabase.from("pagos").delete().eq("id", Number(formData.get("id")));
  refresh();
}
