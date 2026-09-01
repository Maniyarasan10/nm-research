import { test, expect } from "@playwright/test";

const routes: Array<{ path: string; heading: RegExp }> = [
  { path: "/", heading: /institute where research is/i },
  { path: "/about", heading: /Global Research Excellence/i },
  { path: "/services", heading: /Research Services/i },
  { path: "/research", heading: /Research Universe/i },
  { path: "/membership", heading: /Research Journey/i },
  { path: "/contact", heading: /Research Journey/i },
];

for (const route of routes) {
  test(`route ${route.path} responds 200 and renders content`, async ({
    page,
  }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/NM Research/);
    await expect(page.locator("h1").first()).toContainText(route.heading);
  });
}
