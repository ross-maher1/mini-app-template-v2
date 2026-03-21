import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/lib/logger";

describe("logger", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("info() calls console.info with expected message in development", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logger.info("hello world");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("hello world");
  });

  it("warn() calls console.warn with expected message", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("something is off");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("something is off");
  });

  it("error() includes metadata in output", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("request failed", { userId: "abc", status: 500 });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("request failed");
    expect(spy.mock.calls[0][1]).toEqual({ userId: "abc", status: 500 });
  });
});
