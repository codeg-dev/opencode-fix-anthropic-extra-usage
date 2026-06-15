import { describe, expect, test } from "bun:test"
import { resolveAgentSelectionModel, resolvePromptModel, type ModelChoice } from "./model-selection"

const model = (providerID: string, modelID: string): ModelChoice => ({ providerID, modelID })

describe("prompt model selection", () => {
  test("keeps an explicit scoped model ahead of recent/configured/agent defaults", () => {
    expect(
      resolvePromptModel({
        scoped: model("openai", "gpt-5.5"),
        recent: model("cpa-google", "gemini-3.1-pro-preview"),
        configured: model("anthropic", "claude-opus-4-8"),
        agent: model("anthropic", "claude-opus-4-8"),
        providerDefault: model("openai", "gpt-5.4-mini"),
      }),
    ).toEqual(model("openai", "gpt-5.5"))
  })

  test("uses recent user selection before configured or OmO agent defaults", () => {
    expect(
      resolvePromptModel({
        scoped: undefined,
        recent: model("openai", "gpt-5.5"),
        configured: model("anthropic", "claude-opus-4-8"),
        agent: model("anthropic", "claude-opus-4-8"),
        providerDefault: model("openai", "gpt-5.4-mini"),
      }),
    ).toEqual(model("openai", "gpt-5.5"))
  })

  test("does not let an agent switch overwrite an existing prompt model", () => {
    expect(
      resolveAgentSelectionModel({
        previous: model("openai", "gpt-5.5"),
        agent: model("anthropic", "claude-opus-4-8"),
      }),
    ).toEqual(model("openai", "gpt-5.5"))
  })
})
