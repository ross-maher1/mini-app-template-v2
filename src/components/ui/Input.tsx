export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ error, className = "", ref, ...rest }: InputProps) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none ${
        error
          ? "border-rose-400 focus:border-rose-500"
          : "border-slate-200 focus:border-slate-400"
      } ${className}`}
      {...rest}
    />
  );
}
