import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EVAL_CASES, evaluate } from "./evaluate";

describe("retrieval evaluation report (npm run eval)", () => {
  it("computes Hit@1 / Hit@3 / MRR and prints the summary", () => {
    const report = evaluate(EVAL_CASES);

    const summary = [
      { metric: "total cases", value: report.total },
      { metric: "Hit@1", value: `${report.hitAt1} (${(report.hitAt1Rate * 100).toFixed(1)}%)` },
      { metric: "Hit@3", value: `${report.hitAt3} (${(report.hitAt3Rate * 100).toFixed(1)}%)` },
      { metric: "MRR", value: report.mrr.toFixed(4) },
    ];
    console.table(summary);

    const misses = report.rows.filter((r) => !r.hitAt1);
    if (misses.length > 0) {
      console.warn(
        "\nMisses (best rank, expected-first-of):\n" +
          misses
            .map((m) => `  "${m.q}" -> #${m.rank} ${m.top[0] ?? "(none)"} (wanted ${m.expected[0]})`)
            .join("\n"),
      );
    }

    mkdirSync(join(process.cwd(), "reports"), { recursive: true });
    writeFileSync(
      join(process.cwd(), "reports", "rag-eval.json"),
      JSON.stringify(report, null, 2),
    );

    expect(report.hitAt1Rate).toBeGreaterThanOrEqual(0.9);
    expect(report.mrr).toBeGreaterThanOrEqual(0.92);
  });
});