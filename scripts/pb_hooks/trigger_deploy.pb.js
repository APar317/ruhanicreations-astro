/**
 * PocketBase v0.38+ OS Exec JS Hook for Instant Cloudflare Trigger
 * Place this file inside the `pb_hooks/` directory of your PocketBase installation on the GCP VM.
 */

const DEPLOY_HOOK_URL = "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/549255f6-5025-4cb8-9f34-3bf565b32d59";

function notifyDeploy() {
  try {
    $os.exec("curl", "-s", "-X", "POST", DEPLOY_HOOK_URL);
  } catch (err) {}
}

onRecordAfterCreateSuccess((e) => { notifyDeploy(); });
onRecordAfterUpdateSuccess((e) => { notifyDeploy(); });
onRecordAfterDeleteSuccess((e) => { notifyDeploy(); });
