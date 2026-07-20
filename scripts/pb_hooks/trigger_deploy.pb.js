/**
 * PocketBase v0.20+ / v0.38+ JS Hook for Automatic Deployment Trigger
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 */

const DEPLOY_HOOK_URL = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/549255f6-5025-4cb8-9f34-3bf565b32d59";

function notifyDeploy(e) {
  try {
    console.log("[PocketBase Hook] Record created/updated/deleted! Triggering Cloudflare Deploy Hook...");
    const res = $http.send({
      url: DEPLOY_HOOK_URL,
      method: "POST",
      timeout: 10
    });
    console.log("[PocketBase Hook] Cloudflare deploy trigger status:", res.statusCode);
  } catch (err) {
    console.log("[PocketBase Hook] Error triggering Cloudflare deploy hook:", err);
  }
}

// PocketBase v0.20+ / v0.38+ event syntax
onRecordCreate((e) => { notifyDeploy(e); });
onRecordUpdate((e) => { notifyDeploy(e); });
onRecordDelete((e) => { notifyDeploy(e); });
