// Runner script that starts index.js, executes test-api.js, and exits
const { fork } = require('child_process');
const path = require('path');

const server = fork(path.join(__dirname, 'index.js'), [], { silent: false });

setTimeout(async () => {
  try {
    const { runTests } = require('./test-api');
    await runTests();
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}, 2500);
