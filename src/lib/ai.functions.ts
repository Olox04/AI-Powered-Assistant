import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.5-flash";

const EmailInput = z.object({
  topic: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive", "Professional"]),
  context: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => EmailInput.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are a professional email writer for Skhura's Eatery, a restaurant. Write clear, well-structured emails with a subject line labeled 'Subject:' on the first line, then the body. Do not use markdown headings. Keep it concise.",
      prompt: `Write an email about: ${data.topic}\n\nTone: ${data.tone}\n\nAdditional context: ${data.context || "(none)"}\n\nReturn only the email text.`,
    });
    return { text };
  });

const ResearchInput = z.object({ topic: z.string().min(1) });

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ResearchInput.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are an AI research assistant. Given a topic, produce a concise research brief in this exact markdown structure:\n\n## Summary\n<2-3 sentence overview>\n\n## Key Points\n- point 1\n- point 2\n- point 3\n- point 4\n\n## Insights\n<2-3 insights as paragraphs or bullets>\n\n## Recommendations\n- rec 1\n- rec 2\n- rec 3",
      prompt: `Research topic: ${data.topic}`,
    });
    return { text };
  });
