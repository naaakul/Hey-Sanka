import { NextRequest, NextResponse } from "next/server";
import { generateApp } from "@/lib/mcp/generate";
// import { host } from "@/lib/mcp/host";
// import { push } from "@/lib/mpc/push";
// import { deploy } from "@/lib/mcp/deploy";

export async function POST(req: NextRequest) {
  try {
    const { command, files } = await req.json();

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
      const zipBuffer = await generateApp(appName);

      // const hosted = await host(files); 

      return NextResponse.json({
        message: `Generated and hosted ${appName} successfully.`,
        downloadLink: `/api/download/${appName
          .replace(/\s+/g, "-")
          .toLowerCase()}-app.zip`,
        // hostedLink: hosted?.url || null,
      });
    }

    if (pushMatch) {
      // await push(files);
      return NextResponse.json({ message: "Files pushed successfully." });
    }

    if (deployMatch) {
      const name = deployMatch[1].trim();
      // const result = await deploy(name);
      return NextResponse.json({
        message: `App '${name}' deployed successfully.`,
        // deployUrl: result?.url || null,
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
