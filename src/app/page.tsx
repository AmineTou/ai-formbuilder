import Link from "next/link";
import { APP } from "@/lib/app";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{APP.name}</h1>
      <p className="text-muted-foreground">{APP.description}</p>
      <div className="flex gap-3">
        <Link href="/forms" className="px-4 py-2 rounded bg-black text-white">Voir mes formulaires</Link>
        <Link href="/new" className="px-4 py-2 rounded border">Nouveau formulaire</Link>
      </div>
    </main>
  );
}