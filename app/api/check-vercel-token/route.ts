import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { valid: false, missingScopes: ["No token provided"] },
      { status: 400 }
    );
  }

  const userRes = await fetch("https://api.vercel.com/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (userRes.status !== 200) {
    return NextResponse.json(
      { valid: false, missingScopes: ["Invalid token"] },
      { status: 401 }
    );
  }

  const missingScopes: string[] = [];

  const projectRes = await fetch("https://api.vercel.com/v9/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "sanka-token-test", framework: "nextjs" }),
  });

  if (projectRes.status === 403 || projectRes.status === 401) {
    missingScopes.push("projects:write");
  }

  const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "sanka-token-test-deploy", files: [] }),
  });

  if (deployRes.status === 403 || deployRes.status === 401) {
    missingScopes.push("deployments:write");
  }

  return NextResponse.json({
    valid: missingScopes.length === 0,
    missingScopes,
  });
}
