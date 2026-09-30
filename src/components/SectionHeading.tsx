type Props = { index: number; label: string; title: string; id?: string };

export function SectionHeading({ index, label, title, id }: Props) {
  return (
    <div data-reveal className="mb-12 lg:mb-16">
      <p className="meta mb-4 text-text-2">
        ({String(index).padStart(2, "0")}) {label}
      </p>
      <h2 id={id} className="font-display h-section">
        {title}
      </h2>
    </div>
  );
}
