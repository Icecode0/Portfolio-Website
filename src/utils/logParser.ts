import Client from 'ssh2-sftp-client';

interface ParsedLog {
  timestamp: string;
  senderName: string;
  senderId: string;
  message: string;
  channel: string;
}

// Add this type for the callback
type LogCallback = (log: ParsedLog) => void;

const SFTP_CONFIG = {
  host: process.env.SFTP_HOST,
  port: parseInt(process.env.SFTP_PORT || '2022'),
  password: process.env.SFTP_PASSWORD,
};

const SERVER_USERS = {
  'DM Beach 1': process.env.SFTP_BEACH1_USER,
  'DM Beach 2': process.env.SFTP_BEACH2_USER,
  'DM Field 1': process.env.SFTP_FIELD1_USER,
  'DM Field 2': process.env.SFTP_FIELD2_USER,
  'Primal Heaven': process.env.SFTP_PRIMAL_USER,
};

// Add this helper function at the top of the file
function getRestartGroup(filename: string): string {
  // Handle current day's log file
  if (filename === 'TheIsle.log') return 'current';

  // Extract date and time from backup filenames
  // Format: TheIsle-backup-2025.03.22-04.00.03.log
  const match = filename.match(/TheIsle-backup-(\d{4}\.\d{2}\.\d{2})-(\d{2})\.(\d{2})\.\d{2}\.log/);
  if (!match) return 'unknown';

  const [_, date, hour] = match;
  const hourNum = parseInt(hour);

  // If the log is from 23:00 or later, it belongs to that day's group
  // If it's before 23:00, it belongs to the previous day's group
  if (hourNum >= 23) {
    return date;
  } else {
    // Calculate previous day for logs before 23:00
    const logDate = new Date(date.replace(/\./g, '-'));
    logDate.setDate(logDate.getDate() - 1);
    return logDate.toISOString().split('T')[0].replace(/-/g, '.');
  }
}

// Modify the fetchServerLogs function to accept a callback
export async function fetchServerLogs(
  server: string,
  onLogFound?: LogCallback,
  logFilesToSearch?: string[]
): Promise<ParsedLog[]> {

  const sftp = new Client();
  const logs: ParsedLog[] = [];
  const seenMessages = new Set();

  try {
    await sftp.connect({
      ...SFTP_CONFIG,
      username: SERVER_USERS[server],
    });

    const logFiles = await sftp.list('/TheIsle/Saved/Logs');
    
    // Group files by restart period
    const fileGroups = new Map<string, any[]>();

    // Update the filter to explicitly check for .log extension
    logFiles
      .filter(file => 
        file.name.endsWith('.log') && 
        file.name.startsWith('TheIsle') && 
        !file.name.includes('Shipping')
      )
      .forEach(file => {
        const group = getRestartGroup(file.name);
        if (!fileGroups.has(group)) {
          fileGroups.set(group, []);
        }
        fileGroups.get(group)?.push(file);
      });



    // Get the latest file from each group
    const sortedLogFiles = Array.from(fileGroups.values())
      .map(group => 
        group.sort((a, b) => b.modifyTime - a.modifyTime)[0]
      )
      .sort((a, b) => b.modifyTime - a.modifyTime);


    // Process each log file
    for (const file of sortedLogFiles) {
      const content = await sftp.get(`/TheIsle/Saved/Logs/${file.name}`);
      const lines = content.toString().split('\n');

      let matchCount = 0;
      for (const line of lines) {
        const parsed = parseChatLine(line);
        if (parsed) {
          matchCount++;
          const messageKey = `${parsed.timestamp}-${parsed.senderId}-${parsed.message}`;
          if (!seenMessages.has(messageKey)) {
            logs.push(parsed);
            seenMessages.add(messageKey);
            // Stream the log entry if callback is provided
            if (onLogFound) {
              onLogFound(parsed);
            }
          }
        }
      }
    }

    const sortedLogs = logs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return sortedLogs;

  } catch (error) {
    console.error('[ERROR] Error in fetchServerLogs:', error);
    throw error;
  } finally {
    console.log('[DEBUG] Closing SFTP connection');
    await sftp.end();
  }
}

function parseChatLine(line: string): ParsedLog | null {
  const chatPattern = /LogTheIsleChatData: Verbose: \[(.+?)\] \[(Global|Spatial)\] \[GROUP-\d+\] (.+?) \[(\d+)\]: (.+)/i;
  const match = line.match(chatPattern);

  if (match) {
    const [_, timestamp, channel, senderName, senderId, message] = match;
    return {
      timestamp,
      channel,
      senderName,
      senderId,
      message
    };
  }

  return null;
}