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
      { source: "/fake-user-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/test-user-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/test-data-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/fake-user-data-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/test-user-data-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/random-user-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/fake-address-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/test-address-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/fake-name-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/test-name-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/dummy-user-data", destination: "/mock-profile-generator", permanent: true },
      { source: "/json-test-data-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/fake-customer-data-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/test-customer-data-generator", destination: "/mock-profile-generator", permanent: true },
      { source: "/generate-test-users", destination: "/mock-profile-generator", permanent: true },
      { source: "/bulk-test-data-generator", destination: "/mock-profile-generator", permanent: true },
    ];
  },
};

module.exports = nextConfig;
