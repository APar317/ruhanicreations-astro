// @ts-check
import 'dotenv/config';
import { defineConfig } from 'astro/config';
// https://astro.build/config
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: http://127.0.0.1:8090 http://localhost:8090 https:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' http://127.0.0.1:8090 http://localhost:8090; manifest-src 'self'; frame-src 'none'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), payment=(), fullscreen=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Access-Control-Allow-Origin': 'https://www.ruhanicreationsbysumati.com'
};

export default defineConfig({
  output: 'static',
  vite: {
    server: {
      headers: securityHeaders
    },
    preview: {
      headers: securityHeaders
    }
  }
});
