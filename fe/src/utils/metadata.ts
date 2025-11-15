import { Metadata } from "next";

const siteName = "Kangdy PetShop";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kangdy.vn";
const description = "Kangdy PetShop - Cửa hàng thú cưng uy tín, đa dạng sản phẩm cho chó mèo";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: ["thú cưng", "chó", "mèo", "petshop", "đồ chơi thú cưng", "thức ăn thú cưng"],
  authors: [{ name: "Kangdy PetShop" }],
  creator: "Kangdy PetShop",
  publisher: "Kangdy PetShop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName,
    title: siteName,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function createMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    ...defaultMetadata,
    ...overrides,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...overrides.twitter,
    },
  };
}

