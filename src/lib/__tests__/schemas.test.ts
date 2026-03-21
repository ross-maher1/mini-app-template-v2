import { describe, it, expect } from "vitest";
import { z } from "zod";

// Recreate the schemas as defined in the auth pages
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

describe("loginSchema", () => {
  it("accepts valid data", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ password: "secret123" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("accepts valid data", () => {
    const result = signupSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "secure99",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fullName", () => {
    const result = signupSchema.safeParse({
      fullName: "",
      email: "jane@example.com",
      password: "secure99",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = signupSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
