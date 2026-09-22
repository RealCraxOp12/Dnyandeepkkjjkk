'use server';

import { destroyParentSession as destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function destroyParentSession() {
  await destroySession();
  redirect("/portal");
}
