/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// Remote image hosts (comma-separated hostnames) from IMAGE_REMOTE_HOSTS, see .env.example
const imageHosts = (process.env.IMAGE_REMOTE_HOSTS || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

// Next.js injects inline scripts for hydration and framer-motion uses inline
// styles, so 'unsafe-inline' is needed until a nonce-based CSP is added.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${imageHosts.map((h) => ` https://${h}`).join("")}`,
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https", hostname })),
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};

module.exports = nextConfig;
