"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
      <h1 className="type-h1">Something went wrong</h1>
      {process.env.NODE_ENV === "development" && (
        <p className="mt-2 max-w-md text-sm text-slate-600">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
      >
        Try again
      </button>
    </main>
  );
}
