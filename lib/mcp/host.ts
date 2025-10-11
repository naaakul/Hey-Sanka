import { Sandbox } from "e2b";

export async function host(
  files: { path: string; content: string }[]
): Promise<string> {
  if (!files || !Array.isArray(files)) {
    throw new Error("Missing or invalid 'files' array");
  }

  const sandbox = await Sandbox.create("mk6klmser1ctnxf0d9ed", {
    apiKey: process.env.E2B_API_KEY!,
    timeoutMs: 5 * 60 * 1000,
  });

  // Write all files into /home/user/box
  await Promise.all(
    files.map((file) =>
      sandbox.files.write(`/home/user/box/${file.path}`, file.content)
    )
  );

  // Install dependencies
  const installResult = await sandbox.commands.run("npm install", {
    cwd: "/home/user/box",
  });

  if (installResult.exitCode !== 0) {
    console.error("npm install failed:", installResult.stderr);
    throw new Error("npm install failed inside sandbox");
  }

  // Start dev server in background
  await sandbox.commands.run("npm run dev", {
    cwd: "/home/user/box",
    background: true,
  });

  // Get host for port 3000
  const host = sandbox.getHost(3000);
  const previewUrl = `https://${host}`;

  return previewUrl;
}
