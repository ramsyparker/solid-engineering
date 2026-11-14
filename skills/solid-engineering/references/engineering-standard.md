# Engineering checklist

Use the sections relevant to the requested work. For a full audit, cover every section and record unavailable evidence. These checks guide engineering decisions; they do not require adding every listed mechanism to every project.

## Design and maintainability

- Give modules, functions, classes, services, handlers, controllers, repositories, middleware, and components a clear responsibility.
- Keep modules cohesive and dependencies explicit. Look for God Objects, oversized functions, circular dependencies, duplicate logic, hidden side effects, and tangled control flow.
- Introduce interfaces only for real boundaries, substitution, or testing benefit. Keep business logic independent of infrastructure where practical.
- Centralize shared configuration; avoid hardcoded secrets, magic values, and duplicated constants.
- Preserve established conventions. Verify code is unused and safe to remove before deleting it.

## Reliability and correctness

- Validate input at system boundaries, including external service responses where untrusted.
- Handle errors explicitly and consistently while preserving diagnostic context. Never swallow exceptions or disguise failure as success.
- Consider concurrency, race conditions, retries, idempotency, timeouts, resource cleanup, and graceful shutdown where relevant.
- Make transaction boundaries and data integrity explicit. Make fallbacks deterministic and observable.
- Ensure production paths contain real functionality rather than mocks or placeholders.

## Security

Match controls to the project's threat model and trust boundaries:

- Verify authentication, authorization, least privilege, and role/permission checks on protected operations.
- Validate inputs and encode outputs; check injection and unsafe deserialization risks.
- Evaluate rate limits and abuse prevention where exposure warrants them.
- Review secret storage and rotation practices without rotating credentials unless authorized.
- Check session, token, cookie, and webhook handling, including authenticity and replay protection where relevant.
- Verify secure transport and external API communication.
- Review dependency/supply-chain risks and relevant advisories.
- Ensure security-relevant audit logs are useful without leaking sensitive data.
- Never print, commit, expose, or copy credentials into source, logs, docs, or fixtures. Never weaken a security control to make tests pass.

## Performance and scalability

- Measure or establish credible evidence for bottlenecks before optimizing.
- Inspect database access patterns, N+1 queries, pagination, payload sizes, and resource usage.
- Consider contention and limits when using asynchronous or concurrent operations.
- Add caching only with clear invalidation and failure behavior.
- Avoid complexity without an observable benefit.

## Compatibility and dependencies

- Preserve working features, user-facing behavior, and API contracts unless an intentional change is required and documented.
- Do not replace frameworks, runtimes, databases, or dependencies without a technical reason.
- Check runtime and version compatibility, maintained support, and relevant security advisories before changing dependencies.
- Keep manifests and lockfiles consistent. Use the repository's existing package manager and configured checks.

## Completion and regression checklist

- Implementation exists in the actual project and is connected to the real application flow.
- Inputs, outputs, errors, permissions, and data formats behave correctly.
- Relevant automated tests pass, including meaningful failure and regression cases.
- Configured build, lint, and type/static checks pass where applicable.
- Integration tests or smoke checks cover the affected real flow at an appropriate level.
- Existing features and public contracts remain intact or intentional changes are documented.
- Authentication and authorization are enforced at the correct boundaries.
- Database migrations, configuration, rollback considerations, and operational procedures are documented where affected.
- Error paths, retry semantics, and fallback behavior match the intended contract.
- No secrets, unsafe workarounds, accidental artifacts, or temporary debugging code were introduced.
- The complete diff has been reviewed, including new files and documentation.
- Every claimed check has an observed result; unavailable checks are explicitly not verified.
- Outstanding blockers include the exact cause and safest next step. Deployment/running-service claims have direct verification.

The goal is understandable, dependable, secure, maintainable software: clear code over clever code, evidence over assumptions, and tested behavior over claims.
