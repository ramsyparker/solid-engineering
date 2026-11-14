---
name: code-audit
description: Audit a repository, module, or diff for correctness, security, reliability, and maintainability issues with evidence and severity. Use for read-only engineering reviews and prioritized findings, not for implementing fixes.
---

# Code Audit

Perform an evidence-based, read-only review of the requested scope. Do not edit source, configuration, tests, or dependencies; do not run auto-fixers or commands that change external systems. Test commands may generate ordinary temporary/build artifacts: inspect their scripts first and avoid destructive, production-connected, or deployment steps.

## Inspect

1. Read repository instructions and establish whether the requested scope is a diff, module, workflow, or complete repository. Do not inflate a narrow review into unrelated cleanup.
2. Inspect entry points, contracts, callers, configuration, tests, and affected integrations. Trace real data flow and trust boundaries instead of inferring behavior from names alone.
3. Check correctness and edge cases; authentication/authorization; input validation; error handling; state and transaction integrity; concurrency, retry, and cleanup behavior; and dependency compatibility where relevant.
4. Evaluate maintainability against actual change risks. An absent interface or layer is not itself a SOLID violation. Flag performance risks with evidence, not unsupported optimization claims.
5. Use appropriate read-only checks or isolated tests to investigate. Distinguish reproduced problems, source-supported defects, and unverified hypotheses. Never print secrets from files or logs.

## Findings

List actionable findings in descending severity:

- **Critical:** exploitable security issue, data loss, or major production outage risk.
- **High:** major functional failure, authorization flaw, or serious reliability issue.
- **Medium:** meaningful correctness, performance, or maintainability impact.
- **Low:** minor improvement with a clear benefit.

For each finding, provide an affected file/location, trigger or scenario, supporting evidence, practical impact, and the smallest recommended fix. Avoid duplicate findings, generic checklists presented as defects, and claims without a plausible failure path. Identify uncertainty and what evidence would resolve it.

Finish with the scope reviewed, checks actually executed and results, and coverage gaps. If no actionable findings are supported, say so without implying the system is bug-free or production-ready.

Stop after reporting. A later explicit request to fix findings authorizes a separate implementation task; this audit skill alone does not authorize changes or deployment.
