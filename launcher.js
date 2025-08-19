const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const next = require('next');
const http = require('http');

// Log directory for launcher logs
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create log file streams
const websiteLogStream = fs.createWriteStream(path.join(logDir, 'website.log'), { flags: 'a' });
const logGrabberLogStream = fs.createWriteStream(path.join(logDir, 'logGrabber.log'), { flags: 'a' });

// Helper function to log messages with timestamps
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  
  // Also write to website log
  websiteLogStream.write(`[${timestamp}] ${message}\n`);
}

// Start the logGrabber script as a child process
function startLogGrabber() {
  log('Starting Log Grabber...');
  
  const process = spawn('node', ['logGrabber/logGrabber.js'], {
    cwd: __dirname,
    shell: true
  });
  
  process.stdout.on('data', (data) => {
    const output = data.toString();
    logGrabberLogStream.write(`[${new Date().toISOString()}] [STDOUT] ${output}`);
    console.log(`[Log Grabber] ${output.trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    const output = data.toString();
    logGrabberLogStream.write(`[${new Date().toISOString()}] [STDERR] ${output}`);
    console.error(`[Log Grabber ERROR] ${output.trim()}`);
  });
  
  process.on('close', (code) => {
    log(`Log Grabber process exited with code ${code}`);
    
    // Restart the process if it crashes
    if (code !== 0) {
      log('Restarting Log Grabber...');
      setTimeout(startLogGrabber, 5000); // Wait 5 seconds before restarting
    }
  });
  
  return process;
}

// Start the Next.js server
async function startNextServer() {
  try {
    const port = process.env.PORT || 25029;
    const app = next({ dev: false });
    const handle = app.getRequestHandler();
    
    log('Preparing Next.js app...');
    await app.prepare();
    
    log(`Starting Next.js server on port ${port}...`);
    const server = http.createServer((req, res) => {
      handle(req, res);
    }).listen(port, () => {
      log(`Next.js server ready on http://localhost:${port}`);
    });
    
    return server;
  } catch (error) {
    log(`Error starting Next.js server: ${error.message}`);
    log('Restarting Next.js server in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return startNextServer();
  }
}

// Main function to start all processes
async function main() {
  log('Launcher started');
  
  // Start the Next.js server
  const nextServer = await startNextServer();
  
  // Start the logGrabber script
  const logGrabberProcess = startLogGrabber();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('Shutting down all processes...');
    
    // Close the Next.js server
    nextServer.close(() => {
      log('Next.js server closed');
    });
    
    // Kill the logGrabber process
    logGrabberProcess.kill();
    
    // Close log streams
    websiteLogStream.end();
    logGrabberLogStream.end();
    
    // Exit after a short delay to allow processes to clean up
    setTimeout(() => {
      log('Shutdown complete');
      process.exit(0);
    }, 1000);
  });
}

// Start everything
main().catch(error => {
  console.error('Fatal error in launcher:', error);
  process.exit(1);
});