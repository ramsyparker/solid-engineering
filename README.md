# SOLID Engineering

**A practical engineering standard for AI coding agents.**

Created by **aaramsyy** | [GitHub](https://github.com/ramsyparker/solid-engineering) | [npm](https://www.npmjs.com/package/@aaramsyy/solidengineering) | [Releases](https://github.com/ramsyparker/solid-engineering/releases) | [Issues](https://github.com/ramsyparker/solid-engineering/issues)

Install a set of focused skills that guides your agent through repository reconnaissance, evidence-based auditing, focused implementation, and verification. Apply SOLID, separation of concerns, and pragmatic engineering judgment without demanding unnecessary classes, layers, or rewrites.

Supports **Codex, Claude Code, and Cursor** through their local skill directories. The installer has **zero runtime dependencies** and no automatic install hooks.

## Quick start

Requires **Node.js 22+** and a supported agent with local skills enabled. Run from the project where you want the skill:

```sh
npx @aaramsyy/solidengineering install
```

Version **0.2.0+** installs all three skills by default under `<current-directory>/.agents/skills/` for **Codex**. If your npm version is older, use the GitHub Release archive below for the new commands. Reload your agent session, then try:

```text
Use $solid-engineering to audit this repository. Report evidence and severity. Do not edit files.
```

Choose another agent:

```sh
npx @aaramsyy/solidengineering install --agent claude
npx @aaramsyy/solidengineering install --agent cursor
```

## Available skills and commands

| Skill | Purpose | Claude Code / Cursor | Codex CLI / IDE |
| --- | --- | --- | --- |
| `solid-engineering` | Full engineering workflow, implementation, and verification | `/solid-engineering` | `$solid-engineering` |
| `refactoring` | Improve structure while preserving observable behavior | `/refactoring` | `$refactoring` |
| `code-audit` | Read-only review with evidence and prioritized findings | `/code-audit` | `$code-audit` |

In Claude Code or Cursor, type `/` in agent chat and select a skill. In Codex CLI or the IDE extension, use `/skills` to select a skill or type `$` to mention it. Do not assume `/refactoring` registers as a custom Codex slash command. These are agent instructions invoked in chat, not terminal commands or new MCP tools. Existing agent tools perform the work.

```text
/refactoring src/billing - simplify responsibilities without changing behavior
/code-audit src/auth - report findings without editing code
/solid-engineering implement pagination and verify the affected flow
```

For Codex, use `$refactoring`, `$code-audit`, or `$solid-engineering` with the same task description. Discovery depends on your agent version and configuration. See the official [Codex invocation guide](https://learn.chatgpt.com/docs/build-skills), [Claude Code skills guide](https://code.claude.com/docs/en/skills), and [Cursor skills guide](https://cursor.com/docs/skills).

Each skill is self-contained and can be installed alone:

```sh
npx @aaramsyy/solidengineering list
npx @aaramsyy/solidengineering install --agent claude --skill refactoring
npx @aaramsyy/solidengineering install --agent cursor --skill refactoring --skill code-audit
```

`list` shows the bundled skill catalog, not the skills already installed in your project.

### Other package managers

Choose one equivalent command:

```sh
pnpm dlx @aaramsyy/solidengineering install
bunx @aaramsyy/solidengineering install
```

Bun's default executable handling honors the Node.js shebang, so Node.js is still required. Multi-skill installation and `--skill` require version 0.2.0 or newer; older versions install only `solid-engineering`.

`npm install @aaramsyy/solidengineering` downloads the package but does not copy the agent skill. Run the explicit CLI `install` command to perform that step.

### GitHub Packages

The GitHub Packages distribution uses **`@ramsyparker/solidengineering`**, matching the repository owner's namespace. The npm distribution remains **`@aaramsyy/solidengineering`**. Matching versions provide the same skills and installer; registry releases may differ.

GitHub's npm registry requires authentication to download packages, including public packages. Use a GitHub personal access token (classic) with `read:packages` when prompted for the password:

```sh
npm login --scope=@ramsyparker --auth-type=legacy --registry=https://npm.pkg.github.com
npx --registry=https://npm.pkg.github.com @ramsyparker/solidengineering install
```

Add `--agent claude` or `--agent cursor` to select another agent. For installation without GitHub registry authentication, use the npm quick start or the GitHub Release archive below. See [GitHub's package authentication documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

## The full engineering workflow

| Stage | Expected behavior |
| --- | --- |
| Reconnaissance | Inspect instructions, architecture, dependencies, and real application flows before editing. |
| Audit | Report actionable findings with evidence, impact, and Critical / High / Medium / Low severity. |
| Plan | Prioritize risk, define acceptance criteria, and choose the smallest safe implementation. |
| Implement | Make focused changes and preserve established contracts. |
| Verify | Run relevant configured checks and report observed results. |
| Regression review | Check affected features, permissions, data integrity, and failure paths. |
| Final review | Inspect the complete diff and report limitations and unverified requirements. |

The supporting checklist covers design, reliability, security, performance, and compatibility. Depth scales to the task: a narrow fix should not become a repository-wide redesign.

**Audit-only requests stay read-only.** Implementation requests continue through verification. The skill does not grant additional permissions, authorize destructive actions, or guarantee production readiness. Review and testing remain necessary.

Read the [skill instructions](skills/solid-engineering/SKILL.md) and [engineering checklist](skills/solid-engineering/references/engineering-standard.md).

## CLI reference

```text
npx @aaramsyy/solidengineering install [options]
```

| Option | Behavior |
| --- | --- |
| `--agent <name>` | Target `codex`, `claude`, or `cursor`. Default: `codex`. |
| `--skill <name>` | Install only the named skill. Repeat to select multiple skills. Default: all three. |
| `--global` | Install under your home directory for use across projects. |
| `--dir <path>` | Custom parent skills directory; the installer creates one subdirectory per selected skill. |
| `--dry-run` | Print the destination without writing. Does not validate writability or conflicts. |

Top-level commands, without `install`:

```sh
npx @aaramsyy/solidengineering --help
npx @aaramsyy/solidengineering --version
```

No arguments also shows help. Unknown arguments fail with a nonzero exit code. Use separate option values (`--agent claude`), not `--agent=claude`.

### Installation locations

| Agent | Project path | Personal path (`--global`) |
| --- | --- | --- |
| Codex | `<cwd>/.agents/skills/<skill-name>` | `<home>/.agents/skills/<skill-name>` |
| Claude Code | `<cwd>/.claude/skills/<skill-name>` | `<home>/.claude/skills/<skill-name>` |
| Cursor | `<cwd>/.cursor/skills/<skill-name>` | `<home>/.cursor/skills/<skill-name>` |

`<cwd>` is where you run the command; the installer does not search for a repository root. `<home>` is your operating system's user home directory.

```sh
# Preview the destination
npx @aaramsyy/solidengineering install --dry-run

# Install for Claude Code across projects
npx @aaramsyy/solidengineering install --agent claude --global

# Install under a custom parent directory
npx @aaramsyy/solidengineering install --dir "./team skills"
```

Relative custom paths resolve from the current directory. `--global` and `--dir` cannot be combined. A custom directory must be discoverable by your agent or configured separately.

Directory conventions follow the official [Codex](https://learn.chatgpt.com/docs/build-skills), [Claude Code](https://code.claude.com/docs/en/skills), and [Cursor](https://cursor.com/docs/skills) documentation.

## Example tasks

**Audit**

```text
Use code-audit to review the authentication flow. Report evidence, severity, impact, and recommended fixes. Do not change code.
```

**Implement**

```text
Use solid-engineering to add pagination to the orders endpoint. Preserve its documented response contract and verify the affected application flow.
```

**Refactor**

```text
Use refactoring to reduce coupling in the billing module. Preserve behavior, avoid unrelated rewrites, and run relevant regression checks.
```

## Updating and removing

Existing destinations are **never overwritten**, including empty directories. There is no force, update, or uninstall command.

To update, back up and move the installed folders for the skills you want to update outside the agent's discovery directories, then install the desired version. Keep the backup until you have reviewed the new instructions and restored intentional customizations. Updating the npm package alone does not update a previously copied skill.

To remove a skill, delete only its installed directory and reload your agent session. Leave sibling skills and the parent directory intact.

To add the new skills alongside an existing `solid-engineering` installation, select only the missing skills:

```sh
npx @aaramsyy/solidengineering install --skill refactoring --skill code-audit
```

Use the same `--agent` and scope as your existing installation. Before copying, the installer checks every selected destination. A known conflict stops the whole request without writing skills. An unexpected copy error can still leave earlier skills installed; inspect the reported paths before retrying.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `Destination already exists` | Back up and move the existing skill before reinstalling, or choose another `--dir`. |
| `Installation incomplete` | Inspect the reported destination and filesystem permissions. A failed copy can leave partial files; move that partial directory before retrying. |
| Skill does not appear | Check the target directory, agent configuration, and local skill support; reload the session. |
| Runtime or syntax error | Check `node --version`; Node.js 22+ is required. |
| Unknown option or missing value | Check the CLI reference and provide option values as separate arguments. |
| npm authentication/download error | Check registry connectivity and npm configuration. A download failure occurs before the skill installer runs. |

Report reproducible problems through [GitHub Issues](https://github.com/ramsyparker/solid-engineering/issues). Include OS, Node.js version, package version, command, and sanitized error output. Do not include credentials, tokens, or private project data.

## Install from a GitHub Release

Download `aaramsyy-solidengineering-0.2.0.tgz` from [GitHub Releases](https://github.com/ramsyparker/solid-engineering/releases/tag/v0.2.0). This archive includes the installer, all three skills, README, and MIT license.

From your project directory, substitute the path to your downloaded archive:

```sh
npm exec --yes --package="/path/to/aaramsyy-solidengineering-0.2.0.tgz" -- solidengineering install
```

For example, in Windows PowerShell:

```powershell
npm exec --yes --package="C:/Users/YourName/Downloads/aaramsyy-solidengineering-0.2.0.tgz" -- solidengineering install --agent codex
```

You can also install directly from the release asset:

```sh
npx --yes https://github.com/ramsyparker/solid-engineering/releases/download/v0.2.0/aaramsyy-solidengineering-0.2.0.tgz install
```

Add `--agent claude` or `--agent cursor` to select another agent. Back up and move any existing installation before reinstalling.

With npm 12+, direct URL installs require an explicit per-command opt-in. If you see `EALLOWREMOTE`, use the downloaded archive as shown above, or run:

```sh
npx --yes --allow-remote=root https://github.com/ramsyparker/solid-engineering/releases/download/v0.2.0/aaramsyy-solidengineering-0.2.0.tgz install
```

GitHub Release **v0.2.0** includes all three skills and selective installation. The npm commands above use the version available on npm; publishing a GitHub Release does not update that registry.

## License

[MIT](LICENSE). Copyright (c) 2026 **aaramsyy**.
