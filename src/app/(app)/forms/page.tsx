import Link from "next/link";

export default async function FormsPage() {
  const rows = [
    { id: "demo-1", title: "Inscription", isPublic: false, createdAt: new Date().toISOString() },
  ];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Forms</h1>
        <Link href="/new" className="px-3 py-2 rounded bg-black text-white">Nouveau</Link>
      </div>

      <div className="space-y-2">
        {rows.map((f) => (
          <div key={f.id} className="flex items-center justify-between border rounded p-3">
            <div>
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(f.createdAt).toLocaleString()} • {f.isPublic ? "Public" : "Privé"}
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
    </main>
  );
}
