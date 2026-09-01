import { test, expect } from "@playwright/test";

test("navbar navigates to each section route", async ({ page }) => {
  await page.goto("/");

  const links = [
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Research", path: "/research" },
    { label: "Membership", path: "/membership" },
    { label: "Contact", path: "/contact" },
  ];

  for (const link of links) {
    await page.getByRole("navigation").getByText(link.label, { exact: true }).first().click();
    await page.waitForURL(`**${link.path}`);
    await expect(page).toHaveURL(new RegExp(`${link.path}$`));
    await page.goto("/");
  }
});

test("mobile menu toggle exposes navigation links", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/");

  await page.getByRole("button", { name: /toggle menu/i }).click();
  await expect(page.getByRole("button", { name: /toggle menu/i })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
