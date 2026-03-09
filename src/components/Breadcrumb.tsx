import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-[#4D2C0A]/60">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#00A651] hover:underline transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#4D2C0A]/90 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
