// lib/push.ts

import { Octokit } from "@octokit/rest";

interface File {
  path: string;
  content: string;
}

export default async ({
  name,
  files,
  GIT_PAT,
}: {
  name: string;
  files: File[];
  GIT_PAT: string;
}): Promise<string> => {
  const octokit = new Octokit({ auth: GIT_PAT });

  // Get the authenticated user
  const { data: user } = await octokit.rest.users.getAuthenticated();
  const username = user.login;

  // 1. Create a new repo
  const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
    name,
    private: false,
    auto_init: false,
  });

  const repoFullName = repo.full_name;

  // 2. Get the default branch (main)
  const defaultBranch = "master";

  // 3. Create a new commit tree
  const { data: baseCommit } = await octokit.rest.git.getRef({
    owner: username,
    repo: name,
    ref: `heads/${defaultBranch}`,
  }).catch(async () => {
    // if no branch, create an empty one
    const { data: emptyCommit } = await octokit.rest.git.createCommit({
      owner: username,
      repo: name,
      message: "Initial commit",
      tree: "",
      parents: [],
    });
    await octokit.rest.git.createRef({
      owner: username,
      repo: name,
      ref: `refs/heads/${defaultBranch}`,
      sha: emptyCommit.sha,
    });
    return { data: { object: { sha: emptyCommit.sha } } };
  });

  // 4. Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await octokit.rest.git.createBlob({
        owner: username,
        repo: name,
        content: file.content,
        encoding: "utf-8",
      });
      return { path: file.path, sha: blob.data.sha };
    })
  );

  // 5. Create a new tree
  const { data: tree } = await octokit.rest.git.createTree({
    owner: username,
    repo: name,
    base_tree: baseCommit.object.sha,
    tree: blobs.map((b) => ({
      path: b.path,
      mode: "100644",
      type: "blob",
      sha: b.sha,
    })),
  });

  // 6. Create a commit
  const { data: commit } = await octokit.rest.git.createCommit({
    owner: username,
    repo: name,
    message: "Initial project push",
    tree: tree.sha,
    parents: [baseCommit.object.sha],
  });

  // 7. Update the ref to point to new commit
  await octokit.rest.git.updateRef({
    owner: username,
    repo: name,
    ref: `heads/${defaultBranch}`,
    sha: commit.sha,
    force: true,
  });

  // 8. Return repo link
  return `https://github.com/${repoFullName}`;
}
