// @ts-ignore
import { env } from 'cloudflare:workers';

export async function GET() {
  try {
    return new Response(
      JSON.stringify({
        success: true,
        envType: typeof env,
        envKeys: Object.keys(env || {}),
        PUBLIC_POCKETBASE_URL: env?.PUBLIC_POCKETBASE_URL ?? 'UNDEFINED',
        POCKETBASE_COLLECTION: env?.POCKETBASE_COLLECTION ?? 'UNDEFINED',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message ?? String(err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
