const { spawn } = require('node:child_process');
const path = require('node:path');

// Keep each imported service intact; share the root-installed dependencies.
const services = [
  ['product-service/product-service.js', 3000],
  ['order-service/order-service.js', 3001],
  ['gateway/gateway.js', 5000],
];
const children = [];
let stopping = false;

function stop(exitCode) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) child.kill('SIGTERM');
  const timer = setTimeout(() => {
    for (const child of children) child.kill('SIGKILL');
  }, 5000);
  timer.unref();
}

for (const [file, port] of services) {
  const child = spawn(process.execPath, [path.join(__dirname, file)], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(port),
      HOST: port === 5000 ? '0.0.0.0' : '127.0.0.1',
    },
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(`Unable to start ${file}: ${error.message}`);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`${file} stopped unexpectedly (${signal || code}).`);
      stop(1);
    }
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
