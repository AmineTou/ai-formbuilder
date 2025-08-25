"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { forms } from "@/db/schema";

export async function saveForm(spec: unknown, prompt: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { id } = (await db
    .insert(forms)
    .values({
      userId: session.user.email ?? "anon",
      title: (spec as { title?: string })?.title ?? "Untitled Form",
      prompt,
      spec,
      isPublic: true,
    })
    .returning({ id: forms.id }))[0];

  redirect(`/forms/${id}`); // go to render page after saving
}
