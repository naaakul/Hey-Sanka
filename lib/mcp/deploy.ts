// deploy.ts
import { Vercel } from "@vercel/sdk";


type DeployOpts = {
  repoFullName: string;      // "owner/repo" (e.g. "nakul/my-app")
  VERCEL_TOKEN: string;       // Vercel Personal Access Token (bearer)
//   projectName?: string;      // optional Vercel project name (defaults to repo name)
//   teamId?: string;           // optional team id if you deploy under a team
  branch?: string;           // branch to deploy (default: "main")
  waitTimeoutMs?: number;    // how long to wait for READY (default: 2min)
  pollIntervalMs?: number;   // polling interval (default: 3000ms)
};

export default async (opts: DeployOpts) => {
  const {
    repoFullName,
    VERCEL_TOKEN,
    // projectName,
    // teamId,
    branch = "main",
    waitTimeoutMs = 120_000,
    pollIntervalMs = 3_000,
  } = opts;

  if (!repoFullName || !VERCEL_TOKEN) {
    throw new Error("repoFullName and VERCEL_TOKEN are required.");
  }

  // split owner/repo
  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) throw new Error("repoFullName must be 'owner/repo'.");

  const client = new Vercel({ bearerToken: VERCEL_TOKEN });

  // 1) Create (or attempt to create) the Vercel project linking to the GitHub repo
  let projectIdOrName = repo;
  try {
    // If repo is already connected to your Vercel account, this will succeed; otherwise it may throw.
    const createProjectResp = await client.projects.createProject({
      requestBody: {
        name: projectIdOrName,
        framework: "nextjs", // optional - helps Vercel detect build settings for first deploy
        gitRepository: {
          repo: repoFullName, // "owner/repo"
          type: "github",
        },
      },
      // include team if provided
      ...({}),
    });

    // If created, use the returned id
    projectIdOrName = createProjectResp.id ?? projectIdOrName;
  } catch (err: any) {
    // If project already exists or Git connection prevents creation, swallow and continue.
    // Typical response: 409 or permission errors. We'll try to proceed to create a deployment anyway.
    // Log helpful error for debugging.
    if (err && err.message) {
      console.warn("createProject warning:", err.message);
    } else {
      console.warn("createProject unknown warning:", String(err));
    }
  }

  // 2) Trigger a git-based deployment
  // We provide gitSource and gitMetadata so Vercel knows where to pull from.
  let deployment;
  try {
    const createDeploymentResp = await client.deployments.createDeployment({
      // top-level team/slug if needed
      ...({}),
      requestBody: {
        name: projectIdOrName,   // used to build the default vercel.app hostname
        target: "production",
        gitSource: {
          type: "github",
          repo: repo,     // repo name only
          org: owner,     // owner/org
          ref: branch,    // branch name
        },
        // give some git metadata (optional but nice for logs)
        gitMetadata: {
          remoteUrl: `https://github.com/${repoFullName}`,
          commitRef: branch,
        },
      },
    });

    deployment = createDeploymentResp;
  } catch (err: any) {
    // bubble up a helpful error
    const msg = err?.message ?? String(err);
    throw new Error(`Failed to create Vercel deployment: ${msg}`);
  }

  // sanity check
  if (!deployment || !deployment.id) {
    throw new Error("Vercel SDK returned an unexpected deployment response.");
  }

  const deploymentId = deployment.id;

  // 3) Poll until deployment status is READY (or ERROR/timeout)
  const start = Date.now();
  async function fetchDeployment() {
    return await client.deployments.getDeployment({
      idOrUrl: deploymentId,
      ...({}),
    });
  }

  let finalDeployment: any = deployment;
  while (true) {
    // stop if timeout
    if (Date.now() - start > waitTimeoutMs) {
      throw new Error(
        `Timed out waiting for deployment to be READY (waited ${Math.round(
          waitTimeoutMs / 1000
        )}s). Current status: ${finalDeployment.status ?? "unknown"}`
      );
    }

    // fetch latest
    try {
      finalDeployment = await fetchDeployment();
    } catch (err: any) {
      // transient network error? retry
      console.warn("fetchDeployment error:", err?.message ?? String(err));
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      continue;
    }

    const status = (finalDeployment.status ?? "").toUpperCase();

    if (status === "READY") {
      // Found final ready deployment
      const url = finalDeployment.url ?? finalDeployment.aliasFinal ?? (finalDeployment.alias && finalDeployment.alias[0]);
      return {
        success: true,
        url,
        deployment: finalDeployment,
      };
    }

    if (status === "ERROR" || status === "CANCELED") {
      throw new Error(
        `Deployment failed with status=${status}. Reason: ${finalDeployment.errorMessage ?? "unknown"}`
      );
    }

    // else still building — wait and poll again
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
}
