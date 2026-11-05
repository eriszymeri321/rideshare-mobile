"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { caktoRolin, ndryshoOren } from "@/lib/lejet";

export async function ruajOren(formData: FormData) {
  let mesazh: string;
  try {
    mesazh = await ndryshoOren(String(formData.get("id") ?? ""), String(formData.get("ora") ?? ""));
  } catch {
    mesazh = "databaza";
  }
  if (mesazh === "ruajtur") {
    revalidatePath("/");
    revalidatePath("/udhetimi/2");
  }
  redirect("/panel?m=" + mesazh);
}

export async function ruajRolin(formData: FormData) {
  let mesazh: string;
  try {
    mesazh = await caktoRolin(String(formData.get("roli") ?? ""));
  } catch {
    mesazh = "databaza";
  }
  redirect("/panel?m=" + mesazh);
}
