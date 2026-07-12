import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a friendly fallback if API key is not configured yet
      return NextResponse.json({
        content: "NVIDIA/Gemini API Key is not configured on your server yet. Please add `GEMINI_API_KEY` to your environment variables to enable real AI responses.",
        citations: [
          {
            kind: "policy",
            title: "AI Configuration Guide",
            snippet: "Set GEMINI_API_KEY in your environment variables to activate the compliance copilot."
          }
        ]
      });
    }

    // Retrieve database records to use as grounding context
    const [policies, audits, issues] = await Promise.all([
      prisma.policy.findMany({ take: 10 }),
      prisma.audit.findMany({ take: 10 }),
      prisma.complianceIssue.findMany({ take: 10 }),
    ]);

    const contextStr = [
      ...policies.map((p) => `[Kind: Policy, Title: ${p.title}]\nBody: ${p.body}`),
      ...audits.map((a) => `[Kind: Audit, Title: ${a.title}]\nFindings: ${a.findings}`),
      ...issues.map((i) => `[Kind: Compliance, Title: ${i.title}]\nDescription: ${i.description}`),
    ].join("\n\n");

    const prompt = `You are the ESG Compliance Copilot for EcoSphere. 
Answer the user's question accurately using ONLY the grounding context provided below.

Grounding Context:
${contextStr}

User Question: ${question}

Instructions:
- Formulate a clear, direct, and professional answer.
- Cite the sources you used in the "citations" array. Each citation must match a real source from the context, including the kind ("policy", "audit", or "compliance"), the exact title, and a brief snippet.
- Return the response in the specified JSON format.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                content: { type: "STRING" },
                citations: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      kind: { type: "STRING" },
                      title: { type: "STRING" },
                      snippet: { type: "STRING" }
                    },
                    required: ["kind", "title", "snippet"]
                  }
                }
              },
              required: ["content", "citations"]
            }
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      return NextResponse.json({ error: "Failed to parse model output" }, { status: 500 });
    }

    const parsedResult = JSON.parse(resultText);
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("Copilot API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
