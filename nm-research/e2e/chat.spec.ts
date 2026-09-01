import { test, expect, type Page } from "@playwright/test";

async function openChat(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat assistant" }).click();
  await expect(page.getByRole("dialog", { name: "NM Research chat assistant" })).toBeVisible();
}

async function ask(page: Page, question: string) {
  await page.getByLabel("Type your message").fill(question);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByLabel("Type your message")).toBeEmpty();
}

test("launcher opens chat and welcomes the user", async ({ page }) => {
  await openChat(page);
  await expect(page.getByText(/Hi! I'm the NM Research assistant/)).toBeVisible();
  await expect(page.getByRole("button", { name: "What services do you offer?" })).toBeVisible();
});

test("answers a factual question with citations and telemetry", async ({ page }) => {
  await openChat(page);
  await ask(page, "how much is platinum membership?");

  const answer = page.locator("div.whitespace-pre-wrap").last();
  await expect(answer).toContainText(/₹|rupees/, { timeout: 10000 });
  await expect(page.getByText("verified").first()).toBeVisible();
  await expect(page.getByText(/\d+ms/).first()).toBeVisible();
});

test("multi-turn: a bare follow-up resolves against the active topic", async ({ page }) => {
  await openChat(page);
  await ask(page, "how much is platinum membership?");

  const first = page.locator("div.whitespace-pre-wrap").last();
  await expect(first).toContainText(/₹|rupees/, { timeout: 10000 });

  await ask(page, "how much is it?");
  const second = page.locator("div.whitespace-pre-wrap").last();
  await expect(second).toContainText(/₹|rupees/, { timeout: 10000 });
});

test("new conversation restarts with a fresh welcome", async ({ page }) => {
  await openChat(page);
  await ask(page, "what services do you offer?");
  await expect(page.locator("div.whitespace-pre-wrap").last()).toContainText("NM Research provides", {
    timeout: 10000,
  });

  await page.getByRole("button", { name: "Start a new conversation" }).click();
  await expect(page.getByText(/Hi! I'm the NM Research assistant/).last()).toBeVisible();
});

test("feedback thumbs are recorded on an answer", async ({ page }) => {
  await openChat(page);
  await ask(page, "what research areas do you cover?");
  await expect(page.getByText("verified").first()).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Mark helpful" }).click();
  await expect(page.getByText("Thanks!")).toBeVisible();
});

test("unrecognised input gets a graceful fallback", async ({ page }) => {
  await openChat(page);
  await ask(page, "zxqwpovnkqwe");
  await expect(page.locator("div.whitespace-pre-wrap").last()).toContainText("couldn't find", {
    timeout: 10000,
  });
});