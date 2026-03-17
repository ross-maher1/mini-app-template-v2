export interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({
  width,
  height,
  className = "",
  rounded = true,
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200 ${rounded ? "rounded-md" : ""} ${className}`}
      style={{ width, height }}
    />
  );
}
