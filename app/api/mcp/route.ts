import { NextRequest, NextResponse } from "next/server";
import { generateApp } from "@/lib/mcp/generate";
import makeZip from "@/lib/makeZip";
import { host } from "@/lib/mcp/host";
import push from "@/lib/mcp/push";
import deploy from "@/lib/mcp/deploy";
// interface File {
//   path: string;
//   content: string;
// }

// interface pushProp {
//   name: string;
//   files: File[];
//   GIT_PAT: string;
// }

export async function POST(req: NextRequest) {
  try {
    const { command } = await req.json();


    if (!command || typeof command !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid command" },
        { status: 400 }
      );
    }

    const lower = command.toLowerCase();

    const genMatch = lower.match(
      /(?:create|generate|build)\s+(?:me\s+an?\s+)?([\w\s-]+)\s+app/
    );

    const pushMatch = lower.match(/\bpush\b/);

    const deployMatch = lower.match(/\bdeploy\s+([\w-]+)/);

    if (genMatch) {
      const appName = genMatch[1].trim();
      const files = await generateApp(appName);
      const hostLink = await host(files);
      const zipBuffer = await makeZip(files);

      return NextResponse.json(
        {
          zip: Array.from(new Uint8Array(zipBuffer)),
          hostLink: hostLink || null,
        },
        {
          headers: {
            "Content-Type": "link/zip",
            "Content-Disposition": `attachment; filename="${appName}.zip"`,
          },
        }
      );
    }

    if (pushMatch) {
      const { GIT_PAT, files, name } = await req.json();
      const gitLink = await push({ name, files, GIT_PAT });
      return NextResponse.json({
        message: "Files pushed successfully.",
        gitLink: gitLink,
      });
    }

    if (deployMatch) {
      const { repoFullName, VERCEL_TOKEN } = await req.json();
      const result = await deploy({ repoFullName, VERCEL_TOKEN });
      return NextResponse.json({
        message: `App '${name}' deployed successfully.`,
        deployUrl: result?.url || null,
      });
    }

    return NextResponse.json({
      message: "No valid command found.",
    });
  } catch (err: any) {
    console.error("Error in /api/ncp:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
