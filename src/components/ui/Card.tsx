export interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Card({ children, header, footer, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60 ${className}`}
    >
      {header && (
        <div className="border-b border-slate-200 px-5 py-4">{header}</div>
      )}
      <div className="px-5 py-4">{children}</div>
      {footer && (
        <div className="border-t border-slate-200 px-5 py-3">{footer}</div>
      )}
    </div>
  );
}
