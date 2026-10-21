import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
  onSave: () => Promise<void>;
};

export function ResumeBox({ value, open, onOpenChange, onChange, onSave }: Props) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleSave() {
    await onSave();
    setSaved(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(false), 1500);
  }

  return (
    <details open={open} onToggle={(e) => onOpenChange(e.currentTarget.open)}>
      <summary>Your resume here</summary>
      <textarea
        rows={8}
        value={value}
        placeholder="Paste your resume as plain text"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="row">
        <button className="secondary" type="button" onClick={handleSave}>
          Save resume
        </button>
        <span className="muted" role="status">
          {saved ? "Saved" : ""}
        </span>
      </div>
    </details>
  );
}
