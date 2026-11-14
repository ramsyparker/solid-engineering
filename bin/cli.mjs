#!/usr/bin/env node
import { cp, mkdir, readFile, readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const folders = new Map([['codex', '.agents'], ['claude', '.claude'], ['cursor', '.cursor']]);
const source = fileURLToPath(new URL('../skills/solid-engineering/', import.meta.url));
const help = `SOLID Engineering Standard

Usage: npx @aaramsyy/solidengineering install [options]

  --agent <codex|claude|cursor>  Target agent (default: codex)
  --global                     Install in your home directory
  --dir <path>                 Custom skills directory (relative to cwd)
  --dry-run                   Show destination without writing files
  --help                      Show this help
  --version                   Show package version

Default: <cwd>/.agents/skills/solid-engineering
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
  if (args.shift() !== 'install') throw new Error('Expected install. Use --help for usage.');
  let agent = 'codex';
  let global = false;
  let directory;
  let dryRun = false;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--global') global = true;
    else if (arg === '--dry-run') dryRun = true;
    else if (arg === '--agent' || arg === '--dir') {
      const value = args[++index];
      if (!value || value.startsWith('-')) throw new Error(`Missing value for ${arg}.`);
      if (arg === '--agent') agent = value;
      else directory = value;
    } else throw new Error(`Unknown option: ${arg}. Use --help for usage.`);
  }
  if (!folders.has(agent)) throw new Error(`Unknown agent: ${agent}. Choose codex, claude, or cursor.`);
  if (global && directory) throw new Error('Use either --global or --dir, not both.');
  const root = directory ? resolve(directory) : join(global ? homedir() : process.cwd(), folders.get(agent), 'skills');
  const destination = join(root, 'solid-engineering');
  if (dryRun) {
    console.log(`Would install to ${destination}`);
    return;
  }
  // Validate the shipped payload before reserving the destination.
  await readFile(join(source, 'SKILL.md'));
  await mkdir(root, { recursive: true });
  try {
    await mkdir(destination);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Destination already exists: ${destination}. Back it up or choose --dir; nothing was overwritten.`);
    throw error;
  }
  try {
    for (const entry of await readdir(source)) {
      await cp(join(source, entry), join(destination, entry), { recursive: true, force: false, errorOnExist: true });
    }
  } catch (error) {
    throw new Error(`Installation incomplete at ${destination}: ${error.message}. Inspect that folder before retrying.`);
  }
  console.log(`Installed solid-engineering to ${destination}`);
  console.log('Reload your agent session, then ask it to use solid-engineering for your task.');
}

main(process.argv.slice(2)).catch(error => {
  console.error(`solid-engineering: ${error.message}`);
  process.exitCode = 1;
});
