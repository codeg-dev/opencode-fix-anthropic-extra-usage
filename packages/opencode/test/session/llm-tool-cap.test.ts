import { describe, expect, test } from "bun:test"
import { tool, type Tool } from "ai"
import z from "zod"
import { capToolsForModel } from "../../src/session/llm"

function inputFor(npm: string) {
  return {
    model: { api: { npm } },
  }
}

function tools(count: number): Record<string, Tool> {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `tool_${String(index).padStart(3, "0")}`,
      tool({ description: "test", inputSchema: z.object({}) }),
    ]),
  )
}

describe("session.llm.capToolsForModel", () => {
  test("caps OpenAI Responses tools at 128 while preserving registration order", () => {
    const capped = capToolsForModel(inputFor("@ai-sdk/openai"), tools(150))
    expect(Object.keys(capped)).toHaveLength(128)
    expect(Object.keys(capped).at(0)).toBe("tool_000")
    expect(Object.keys(capped).at(-1)).toBe("tool_127")
  })

  test("does not cap non-OpenAI providers", () => {
    const original = tools(150)
    const capped = capToolsForModel(inputFor("@ai-sdk/anthropic"), original)
    expect(capped).toBe(original)
    expect(Object.keys(capped)).toHaveLength(150)
  })
})
