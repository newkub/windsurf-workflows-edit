import { describe, it, expect, vi } from "vitest";
import type { H3Event } from "h3";
import handler from "./workflows.get";
import fs from "node:fs/promises";

// Mock the fs/promises module
vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn(),
  },
}));

// Mock gray-matter
vi.mock("gray-matter", () => ({
  default: (_content: string) => ({
    data: { title: "Mock Title", description: "Mock Description" },
    content: "Mock Content",
  }),
}));

describe("GET /api/workflows", () => {
  it("should return a list of workflows", async () => {
    // Arrange
    const mockFiles = ["test1.md", "test2.md", "not-a-markdown.txt"];
    const mockFileContent = "---\ntitle: Test\n---\nContent";

    (fs.readdir as vi.Mock).mockResolvedValue(mockFiles);
    (fs.readFile as vi.Mock).mockResolvedValue(mockFileContent);

    // Act
    const response = await handler({} as H3Event); // We can pass a mock event if needed

    // Assert
    expect(response).toBeInstanceOf(Array);
    if (Array.isArray(response)) {
      expect(response).toHaveLength(2); // two markdown files
      expect(response[0]).toHaveProperty("id", "test1");
      expect(response[0]).toHaveProperty("title", "Mock Title");
    }
    expect(fs.readdir).toHaveBeenCalledWith(expect.any(String));
  });

  it("should handle errors when reading directories", async () => {
    // Arrange
    (fs.readdir as vi.Mock).mockRejectedValue(new Error("Read error"));

    // Act
    const response = (await handler({} as H3Event)) as Response;
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.error).toBe("Read error");
  });
});
