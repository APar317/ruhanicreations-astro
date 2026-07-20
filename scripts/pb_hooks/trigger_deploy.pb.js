/**
 * PocketBase JS Hook for Automatic Deployment Trigger via Cloudflare Deploy Hook
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 *
 * Whenever a record in `RuhaniCreationsBySumati_Girl_Child` is created, updated, or deleted,
 * PocketBase will automatically send an HTTP POST to Cloudflare to rebuild and deploy the site.
 */

const DEPLOY_HOOK_URL = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/549255f6-5025-4cb8-9f34-3bf565b32d59";

function notifyDeploy(e) {
  try {
    console.log("[PocketBase Hook] Product modified! Triggering Cloudflare Deploy Hook...");
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

onRecordAfterCreateRequest((e) => { notifyDeploy(e); }, "RuhaniCreationsBySumati_Girl_Child");
onRecordAfterUpdateRequest((e) => { notifyDeploy(e); }, "RuhaniCreationsBySumati_Girl_Child");
onRecordAfterDeleteRequest((e) => { notifyDeploy(e); }, "RuhaniCreationsBySumati_Girl_Child");
