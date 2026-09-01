import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { submitWeb3Form } from "./web3forms";
import { WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from "./config";

const fetchMock = vi.fn();

beforeAll(() => {
  globalThis.fetch = fetchMock;
});

afterEach(() => {
  fetchMock.mockReset();
});

describe("submitWeb3Form", () => {
  it("returns success when the endpoint responds ok with success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitWeb3Form({ name: "Jane" }, "Test subject", "Jane");

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      WEB3FORMS_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Test subject",
          from_name: "Jane",
          name: "Jane",
        }),
      }),
    );
  });

  it("returns failure when the endpoint responds ok but not success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    });

    const result = await submitWeb3Form({}, "subject", "from");
    expect(result).toEqual({ success: false, message: "Submission failed" });
  });

  it("returns failure when the response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const result = await submitWeb3Form({}, "subject", "from");
    expect(result).toEqual({ success: false, message: "Submission failed" });
  });

  it("tolerates a non-JSON response body", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("invalid json");
      },
    });

    const result = await submitWeb3Form({}, "subject", "from");
    expect(result.success).toBe(false);
  });

  it("returns a network error message when fetch throws", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const result = await submitWeb3Form({}, "subject", "from");
    expect(result).toEqual({ success: false, message: "Network error" });
  });
});
