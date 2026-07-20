/**
 * PocketBase JS Hook for Automatic Deployment Trigger
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 *
 * Whenever a record in `RuhaniCreationsBySumati_Girl_Child` is created, updated, or deleted,
 * PocketBase will automatically send a trigger request to Cloudflare Deploy Hook.
 */

// Replace this URL with your Cloudflare Pages Deploy Hook URL
const DEPLOY_HOOK_URL = process.env.DEPLOY_HOOK_URL || "YOUR_CLOUDFLARE_DEPLOY_HOOK_URL_HERE";

function notifyDeploy(e) {
  try {
    console.log("[PocketBase Hook] Product collection modified! Triggering deploy...");
    if (!DEPLOY_HOOK_URL || DEPLOY_HOOK_URL.includes("YOUR_CLOUDFLARE")) {
      console.log("[PocketBase Hook] DEPLOY_HOOK_URL not configured yet.");
      return;
    }
    const res = $http.send({
      url: DEPLOY_HOOK_URL,
      method: "POST",
      timeout: 10,
    });
    console.log("[PocketBase Hook] Deploy trigger response status:", res.statusCode);
  } catch (err) {
    console.log("[PocketBase Hook] Error triggering deploy:", err);
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
