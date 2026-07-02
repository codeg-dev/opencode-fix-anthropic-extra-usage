import { describe, expect, mock, test } from "bun:test"
import path from "path"

let realpathCalls = 0
const realFs = await import("node:fs")
const fakeRealpathSync = Object.assign(
  (input: string) => {
    realpathCalls++
    if (realpathCalls === 1) throw Object.assign(new Error("interrupted"), { code: "EINTR" })
    return path.resolve(input)
  },
  { native: realFs.realpathSync.native },
)

mock.module("fs", () => ({
  ...realFs,
  realpathSync: fakeRealpathSync,
}))

const { Filesystem } = await import("@/util/filesystem")

describe("Filesystem.resolve", () => {
  test("retries when realpathSync is interrupted", () => {
    realpathCalls = 0

    expect(Filesystem.resolve("/tmp/opencode-eintr")).toBe("/tmp/opencode-eintr")
    expect(realpathCalls).toBe(2)
  })
})
