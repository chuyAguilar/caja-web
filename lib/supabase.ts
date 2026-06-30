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

// Horarios del club (valor 24h -> etiqueta amigable)
export const HORAS: { value: string; label: string }[] = [
  { value: "06:00", label: "6:00 am" },
  { value: "07:00", label: "7:00 am" },
  { value: "08:00", label: "8:00 am" },
  { value: "09:00", label: "9:00 am" },
  { value: "10:00", label: "10:00 am" },
  { value: "11:00", label: "11:00 am" },
  { value: "12:00", label: "12:00 pm" },
  { value: "13:00", label: "1:00 pm" },
  { value: "13:30", label: "1:30 pm" },
  { value: "15:00", label: "3:00 pm" },
  { value: "16:00", label: "4:00 pm" },
  { value: "17:00", label: "5:00 pm" },
  { value: "18:00", label: "6:00 pm" },
  { value: "19:00", label: "7:00 pm" },
  { value: "20:00", label: "8:00 pm" },
];

export const CARRILES = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B"];

export const PRECIOS: { value: number; label: string }[] = [
  { value: 700, label: "$700 (mes completo)" },
  { value: 525, label: "$525 (3/4 de mes)" },
  { value: 350, label: "$350 (medio mes)" },
  { value: 175, label: "$175 (1/4 de mes)" },
];

// Normaliza un telefono mexicano: agrega lada 52 y valida 10 digitos.
export function normalizarTelefono(raw: string): { telefono: string | null; error?: string } {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return { telefono: null }; // opcional
  let local = d;
  if (local.startsWith("52")) local = local.slice(2);
  if (local.length === 11 && local.startsWith("1")) local = local.slice(1); // formato 521...
  if (local.length !== 10)
    return { telefono: null, error: "El telefono debe tener 10 digitos (la lada '52' se agrega sola)." };
  return { telefono: "52" + local };
}

export const fmtMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);
