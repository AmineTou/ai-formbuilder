import Link from "next/link";
import { getForms } from "./get-forms-action";

interface Form {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  spec: {
    fields: Array<{
      name: string;
      label: string;
      type: string;
      required?: boolean;
      [key: string]: unknown;
    }>;
    successMessage?: string;
  };
  createdAt: string;
  isPublic: boolean;
}

export default async function FormsPage() {
  let forms: Form[] = [];
  let error: string | null = null;

  try {
    forms = await getForms();
  } catch(err) {
    error = err instanceof Error ? err.message : "Failed to load forms";
    console.error("Error loading forms:", err);
  }
  
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Forms</h1>
        <Link href="/new" className="px-3 py-2 rounded bg-black text-white">Nouveau</Link>
      </div>

      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      {forms.length === 0 && !error ? (
        <div className="p-4 border rounded text-center">
          <p className="text-muted-foreground">You don't have any forms yet.</p>
          <Link href="/new" className="text-sm underline mt-2 inline-block">
            Create your first form
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {forms.map((f) => (
            <div key={f.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{f.title}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(f.createdAt).toLocaleString()} • {f.isPublic ? "Public" : "Private"}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/forms/${f.id}`} className="px-3 py-2 border rounded">Preview</Link>
                <Link href={`/share/${f.id}`} className="px-3 py-2 border rounded">Share</Link>
                <Link href={`/forms/${f.id}/render`} className="px-3 py-2 border rounded text-red-600">Render (unsafe)</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
