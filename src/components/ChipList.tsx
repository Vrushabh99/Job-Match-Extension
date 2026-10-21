import type { KeywordHit } from "../lib/keywords";

type Props = {
  items: KeywordHit[];
  variant: "matched" | "missing";
  emptyText: string;
};

export function ChipList({ items, variant, emptyText }: Props) {
  return (
    <ul className={`chips ${variant}`}>
      {items.length === 0 && <li className="empty">{emptyText}</li>}
      {items.map(({ label, count }) => (
        <li key={label}>
          {label}
          {count > 1 && <small>×{count}</small>}
        </li>
      ))}
    </ul>
  );
}
