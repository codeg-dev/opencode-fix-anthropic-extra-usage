export type ModelChoice = { providerID: string; modelID: string; variant?: string }

type Candidate = ModelChoice | undefined

export function resolvePromptModel(input: {
  scoped: Candidate
  recent: Candidate
  configured: Candidate
  agent: Candidate
  providerDefault: Candidate
}) {
  return input.scoped ?? input.recent ?? input.configured ?? input.agent ?? input.providerDefault
}

export function resolveAgentSelectionModel(input: { previous: Candidate; agent: Candidate }) {
  return input.previous ?? input.agent
}
