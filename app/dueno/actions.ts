"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function recolectarCaja(formData: FormData) {
  const notas = String(formData.get("notas") || "").trim() || null;
  const { error } = await supabase.rpc("recolectar_caja", { p_notas: notas });
  if (error) throw new Error(error.message);
  revalidatePath("/dueno");
  revalidatePath("/caja");
}
