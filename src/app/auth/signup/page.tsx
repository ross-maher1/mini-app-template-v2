"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setError(null);
    setLoading(true);

    const { error } = await signUp({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="space-y-10">
        <div className="space-y-2">
          <p className="type-meta">Authentication</p>
          <h1 className="type-h1">Check Your Email</h1>
          <p className="type-lead">
            We&apos;ve sent you a confirmation link. Please check your email to
            complete your registration.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-md">
          <p className="text-sm text-slate-600">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => setSuccess(false)}
              className="font-medium text-slate-900 hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-10">
      <div className="space-y-2">
        <p className="type-meta">Authentication</p>
        <h1 className="type-h1">Create Account</h1>
        <p className="type-lead">Sign up to get started.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />

          <FormField
            id="fullName"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <FormField id="password" label="Password" error={errors.password?.message}>
            <PasswordInput
              id="password"
              {...register("password")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm transition-colors focus:border-slate-400 focus:outline-none"
              placeholder="••••••••"
            />
          </FormField>

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" loading={loading}>
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-slate-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
