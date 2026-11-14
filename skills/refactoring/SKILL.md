---
name: refactoring
description: Refactor existing code to improve cohesion, dependency boundaries, duplication, and testability while preserving observable behavior. Use when structural improvement is requested; do not turn review-only requests into edits or bundle feature changes into a refactor.
---

# Refactoring

Improve the requested code's structure with the smallest justified change. SOLID is a decision aid, not a requirement to add layers, interfaces, or inheritance.

## Establish the contract

1. Read applicable project instructions, the target code, callers, tests, and configured checks before editing.
2. Identify observable behavior that must remain stable: public interfaces, return values, errors, side effects, authorization, persistence, ordering, and relevant timing/concurrency guarantees.
3. Identify the concrete maintenance problem and expected improvement. Avoid unrelated repository cleanup. If no target is given and context cannot identify it, ask for the module or concern before broad changes.
4. Run relevant baseline checks. Record existing failures separately; do not attribute them to your change without evidence.

## Refactor incrementally

- Separate responsibilities and make dependencies explicit where doing so reduces real coupling.
- Prefer simple composition and cohesive functions. Add an abstraction only for a demonstrated boundary, substitution need, or testing benefit.
- Before changing poorly covered behavior, add focused characterization tests for externally observable contracts and important edge cases. Do not freeze a known security flaw as intended behavior; report it separately and address it only within the authorized scope.
- Make one coherent change at a time. Preserve public contracts, dependency/runtime compatibility, and project conventions. Do not replace a framework or storage system as incidental cleanup.
- Confirm code is unused before deleting it. Preserve the user's unrelated edits.
- Run relevant checks after meaningful changes. Investigate regressions and fix their cause; never weaken assertions or security controls merely to pass.

## Verify and report

Review the complete diff and trace the affected real application flow. Check success and failure behavior, side effects, and integration boundaries, not just compilation.

Report the structural improvement, changed files, preserved contracts, commands actually executed and results, and remaining risks. Mark unavailable checks **not verified** with the reason. Do not claim equivalence or performance improvements without evidence.

Respect the requested scope and existing authorization. If the user asks for a refactoring plan or review only, provide it without editing. This skill does not grant permission to publish, delete user data, rewrite history, or change production infrastructure.
