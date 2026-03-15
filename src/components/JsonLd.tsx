const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlinedevtools-three.vercel.app";

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Online Dev Tools",
  description:
    "Free online developer tools: JSON formatter, JWT decoder, Base64 encoder, Unix timestamp converter, regex tester, and more. No installation required.",
  url: baseUrl,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
    />
  );
}
