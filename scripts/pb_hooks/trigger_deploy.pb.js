/**
 * PocketBase v0.38+ Bulletproof Safe JS Hook
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 */

const DEPLOY_HOOK_URL = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/549255f6-5025-4cb8-9f34-3bf565b32d59";

function notifyDeploy() {
  try {
    $http.send({
      url: DEPLOY_HOOK_URL,
      method: "POST",
      timeout: 5
    });
  } catch (err) {
    // Swallow any error to ensure UI never blocks
  }
}

onRecordAfterCreateSuccess((e) => {
  notifyDeploy();
  return e.next ? e.next() : undefined;
});

onRecordAfterUpdateSuccess((e) => {
  notifyDeploy();
  return e.next ? e.next() : undefined;
});

onRecordAfterDeleteSuccess((e) => {
  notifyDeploy();
  return e.next ? e.next() : undefined;
});
