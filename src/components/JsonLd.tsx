import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import { TOOLS } from "@/lib/tools";

const baseUrl = SITE_URL;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${baseUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: SITE_NAME,
      url: baseUrl,
      logo: `${baseUrl}/assets/icon.png`,
    },
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      name: SITE_NAME,
      url: baseUrl,
      description: SITE_DESCRIPTION,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Runs in the browser.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        ...TOOLS.slice(0, 10).map((tool) => tool.title),
        "Free PDF Invoice Generator",
        "Free Online Signature Generator",
      ],
      isAccessibleForFree: true,
      publisher: { "@id": `${baseUrl}/#organization` },
      isPartOf: { "@id": `${baseUrl}/#website` },
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
