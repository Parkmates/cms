// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

export default withPWA({
  dest: "public",
  disable: !isProd,
});
