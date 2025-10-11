import Groq from "groq-sdk";
import { SCAFFOLD_SYSTEM_PROMPT } from "@/lib/prompts/scaffold-prompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generateApp(appName: string) {
  const prompt = `Generate a fully working Next.js 14 app with Tailwind CSS named "${appName}".
It should include at least:
- app/page.tsx with basic UI related to ${appName}
- components/ directory for modular UI
- utils/ directory if needed
Return a JSON with "files": [{ "path": "file path", "content": "file content" }]`;

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SCAFFOLD_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  });

  // console.log("chat completion ", chatCompletion)

  let text = chatCompletion.choices[0]?.message?.content || "";

  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No valid JSON object found in response");
  const config = JSON.parse(match[0]);

  if (!Array.isArray(config.files)) {
    throw new Error("Invalid response: files is not an array");
  }

  // const zip = new JSZip();
  // for (const file of config.files) {
  //   zip.file(file.path, file.content);
  // }
  // console.log("file - ", file)
  // console.log("zip - ", zip)

  // const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  // console.log("zip - ", zipBuffer)
  return config.files;
}
