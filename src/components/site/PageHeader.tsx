import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-gradient border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
