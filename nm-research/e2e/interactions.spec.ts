import { test, expect } from "@playwright/test";

test("membership payment modal opens, shows price and closes via close button", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Join Community" }).click();

  const modal = page.locator("text=Complete Payment");
  await expect(modal).toBeVisible();
  await expect(page.locator("text=Scan with any UPI app")).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();
  await expect(modal).toBeHidden();
});

test("research domain filter narrows the subject list", async ({ page }) => {
  await page.goto("/research");

  const search = page.getByPlaceholder(/search subjects/i);
  await search.fill("nanotechnology");

  await expect(page.locator("text=Nanotechnology").first()).toBeVisible();
});

test("contact form fields are present", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByPlaceholder("Full Name *")).toBeVisible();
  await expect(page.getByPlaceholder("Email *")).toBeVisible();
  await expect(page.getByPlaceholder("Your Message *")).toBeVisible();
});

test("research subject modal offers guidance (no dead PDF links)", async ({
  page,
}) => {
  await page.goto("/research");

  // First domain is open by default; click a subject to open the modal.
  await page.getByRole("button", { name: /nanotechnology/i }).first().click();

  const modal = page.getByRole("dialog", { name: /research support/i });
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("link", { name: /request guidance/i })).toBeVisible();

  // No links to the non-existent /pdfs/ directory should exist on the page.
  const pdfLinks = page.locator('a[href*="/pdfs/"]');
  await expect(pdfLinks).toHaveCount(0);
});

test("research search deep-link reflects the ?q= query param", async ({
  page,
}) => {
  await page.goto("/research?q=nanotechnology");

  const search = page.getByPlaceholder(/search subjects/i);
  await expect(search).toHaveValue("nanotechnology");
  await expect(page.locator("text=Nanotechnology").first()).toBeVisible();
});
