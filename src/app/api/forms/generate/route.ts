import { NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  //const session = await auth();
  //if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const { prompt } = await req.json();

  const sys = `You output ONLY JSON for a form spec compatible with shadcn/ui.
  Keys: title, fields[], successMessage.
  fields[i]: name (camelCase), label, type in [text,email,password,textarea,select,checkbox],
  required (bool), minLength?, maxLength?, pattern?, options? (for select: [{label,value}]).
  No commentary, no markdown.`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: sys,
    prompt: `Describe the form to build:\n${prompt}`,
    temperature: 0.2,
  });

  let spec;
  try { spec = JSON.parse(text); }
  catch { return NextResponse.json({ error: "Model did not return valid JSON" }, { status: 400 }); }

  return NextResponse.json({
    spec,
   // metrics: { tokensIn: usage.promptTokens, tokensOut: usage.completionTokens, latencyMs: responseTime },
  });
}
