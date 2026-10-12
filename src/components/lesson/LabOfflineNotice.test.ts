import { describe, it, expect } from "vitest";
import {
  LabOfflineNotice,
  getOfflineMessage,
  resolveOffline,
  DEFAULT_OFFLINE_MESSAGE,
} from "./LabOfflineNotice";

// Node environment (no DOM): exercise the pure resolution/message logic and
// assert the module exposes a renderable component function.
describe("LabOfflineNotice", () => {
  it("is exported as a component function", () => {
    expect(typeof LabOfflineNotice).toBe("function");
  });
});

describe("resolveOffline", () => {
  it("forcedOffline=true wins over an online browser (offline)", () => {
    expect(resolveOffline(true, true)).toBe(true);
  });

  it("forcedOffline=false wins over an offline browser (online)", () => {
    expect(resolveOffline(false, false)).toBe(false);
  });

  it("falls back to navigator.onLine when forcedOffline is undefined", () => {
    expect(resolveOffline(undefined, false)).toBe(true);
    expect(resolveOffline(undefined, true)).toBe(false);
  });
});

describe("getOfflineMessage", () => {
  it("returns the default message mentioning conexión", () => {
    expect(getOfflineMessage()).toContain("conexión");
    expect(getOfflineMessage()).toBe(DEFAULT_OFFLINE_MESSAGE);
  });

  it("uses a custom message when provided", () => {
    expect(getOfflineMessage("Sin red")).toBe("Sin red");
  });

  it("falls back to the default for empty/whitespace input", () => {
    expect(getOfflineMessage("   ")).toBe(DEFAULT_OFFLINE_MESSAGE);
  });
});
