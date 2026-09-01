---
name: jest-strategies
description: Use when writing effective Jest tests — mocking strategies, snapshot testing, parameterized tests, or test organization patterns.
---

# Jest Strategies

## When to Use This Skill
- Mocking modules, functions, or timers in Jest
- Writing snapshot tests for UI components
- Creating parameterized or data-driven tests
- Organizing tests with describe/it blocks and test utilities
- Debugging failing tests with Jest's built-in tools

## Workflow
1. Mock dependencies: `jest.mock('./module')` or `jest.fn()` for functions
2. Mock timers: `jest.useFakeTimers()` and `jest.advanceTimersByTime()`
3. Snapshot tests: `expect(component).toMatchSnapshot()` — update with `-u`
4. Parameterized tests: use `test.each` or `describe.each` with data arrays
5. Arrange-act-assert: structure every test with clear phases
6. Debug: `--verbose`, `--detectOpenHandles`, or `node --inspect` with Jest
7. Coverage: `jest --coverage` — aim for meaningful coverage, not 100%

## Rules
- Mock at the boundary, not everywhere — prefer real implementations when fast
- Keep tests independent — no shared state between tests
- Use `beforeEach` for setup, not `beforeAll` for mutable state
- Don't test implementation details — test behavior and output
- One assertion per test when possible — keep tests focused
- Update snapshots intentionally, not blindly with `-u`
