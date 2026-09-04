import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "NM Group of Industries and Research Foundation — a globally recognised research ecosystem empowering the next generation of scientists through research services, publication support, PhD assistance, and global conferences.";

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
  }, [title, description]);
}