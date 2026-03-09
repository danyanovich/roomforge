import http from 'node:http';
import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const installMarkers = [
  path.join(projectRoot, 'node_modules', 'vite'),
  path.join(projectRoot, 'node_modules', 'react'),
  path.join(projectRoot, 'node_modules', 'three'),
];
const startupTimeoutMs = Number(process.env.ROOMFORGE_START_TIMEOUT_MS ?? 30000);
const shouldOpenBrowser = process.env.ROOMFORGE_NO_OPEN !== '1';

let installProcess = null;
let viteProcess = null;
let shuttingDown = false;

function log(message) {
  process.stdout.write(`[roomforge:start] ${message}\n`);
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, '');
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function hasInstalledDependencies() {
  const checks = await Promise.all(installMarkers.map((marker) => pathExists(marker)));
  return checks.every(Boolean);
}

function spawnNpm(args, options = {}) {
  const env = {
    ...process.env,
    ...options.env,
  };
  if (!('NO_COLOR' in env)) {
    env.FORCE_COLOR = process.stdout.isTTY ? '1' : '0';
  }

  return spawn(npmCommand, args, {
    cwd: projectRoot,
    stdio: options.stdio ?? ['inherit', 'pipe', 'pipe'],
    shell: false,
    env,
  });
}

function waitForExit(child, label) {
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} exited with code ${code ?? 'null'}${signal ? ` (signal: ${signal})` : ''}`));
    });
  });
}

function pollUrl(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const tryRequest = () => {
      const request = http.get(url, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) {
          resolve();
          return;
        }
        scheduleRetry();
      });

      request.on('error', scheduleRetry);
      request.setTimeout(1500, () => {
        request.destroy();
        scheduleRetry();
      });
    };

    const scheduleRetry = () => {
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }
      setTimeout(tryRequest, 250);
    };

    tryRequest();
  });
}

function openBrowser(url) {
  if (!shouldOpenBrowser) {
    log(`Browser auto-open skipped by ROOMFORGE_NO_OPEN=1. Open manually: ${url}`);
    return;
  }

  let command = null;
  let args = [];
  if (process.platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (process.platform === 'win32') {
    command = 'cmd.exe';
    args = ['/c', 'start', '', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  const opener = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'ignore',
    detached: true,
  });

  opener.on('error', () => {
    log(`Unable to auto-open a browser. Open manually: ${url}`);
  });

  opener.unref();
}

function registerShutdown() {
  const shutdown = (signal) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    log(`Stopping RoomForge (${signal})...`);

    if (viteProcess && !viteProcess.killed) {
      viteProcess.kill('SIGINT');
    }
    if (installProcess && !installProcess.killed) {
      installProcess.kill('SIGINT');
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

async function ensureDependencies() {
  const installed = await hasInstalledDependencies();
  if (installed) {
    return;
  }

  log('Dependencies not found. Running npm install...');
  installProcess = spawnNpm(['install'], { stdio: 'inherit' });
  await waitForExit(installProcess, 'npm install');
  installProcess = null;
}

async function startVite() {
  const localUrls = new Set();
  let openedUrl = null;

  viteProcess = spawnNpm(['run', 'dev', '--', '--host', '127.0.0.1', '--open', 'false']);
  viteProcess.stderr.on('data', (chunk) => process.stderr.write(chunk));
  viteProcess.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
    const text = stripAnsi(chunk.toString());
    const matches = text.match(/https?:\/\/[^\s]+/g) ?? [];
    matches.forEach((match) => localUrls.add(match.endsWith('/') ? match : `${match}/`));
  });

  viteProcess.once('exit', (code) => {
    if (shuttingDown) {
      process.exit(code ?? 0);
      return;
    }
    process.exit(code ?? 1);
  });

  const waitForReady = async () => {
    const deadline = Date.now() + startupTimeoutMs;
    while (Date.now() < deadline) {
      if (!localUrls.size) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        continue;
      }
      for (const url of localUrls) {
        try {
          await pollUrl(url, 1200);
          if (!openedUrl) {
            openedUrl = url;
            log(`RoomForge is ready at ${url}`);
            openBrowser(url);
          }
          return;
        } catch {
          continue;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error('Timed out waiting for the Vite dev server to become reachable.');
  };

  await waitForReady();
}

async function main() {
  registerShutdown();
  await ensureDependencies();
  await startVite();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[roomforge:start] ${message}\n`);
  if (viteProcess && !viteProcess.killed) {
    viteProcess.kill('SIGINT');
  }
  if (installProcess && !installProcess.killed) {
    installProcess.kill('SIGINT');
  }
  process.exit(1);
});
