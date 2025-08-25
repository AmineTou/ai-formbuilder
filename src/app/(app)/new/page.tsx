"use client";

import { useState } from "react";
import GeneratedForm from "@/components/GeneratedForm";
import { saveForm } from "./save-action";

type Option = { label: string; value: string };
type Field = {
  name: string; label: string;
  type: "text" | "email" | "password" | "textarea" | "select" | "checkbox";
  required?: boolean; minLength?: number; maxLength?: number; options?: Option[];
};
type FormSpec = { title: string; fields: Field[]; successMessage?: string };

export default function NewFormPage() {
  const [prompt, setPrompt] = useState("");
  const [spec, setSpec] = useState<FormSpec | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true); setErr(null);
    try {
      const res = await fetch("/api/forms/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Generation failed");
      setSpec(data.spec);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">AI Form Builder — New</h1>

      <div className="space-y-2">
        <label className="text-sm">Describe your form</label>
        <textarea
          className="w-full border rounded p-2 min-h-28"
          placeholder='Example: "Signup form with first name, email, password, accept terms"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={onGenerate}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </div>

      {spec && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          {/* Rendered preview — submissions here are just to test the form */}
          <GeneratedForm spec={spec} action={async () => { /* no-op in preview */ }} />

          {/* Persist the spec as a form the user owns */}
          <form action={async () => { await saveForm(spec!, prompt); }}>
            <button className="px-4 py-2 rounded bg-emerald-600 text-white">Save form</button>
          </form>
        </section>
      )}
    </main>
  );
}
