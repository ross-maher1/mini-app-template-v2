import { Input, type InputProps } from "./Input";

export interface FormFieldProps extends Omit<InputProps, "error"> {
  label: string;
  error?: string;
  id: string;
  children?: React.ReactNode;
}

export function FormField({
  label,
  error,
  id,
  children,
  ref,
  ...inputProps
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children ? (
        <div className="mt-1">{children}</div>
      ) : (
        <Input
          id={id}
          ref={ref}
          error={!!error}
          className="mt-1"
          {...inputProps}
        />
      )}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
