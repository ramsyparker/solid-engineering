# SOLID Engineering

**A practical engineering standard for AI coding agents.**

Created by **aaramsyy** | [GitHub](https://github.com/ramsyparker/solid-engineering) | [npm](https://www.npmjs.com/package/@aaramsyy/solidengineering) | [Releases](https://github.com/ramsyparker/solid-engineering/releases) | [Issues](https://github.com/ramsyparker/solid-engineering/issues)

Install a reusable skill that guides your agent through repository reconnaissance, evidence-based auditing, focused implementation, and verification. Apply SOLID, separation of concerns, and pragmatic engineering judgment without demanding unnecessary classes, layers, or rewrites.

Supports **Codex, Claude Code, and Cursor** through their local skill directories. The installer has **zero runtime dependencies** and no automatic install hooks.

## Quick start

Requires **Node.js 22+** and a supported agent with local skills enabled. Run from the project where you want the skill:

```sh
npx @aaramsyy/solidengineering install
```

The default target is **Codex**: `<current-directory>/.agents/skills/solid-engineering/`. Reload your agent session, then try:

```text
Use $solid-engineering to audit this repository. Report evidence and severity. Do not edit files.
```

Choose another agent:

```sh
npx @aaramsyy/solidengineering install --agent claude
npx @aaramsyy/solidengineering install --agent cursor
```

For Claude Code or Cursor, invoke `/solid-engineering` with your task or ask the agent to use the skill by name. Discovery depends on your agent version and configuration.

### Other package managers

Choose one equivalent command:

```sh
pnpm dlx @aaramsyy/solidengineering install
bunx @aaramsyy/solidengineering install
```

Bun's default executable handling honors the Node.js shebang, so Node.js is still required. For a repeatable installation, pin a published version:

```sh
npx @aaramsyy/solidengineering@0.1.0 install
```

`npm install @aaramsyy/solidengineering` downloads the package but does not copy the agent skill. Run the explicit CLI `install` command to perform that step.

## What the skill does

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
| `--global` | Install under your home directory for use across projects. |
| `--dir <path>` | Custom parent skills directory; the installer appends `solid-engineering`. |
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
| Codex | `<cwd>/.agents/skills/solid-engineering` | `<home>/.agents/skills/solid-engineering` |
| Claude Code | `<cwd>/.claude/skills/solid-engineering` | `<home>/.claude/skills/solid-engineering` |
| Cursor | `<cwd>/.cursor/skills/solid-engineering` | `<home>/.cursor/skills/solid-engineering` |

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
Use solid-engineering to review the authentication flow. Report evidence, severity, impact, and recommended fixes. Do not change code.
```

**Implement**

```text
Use solid-engineering to add pagination to the orders endpoint. Preserve its documented response contract and verify the affected application flow.
```

**Refactor**

```text
Use solid-engineering to reduce coupling in the billing module. Preserve behavior, avoid unrelated rewrites, and run relevant regression checks.
```

## Updating and removing

Existing destinations are **never overwritten**, including empty directories. There is no force, update, or uninstall command.

To update, back up and move the installed `solid-engineering` folder outside the agent's discovery directories, then install the desired version. Keep the backup until you have reviewed the new instructions and restored intentional customizations. Updating the npm package alone does not update a previously copied skill.

To remove, delete only the installed `solid-engineering` directory and reload your agent session. Leave sibling skills and the parent directory intact.

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

Download `aaramsyy-solidengineering-0.1.1.tgz` from [GitHub Releases](https://github.com/ramsyparker/solid-engineering/releases/tag/v0.1.1). This archive includes the installer, skill, README, and MIT license.

From your project directory, substitute the path to your downloaded archive:

```sh
npm exec --yes --package="/path/to/aaramsyy-solidengineering-0.1.1.tgz" -- solidengineering install
```

For example, in Windows PowerShell:

```powershell
npm exec --yes --package="C:/Users/YourName/Downloads/aaramsyy-solidengineering-0.1.1.tgz" -- solidengineering install --agent codex
```

You can also install directly from the release asset:

```sh
npx --yes https://github.com/ramsyparker/solid-engineering/releases/download/v0.1.1/aaramsyy-solidengineering-0.1.1.tgz install
```

Add `--agent claude` or `--agent cursor` to select another agent. Back up and move any existing installation before reinstalling.

With npm 12+, direct URL installs require an explicit per-command opt-in. If you see `EALLOWREMOTE`, use the downloaded archive as shown above, or run:

```sh
npx --yes --allow-remote=root https://github.com/ramsyparker/solid-engineering/releases/download/v0.1.1/aaramsyy-solidengineering-0.1.1.tgz install
```

GitHub Release **v0.1.1** includes the MIT license and updated documentation. The npm commands above use the version available on npm; publishing a GitHub Release does not update that registry.

## License

[MIT](LICENSE). Copyright (c) 2026 **aaramsyy**.
