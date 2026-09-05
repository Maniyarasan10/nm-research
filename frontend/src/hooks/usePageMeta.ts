import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "NM Group of Industries and Research Foundation — a globally recognised research ecosystem empowering the next generation of scientists through research services, publication support, PhD assistance, and global conferences.";

const SITE_URL = "https://nmresearch.co.in/nm-research";

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);

    const canonicalUrl = `${SITE_URL}/${window.location.hash || "#/"}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", canonicalUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
  }, [title, description]);
}