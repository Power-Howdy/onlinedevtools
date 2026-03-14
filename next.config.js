/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/base64-decode", destination: "/base64-encoder", permanent: true },
      { source: "/timestamp-converter", destination: "/unix-timestamp", permanent: true },
      { source: "/json-to-typescript", destination: "/json-to-code?lang=typescript", permanent: true },
      { source: "/json-to-python", destination: "/json-to-code?lang=python", permanent: true },
      { source: "/json-to-java", destination: "/json-to-code?lang=java", permanent: true },
      { source: "/json-to-go", destination: "/json-to-code?lang=go", permanent: true },
      { source: "/json-to-rust", destination: "/json-to-code?lang=rust", permanent: true },
      { source: "/json-to-csharp", destination: "/json-to-code?lang=csharp", permanent: true },
    ];
  },
};

module.exports = nextConfig;
