interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="px-5 pb-2 pt-6">
      <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
    </header>
  );
}
