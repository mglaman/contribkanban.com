import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getApiBaseUrl,
  apiFetch,
  legacyApiFetch,
  drupalApiFetch,
  getMappedIncludes,
  getRelationshipFromMappedIncludes,
} from "../api";

function makeFetchResponse(overrides = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => ({}),
    ...overrides,
  };
}

describe("getApiBaseUrl", () => {
  it("returns ddev URL when no Lagoon env vars are set", () => {
    expect(getApiBaseUrl()).toBe("https://contribkanban.com.ddev.site");
  });
});

describe("apiFetch", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(makeFetchResponse());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prepends base URL and /jsonapi for relative paths", async () => {
    await apiFetch("/node--board");
    const [request] = fetchMock.mock.calls[0];
    expect(request.url).toBe(
      `${getApiBaseUrl()}/jsonapi/node--board`
    );
  });

  it("does not modify absolute URLs", async () => {
    await apiFetch("https://example.com/api/resource");
    const [request] = fetchMock.mock.calls[0];
    expect(request.url).toBe("https://example.com/api/resource");
  });

  it("sets Accept header to JSON:API media type", async () => {
    await apiFetch("/node--board");
    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Accept")).toBe("application/vnd.api+json");
  });

  it("sets Content-Type header for POST requests", async () => {
    await apiFetch("/node--board", { method: "POST", body: "{}" });
    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Content-Type")).toBe(
      "application/vnd.api+json"
    );
  });

  it("sets Content-Type header for PATCH requests", async () => {
    await apiFetch("/node--board", { method: "PATCH", body: "{}" });
    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Content-Type")).toBe(
      "application/vnd.api+json"
    );
  });

  it("does not set Content-Type for GET requests", async () => {
    await apiFetch("/node--board");
    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Content-Type")).toBeNull();
  });

  it("returns the fetch response", async () => {
    const mockResponse = makeFetchResponse({ status: 404, ok: false });
    fetchMock.mockResolvedValue(mockResponse);
    const result = await apiFetch("/not-found");
    expect(result).toBe(mockResponse);
  });
});

describe("legacyApiFetch", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(makeFetchResponse());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prepends base URL without /jsonapi", async () => {
    await legacyApiFetch("/api/boards");
    const [request] = fetchMock.mock.calls[0];
    expect(request.url).toBe(`${getApiBaseUrl()}/api/boards`);
  });

  it("sets Accept header to application/json", async () => {
    await legacyApiFetch("/api/boards");
    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Accept")).toBe("application/json");
  });
});

describe("drupalApiFetch", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(makeFetchResponse());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls the drupal.org API endpoint", async () => {
    await drupalApiFetch("/node/12345.json");
    const [request] = fetchMock.mock.calls[0];
    expect(request.url).toBe(
      "https://www.drupal.org/api-d7/node/12345.json"
    );
  });

  it("sets Accept header to application/json", async () => {
    await drupalApiFetch("/node/12345.json");
    const [request] = fetchMock.mock.calls[0];
    expect(request.headers.get("Accept")).toBe("application/json");
  });
});

describe("getMappedIncludes", () => {
  it("returns empty object when document has no included", () => {
    expect(getMappedIncludes({ data: [] })).toEqual({});
  });

  it("returns empty object when included is undefined", () => {
    expect(getMappedIncludes({})).toEqual({});
  });

  it("maps included resources by type and id", () => {
    const document = {
      included: [
        { type: "node--board", id: "abc-123", attributes: { title: "Board A" } },
        { type: "node--board", id: "def-456", attributes: { title: "Board B" } },
        { type: "taxonomy--tag", id: "tag-1", attributes: { name: "Tag" } },
      ],
    };
    const result = getMappedIncludes(document);
    expect(result["node--board"]["abc-123"].attributes.title).toBe("Board A");
    expect(result["node--board"]["def-456"].attributes.title).toBe("Board B");
    expect(result["taxonomy--tag"]["tag-1"].attributes.name).toBe("Tag");
  });

  it("handles multiple resources of the same type", () => {
    const document = {
      included: [
        { type: "node--board", id: "1" },
        { type: "node--board", id: "2" },
      ],
    };
    const result = getMappedIncludes(document);
    expect(Object.keys(result["node--board"])).toHaveLength(2);
  });
});

describe("getRelationshipFromMappedIncludes", () => {
  it("returns resolved relationship objects", () => {
    const include1 = { type: "node--board", id: "abc-123", attributes: { title: "Board A" } };
    const include2 = { type: "node--board", id: "def-456", attributes: { title: "Board B" } };
    const mappedIncludes = {
      "node--board": {
        "abc-123": include1,
        "def-456": include2,
      },
    };
    const document = {
      relationships: {
        field_boards: {
          data: [
            { type: "node--board", id: "abc-123" },
            { type: "node--board", id: "def-456" },
          ],
        },
      },
    };
    const result = getRelationshipFromMappedIncludes(
      document,
      "field_boards",
      mappedIncludes
    );
    expect(result).toEqual([include1, include2]);
  });

  it("returns a single-item array for a single relationship", () => {
    const include = { type: "taxonomy--tag", id: "tag-1" };
    const mappedIncludes = { "taxonomy--tag": { "tag-1": include } };
    const document = {
      relationships: {
        field_tags: {
          data: [{ type: "taxonomy--tag", id: "tag-1" }],
        },
      },
    };
    const result = getRelationshipFromMappedIncludes(
      document,
      "field_tags",
      mappedIncludes
    );
    expect(result).toEqual([include]);
  });
});
