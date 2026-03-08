/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/base64-decode", destination: "/base64-encoder", permanent: true },
      { source: "/timestamp-converter", destination: "/unix-timestamp", permanent: true },
    ];
  },
};

module.exports = nextConfig;
