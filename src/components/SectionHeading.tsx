import type { ReactNode } from "react";

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment =
    align === "center"
      ? "mx-auto items-center text-center"
      : "items-start text-left";

  return (
    <div
      className={[
        "max-w-3xl",
        alignment,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="section-kicker">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? (
        <div className="body-large mt-5 max-w-2xl">
          {description}
        </div>
      ) : null}
    </div>
  );
}

export default SectionHeading;
