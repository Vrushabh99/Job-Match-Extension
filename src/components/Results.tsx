import type { Comparison } from "../lib/keywords";
import { ChipList } from "./ChipList";

type Props = {
  comparison: Comparison;
  usedSelection: boolean;
};

export function Results({ comparison, usedSelection }: Props) {
  const { matched, missing } = comparison;
  const total = matched.length + missing.length;
  const pct = Math.round((matched.length / total) * 100);

  return (
    <section>
      <div className="score">
        <span className="pct">{pct}%</span>
        <p className="caption">
          {matched.length} of {total} keywords in this posting are on your resume
          {usedSelection ? " (selected text only)." : "."}
        </p>
      </div>
      <div className="bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>

      <h2>Missing from your resume</h2>
      <ChipList
        items={missing}
        variant="missing"
        emptyText="Nothing missing from the keywords I know."
      />

      <h2>Already on your resume</h2>
      <ChipList items={matched} variant="matched" emptyText="No matches yet." />
    </section>
  );
}
