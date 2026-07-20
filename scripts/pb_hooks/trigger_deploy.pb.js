/**
 * PocketBase JS Hook for Automatic Deployment Trigger via GitHub Repository Dispatch API
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 *
 * Whenever a record in `RuhaniCreationsBySumati_Girl_Child` is created, updated, or deleted,
 * PocketBase will automatically send a trigger request to GitHub Actions to rebuild and deploy the site.
 */

// Replace GITHUB_TOKEN with your GitHub Personal Access Token (classic) with 'repo' scope
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE";
const REPO_OWNER = "APar317";
const REPO_NAME = "ruhanicreations-astro";

function notifyDeploy(e) {
  try {
    console.log("[PocketBase Hook] Product modified! Sending GitHub Dispatch trigger...");
    if (!GITHUB_TOKEN || GITHUB_TOKEN.includes("YOUR_PERSONAL_ACCESS_TOKEN")) {
      console.log("[PocketBase Hook] GITHUB_TOKEN is not configured yet. Skipping trigger.");
      return;
    }
    const res = $http.send({
      url: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "PocketBase-Hook"
      },
      body: JSON.stringify({
        event_type: "pb_product_updated"
      }),
      timeout: 10
    });
    console.log("[PocketBase Hook] GitHub trigger response status:", res.statusCode);
  } catch (err) {
    console.log("[PocketBase Hook] Error triggering GitHub workflow:", err);
  }
}

onRecordAfterCreateRequest((e) => {
  notifyDeploy(e);
}, "RuhaniCreationsBySumati_Girl_Child");

onRecordAfterUpdateRequest((e) => {
  notifyDeploy(e);
}, "RuhaniCreationsBySumati_Girl_Child");

onRecordAfterDeleteRequest((e) => {
  notifyDeploy(e);
}, "RuhaniCreationsBySumati_Girl_Child");
