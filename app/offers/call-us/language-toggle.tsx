"use client";

type LanguageToggleProps = {
  label: string;
  onToggle: () => void;
};

export default function LanguageToggle({ label, onToggle }: LanguageToggleProps) {
  const switchTo = label.includes("Español") ? "Spanish" : "English";

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${switchTo}`}
    >
      {label}
    </button>
  );
}
