"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function NewFormPage() {
  const [prompt, setPrompt] = useState("");
  const [jsonSpec, setJsonSpec] = useState<string>("");
  const [codeZod, setCodeZod] = useState<string>("");
  const [codeTsx, setCodeTsx] = useState<string>("");
  const [codeAction, setCodeAction] = useState<string>("");

  async function onGenerate() {
    // STEP 4 : API IA. Ici, on met un exemple pour tester l’UI.
    setJsonSpec(JSON.stringify({
      title: "Inscription",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true, min: 8 },
      ],
      layout: { columns: 1, submitLabel: "Créer mon compte" }
    }, null, 2));
    setCodeZod(`z.object({ email: z.string().email(), password: z.string().min(8) })`);
    setCodeTsx(`export function GeneratedForm(){ return <div>Form TSX ici</div>; }`);
    setCodeAction(`export async function submit(formData: FormData){ /* ... */ }`);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Nouveau formulaire</h1>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Décris ton formulaire (champs, validations, labels...)"
        className="min-h-[120px]"
      />
      <Button onClick={onGenerate}>Générer</Button>
      <Separator />
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">Spec JSON</TabsTrigger>
          <TabsTrigger value="zod">Zod</TabsTrigger>
          <TabsTrigger value="tsx">TSX</TabsTrigger>
          <TabsTrigger value="action">Action</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="border rounded p-4 text-sm text-muted-foreground">
            (Preview depuis JSON — STEP 3 : renderer)
          </div>
        </TabsContent>
        <TabsContent value="json">
          <pre className="border rounded p-4 overflow-auto text-sm">{jsonSpec}</pre>
        </TabsContent>
        <TabsContent value="zod">
          <pre className="border rounded p-4 overflow-auto text-sm">{codeZod}</pre>
        </TabsContent>
        <TabsContent value="tsx">
          <pre className="border rounded p-4 overflow-auto text-sm">{codeTsx}</pre>
        </TabsContent>
        <TabsContent value="action">
          <pre className="border rounded p-4 overflow-auto text-sm">{codeAction}</pre>
        </TabsContent>
      </Tabs>
    </main>
  );
}
