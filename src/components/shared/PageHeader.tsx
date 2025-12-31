import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title?: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, children }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-br from-primary to-kcssc-red py-16 md:py-20">
      <div className="container-kcssc">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-primary-foreground/80">
            <li>
              <Link to="/" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                {item.href ? (
                  <Link to={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-primary-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title & Description */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            {title && <h1 className="text-primary-foreground mb-4">{title}</h1>}
            {description && (
              <p className="text-xl text-primary-foreground/90 max-w-3xl">{description}</p>
            )}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    </section>
  );
}
