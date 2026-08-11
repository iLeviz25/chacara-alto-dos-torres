import type { LucideIcon } from "lucide-react";

type AdminPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function AdminPlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
}: AdminPlaceholderProps) {
  return (
    <div className="admin-page-stack">
      <header className="admin-page-header">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </header>

      <section className="admin-empty-state">
        <span aria-hidden="true">
          <Icon size={28} />
        </span>
        <h2>Estrutura preparada</h2>
        <p>
          Esta área será ativada em uma próxima etapa. Nenhum conteúdo atual dos
          sites foi migrado ou alterado.
        </p>
      </section>
    </div>
  );
}
