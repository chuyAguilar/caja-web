import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para uso EXCLUSIVO en servidor (service_role).
// Nunca importar esto desde un componente "use client".
export const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } }
);

export const mesActual = () => new Date().toISOString().slice(0, 7); // 'YYYY-MM'
export const hoyISO = () => new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

export const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
export const CATEGORIAS = ["4-6", "7-13", "14+"];
export const METODOS = ["efectivo", "debito", "credito", "transferencia"];

export const fmtMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);
