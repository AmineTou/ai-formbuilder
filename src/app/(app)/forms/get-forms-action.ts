import { db } from "@/db";
import { auth } from "@/lib/auth";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getForms() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    throw new Error("Unauthorized");
  }

  try {
    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.userId, userEmail))
      .orderBy(forms.createdAt);

    return userForms;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw new Error("Failed to fetch forms");
  }
}
