import type { Metadata, Viewport } from "next";
import { Inter, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollTop from "@/components/layout/ScrollTop";
import LenisProvider from "@/components/layout/LenisProvider";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import ChatBot from "@/components/chat/ChatBot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nmresearch.co.in"),
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  title: {
    default: "NM Research | NM Group of Industries and Research Foundation",
    template: "%s | NM Research",
  },
  description:
    "NM Group of Industries and Research Foundation — A globally recognized research ecosystem empowering the next generation of scientists through research services, publication support, PhD assistance, and global conferences.",
  applicationName: "NM Research",
  keywords: [
    "research",
    "publication support",
    "PhD assistance",
    "research consulting",
    "scientific writing",
    "global conferences",
    "NM Group",
  ],
  authors: [{ name: "NM Group of Industries and Research Foundation" }],
  openGraph: {
    title: "NM Research | NM Group of Industries and Research Foundation",
    description:
      "A globally recognized research ecosystem empowering the next generation of scientists.",
    url: "https://nmresearch.co.in",
    siteName: "NM Research",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.webp",
        width: 240,
        height: 240,
        alt: "NM Group of Industries and Research Foundation — logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "NM Research | NM Group of Industries and Research Foundation",
    description:
      "A globally recognized research ecosystem empowering the next generation of scientists.",
    images: ["/images/logo.webp"],
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NM Group of Industries and Research Foundation",
  alternateName: "NM Research",
  url: "https://nmresearch.co.in",
  email: "hello.nmassociation@gmail.com",
  telephone: "+91 8667334697",
  sameAs: ["https://www.linkedin.com", "https://twitter.com"],
  foundingDate: "2026",
  slogan: "Innovate. Research. Publish. Impact.",
};

const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NM Research",
  url: "https://nmresearch.co.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nmresearch.co.in/research?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services does NM Research provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NM Group of Industries and Research Foundation provides research paper writing, publication support for SCI, Scopus and Web of Science journals, PhD assistance, research consulting, analytical services, and global conferences.",
      },
    },
    {
      "@type": "Question",
      name: "How many research domains and subjects does NM Research cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NM Research covers 11 research domains spanning hundreds of subjects — from chemistry and materials, biomedical and life sciences, and engineering, to management, social sciences and publication support.",
      },
    },
    {
      "@type": "Question",
      name: "What are the NM Research membership plans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NM Research offers three membership plans: Community, Platinum (most popular), and Prime — each with increasing publication support, conference participation, mentorship and guidance benefits.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries does NM Research operate in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NM Research operates across India, the USA, the UK, Canada, Malaysia, Saudi Arabia, Singapore, Japan and the UAE, working with more than 150 academic and industry partners.",
      },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ebGaramond.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
          <LenisProvider>
            <div aria-hidden="true" className="film-grain" />
            <ScrollProgressBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ScrollTop />
            <ChatBot />
          </LenisProvider>
      </body>
    </html>
  );
}
