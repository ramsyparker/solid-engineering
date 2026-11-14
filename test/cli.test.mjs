import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, mkdirSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const cli = fileURLToPath(new URL('../bin/cli.mjs', import.meta.url));
function sandbox(t) {
  const dir = mkdtempSync(join(tmpdir(), 'solid-engineering-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function run(cwd, ...args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}
for (const [agent, folder] of [['codex', '.agents'], ['claude', '.claude'], ['cursor', '.cursor']]) {
  test(`installs complete skill for ${agent}`, t => {
    const cwd = sandbox(t);
    const result = run(cwd, 'install', '--agent', agent);
    assert.equal(result.status, 0, result.stderr);
    const dest = join(cwd, folder, 'skills', 'solid-engineering');
    for (const file of ['SKILL.md', 'references/engineering-standard.md', 'agents/openai.yaml']) {
      assert.equal(readFileSync(join(dest, file), 'utf8'), readFileSync(new URL(`../skills/solid-engineering/${file}`, import.meta.url), 'utf8'));
    }
  });
}
test('defaults to project Codex and preserves existing installation', t => {
  const cwd = sandbox(t);
  assert.equal(run(cwd, 'install').status, 0);
  const file = join(cwd, '.agents/skills/solid-engineering/SKILL.md');
  writeFileSync(file, 'user customization');
  const result = run(cwd, 'install');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /already exists/);
  assert.equal(readFileSync(file, 'utf8'), 'user customization');
});
test('dry run and help do not write files', t => {
  const cwd = sandbox(t);
  for (const args of [[], ['--help'], ['install', '--dry-run'], ['install', '--global', '--dry-run']]) {
    const result = run(cwd, ...args);
    assert.equal(result.status, 0, result.stderr);
  }
  assert.deepEqual(readdirSync(cwd), []);
});
test('custom skills directory supports spaces', t => {
  const cwd = sandbox(t);
  const result = run(cwd, 'install', '--dir', 'my skills');
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(join(cwd, 'my skills/solid-engineering/SKILL.md')));
});
test('rejects invalid arguments without writes', t => {
  const cwd = sandbox(t);
  for (const args of [['remove'], ['install', '--agent', '../../oops'], ['install', '--agent'], ['install', '--wat'], ['install', '--global', '--dir', 'x'], ['install', '--dir', '--global']]) {
    const result = run(cwd, ...args);
    assert.equal(result.status, 1, JSON.stringify(args));
  }
  assert.deepEqual(readdirSync(cwd), []);
});
test('refuses an existing empty destination', t => {
  const cwd = sandbox(t);
  mkdirSync(join(cwd, '.agents/skills/solid-engineering'), { recursive: true });
  assert.equal(run(cwd, 'install').status, 1);
  assert.deepEqual(readdirSync(join(cwd, '.agents/skills/solid-engineering')), []);
});
