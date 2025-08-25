"use client";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type FormField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
};

export default function GeneratedForm({ spec, action }: { spec: { title: string; fields: FormField[]; successMessage?: string; }; action: (data: unknown)=>Promise<void>; }) { 
  const [pending, setPending] = useState(false);
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  for (const f of spec.fields) {
    let zf = f.type === "checkbox" ? z.boolean() : z.string();
    if (f.required) zf = zf.refine(v => (f.type==="checkbox" ? v===true : typeof v === 'string' && v.length>0), { message: "Required" });
    if (f.minLength) zf = (zf as z.ZodString).min(f.minLength);
    if (f.maxLength) zf = (zf as z.ZodString).max(f.maxLength);
    if (f.type === "email") zf = (zf as z.ZodString).email();
    schemaShape[f.name] = zf;
  }
  const schema = z.object(schemaShape);

  async function onSubmit(formData: FormData) {
    const raw: Record<string, unknown> = {};
    for (const f of spec.fields) {
      raw[f.name] = f.type === "checkbox" ? (formData.get(f.name) ? true : false) : (formData.get(f.name) ?? "");
    }
    const parsed = schema.safeParse(raw);
    if (!parsed.success) { alert(parsed.error.issues[0]?.message ?? "Invalid"); return; }
    setPending(true);
    await action(parsed.data);
    setPending(false);
    alert(spec.successMessage ?? "Saved!");
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">{spec.title}</h2>
      {spec.fields.map((f: FormField) => (
        <div key={f.name} className="space-y-1">
          <label className="text-sm">{f.label}</label>
          {f.type === "textarea" ? (
            <Textarea name={f.name} />
          ) : f.type === "checkbox" ? (
            <div className="flex items-center gap-2"><Checkbox name={f.name} /></div>
          ) : (
            <Input name={f.name} type={f.type==="password"?"password": f.type==="email"?"email":"text"} />
          )}
        </div>
      ))}
      <Button disabled={pending}>{pending ? "Saving..." : "Submit"}</Button>
    </form>
  );
}
