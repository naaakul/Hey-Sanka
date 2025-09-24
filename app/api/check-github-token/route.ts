import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { valid: false, missingScopes: ["No token provided"] },
      { status: 400 }
    );
  }

  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "hey-sanka",
    },
  });

  if (res.status !== 200) {
    return NextResponse.json(
      { valid: false, missingScopes: ["Invalid token"] },
      { status: 401 }
    );
  }

  const scopeHeader = res.headers.get("x-oauth-scopes") || "";
  const scopes = scopeHeader
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const required = ["repo"];
  const missingScopes: string[] = [];

  required.forEach((scope) => {
    if (!scopes.includes(scope)) {
      missingScopes.push(scope);
    }
  });

  return NextResponse.json({
    valid: missingScopes.length === 0,
    missingScopes,
    scopes,
  });
}
