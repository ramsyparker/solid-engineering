#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, lstat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const folders = new Map([['codex', '.agents'], ['claude', '.claude'], ['cursor', '.cursor']]);
const sourceRoot = fileURLToPath(new URL('../skills/', import.meta.url));
const skills = new Map([
  ['solid-engineering', 'Full engineering workflow: inspect, implement, and verify'],
  ['refactoring', 'Improve structure while preserving observable behavior'],
  ['code-audit', 'Read-only audit with evidence and prioritized findings'],
]);
const help = `SOLID Engineering Standard

Usage: npx @aaramsyy/solidengineering install [options]
       npx @aaramsyy/solidengineering list

  --agent <codex|claude|cursor>  Target agent (default: codex)
  --skill <name>                Install only this skill; repeat to select more
  --global                     Install in your home directory
  --dir <path>                 Custom skills directory (relative to cwd)
  --dry-run                   Show destination without writing files
  --help                      Show this help
  --version                   Show package version

Default: all bundled skills under <cwd>/.agents/skills/
Existing destinations are never overwritten. No install lifecycle hooks.
`;

async function main(args) {
  if (args.length === 0 || (args.length === 1 && args[0] === '--help')) {
    console.log(help);
    return;
  }
  if (args.length === 1 && args[0] === '--version') {
    console.log(JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version);
    return;
  }
  if (args.length === 1 && args[0] === 'list') {
    for (const [name, description] of skills) console.log(`${name} - ${description}`);
    return;
  }
  if (args.shift() !== 'install') throw new Error('Expected install. Use --help for usage.');
  let agent = 'codex';
  let global = false;
  let directory;
  let dryRun = false;
  const selected = new Set();
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--global') global = true;
    else if (arg === '--dry-run') dryRun = true;
    else if (arg === '--agent' || arg === '--dir' || arg === '--skill') {
      const value = args[++index];
      if (!value || value.startsWith('-')) throw new Error(`Missing value for ${arg}.`);
      if (arg === '--agent') agent = value;
      else if (arg === '--skill') {
        if (!skills.has(value)) throw new Error(`Unknown skill: ${value}. Use list to see available skills.`);
        selected.add(value);
      }
      else directory = value;
    } else throw new Error(`Unknown option: ${arg}. Use --help for usage.`);
  }
  if (!folders.has(agent)) throw new Error(`Unknown agent: ${agent}. Choose codex, claude, or cursor.`);
  if (global && directory) throw new Error('Use either --global or --dir, not both.');
  const root = directory ? resolve(directory) : join(global ? homedir() : process.cwd(), folders.get(agent), 'skills');
  const names = selected.size ? [...selected] : [...skills.keys()];
  const installations = names.map(name => ({ name, source: join(sourceRoot, name), destination: join(root, name) }));
  if (dryRun) {
    for (const { name, destination } of installations) console.log(`Would install ${name} to ${destination}`);
    return;
  }
  // Detect existing folders (including symlinks) before writing any skill.
  for (const { source, destination } of installations) {
    await readFile(join(source, 'SKILL.md'));
    try {
      await lstat(destination);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    throw new Error(`Destination already exists: ${destination}. Back it up or select missing skills with --skill; nothing was written.`);
  }
  await mkdir(root, { recursive: true });
  for (const { name, source, destination } of installations) {
    try {
      // Exclusive mkdir still protects against destinations created after preflight.
      await mkdir(destination);
      for (const entry of await readdir(source)) {
        await cp(join(source, entry), join(destination, entry), { recursive: true, force: false, errorOnExist: true });
      }
    } catch (error) {
      throw new Error(`Installation incomplete at ${destination}: ${error.message}. Earlier skills may be installed; inspect the destinations before retrying.`);
    }
    console.log(`Installed ${name} to ${destination}`);
  }
  const prefix = agent === 'codex' ? '$' : '/';
  console.log(`Reload your agent session. Invoke: ${names.map(name => `${prefix}${name}`).join(', ')}`);
  if (agent === 'codex') console.log('You can also select a skill from /skills in Codex CLI or the IDE extension.');
  if (directory) console.log('Make sure your agent is configured to discover this custom directory.');
}

main(process.argv.slice(2)).catch(error => {
  console.error(`solid-engineering: ${error.message}`);
  process.exitCode = 1;
});
