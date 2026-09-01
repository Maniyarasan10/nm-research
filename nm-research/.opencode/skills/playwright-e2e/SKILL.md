---
name: playwright-e2e
description: Use when writing end-to-end tests with Playwright for page interactions, visual regression, or cross-browser testing.
---

# Playwright E2E

## When to Use This Skill
- Writing reliable E2E tests with Playwright
- Using page object models for test organization
- Adding visual regression testing
- Intercepting network requests in tests
- Testing across multiple browsers

## Workflow
1. Set up: `npm init playwright@latest`
2. Write a test: `test('login', async ({ page }) => { ... })`
3. Use locators: `page.getByRole('button', { name: 'Submit' })`
4. Wait for elements: Playwright auto-waits — avoid manual `sleep()`
5. Create page objects: extract selectors and actions into reusable classes
6. Intercept network: `page.route('**/api/data', route => route.fulfill({ ... }))`
7. Visual regression: `expect(page).toHaveScreenshot('login.png')`
8. Run: `npx playwright test` or `npx playwright test --ui`

## Rules
- Use role-based locators, not CSS selectors — they're more resilient
- Let Playwright auto-wait — don't add manual waits or sleeps
- Use fixtures for authentication state — don't log in on every test
- Run tests in parallel in CI for speed
- Use `test.describe` to group related tests
- Check in screenshots for visual regression — they catch unintended changes
