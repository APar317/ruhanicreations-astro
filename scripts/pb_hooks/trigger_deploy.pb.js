/**
 * PocketBase v0.38+ Non-blocking After-Success JS Hook
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 */

const DEPLOY_HOOK_URL = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/549255f6-5025-4cb8-9f34-3bf565b32d59";

function notifyDeploy(e) {
  try {
    console.log("[PocketBase Hook] Record operation succeeded! Triggering Cloudflare Deploy Hook...");
    $http.send({
      url: DEPLOY_HOOK_URL,
      method: "POST",
      timeout: 5
    });
  } catch (err) {
    console.log("[PocketBase Hook] Non-blocking deploy trigger error:", err);
  }
}

// Non-blocking AFTER-success hooks in PocketBase v0.38+
onRecordAfterCreateSuccess((e) => { notifyDeploy(e); });
onRecordAfterUpdateSuccess((e) => { notifyDeploy(e); });
onRecordAfterDeleteSuccess((e) => { notifyDeploy(e); });
