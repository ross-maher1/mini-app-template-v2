"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type {
  Session,
  User,
  AuthError,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { createClient, resetClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: AuthError | Error | null;
}

export interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (
    credentials: SignUpCredentials
  ) => Promise<{ error: AuthError | null; session: Session | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
  sessionVersion: number;
}

// ============================================================================
// CONTEXT
// ============================================================================

export const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialProfile?: Profile | null;
}

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: AuthProviderProps) {
  const pathname = usePathname();

  const [state, setState] = useState<AuthState>({
    user: initialUser,
    session: null,
    profile: initialProfile,
    loading: false,
    error: null,
  });
  const [sessionVersion, setSessionVersion] = useState(0);

  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      if (!supabase) return null;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }

        return data;
      } catch (err) {
        console.error("Error fetching profile:", err);
        return null;
      }
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    setState((prev) => ({ ...prev, profile }));
  }, [state.user, fetchProfile]);

  const clearAuthState = useCallback(
    (error: AuthError | Error | null = null) => {
      resetClient();
      setState({
        user: null,
        session: null,
        profile: null,
        loading: false,
        error,
      });
    },
    []
  );

  const currentUserIdRef = useRef<string | null>(initialUser?.id ?? null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const newUserId = session.user.id;
          const previousUserId = currentUserIdRef.current;

          if (previousUserId && previousUserId !== newUserId) {
            resetClient();
          }

          currentUserIdRef.current = newUserId;

          const profile = await fetchProfile(newUserId);
          setState({
            user: session.user,
            session,
            profile,
            loading: false,
            error: null,
          });
          setSessionVersion((version) => version + 1);
        } else {
          currentUserIdRef.current = null;
          clearAuthState();
          setSessionVersion((version) => version + 1);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, clearAuthState]);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    (async () => {
      try {
        await supabase.auth.getSession();

        const {
          data: { user: browserUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (cancelled) return;

        if (browserUser) {
          const profile = await fetchProfile(browserUser.id);
          if (!cancelled) {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            currentUserIdRef.current = browserUser.id;
            setState({
              user: browserUser,
              session: session ?? null,
              profile,
              loading: false,
              error: null,
            });
          }
        } else if (state.user) {
          currentUserIdRef.current = null;
          clearAuthState();
        }
      } catch (err) {
        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            prev.user || prev.profile
              ? null
              : err instanceof Error
                ? err
                : new Error("Failed to reconcile auth state"),
        }));
      } finally {
        if (!cancelled) {
          setSessionVersion((version) => version + 1);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // Re-run after navigation so the browser client picks up updated auth cookies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, pathname]);

  const signIn = useCallback(
    async ({ email, password }: SignInCredentials) => {
      if (!supabase) {
        const error = new Error("Supabase not initialized") as AuthError;
        return { error };
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error }));
      }

      return { error };
    },
    [supabase]
  );

  const signUp = useCallback(
    async ({ email, password, fullName }: SignUpCredentials) => {
      if (!supabase) {
        const error = new Error("Supabase not initialized") as AuthError;
        return { error, session: null };
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error }));
      } else if (!data?.session) {
        setState((prev) => ({ ...prev, loading: false, error: null }));
      }

      return { error, session: data?.session ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    clearAuthState();
    window.location.replace("/auth/signout");
  }, [clearAuthState]);

  const resetPassword = useCallback(
    async (email: string) => {
      if (!supabase) {
        const error = new Error("Supabase not initialized") as AuthError;
        return { error };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error };
    },
    [supabase]
  );

  const updatePassword = useCallback(
    async (password: string) => {
      if (!supabase) {
        const error = new Error("Supabase not initialized") as AuthError;
        return { error };
      }

      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    },
    [supabase]
  );

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
    sessionVersion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
