import { PlayerData } from './playerParser';
import Client from 'ssh2-sftp-client';
import fs from 'fs';

const SFTP_CONFIG = {
  host: process.env.SFTP_HOST,
  port: Number(process.env.SFTP_PORT),
  username: process.env.SFTP_PRIMALBOT_USER,
  password: process.env.SFTP_PASSWORD
};

interface Cache {
  players: PlayerData[];
  lastUpdate: number;
}

interface RawPlayerData {
  PlayerID: string;
  Class: string;
  Location: {
    X: number;
    Y: number;
    Z: number;
  };
  Growth: number;
  Health: number;
  Stamina: number;
  Hunger: number;
  Thirst: number;
  OnlineTime: number;
  AliveTime: number;
}

class PlayerCache {
  private static instance: PlayerCache;
  private cache: Cache = {
    players: [],
    lastUpdate: 0
  };
  private updateInterval: NodeJS.Timeout | null = null;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cacheFile = 'cacheFile.json'; // Specify your cache file path here

  private constructor() {
    this.updateCache();
    this.updateInterval = setInterval(() => {
      this.updateCache();
    }, this.CACHE_DURATION);
  }

  public static getInstance(): PlayerCache {
    if (!PlayerCache.instance) {
      PlayerCache.instance = new PlayerCache();
    }
    return PlayerCache.instance;
  }

  private async updateCache(): Promise<void> {
    const sftp = new Client();

    try {
      await sftp.connect(SFTP_CONFIG);

      // Read and log the raw file contents
      const buffer = await sftp.get('/playerdata.json');
      const fileContents = buffer.toString();

      // Parse and handle the new structure with "current"
      let rawPlayers: any[] = [];
      const parsed = JSON.parse(fileContents);
      if (Array.isArray(parsed)) {
        rawPlayers = parsed;
      } else if (parsed && Array.isArray(parsed.current)) {
        rawPlayers = parsed.current;
      } else if (parsed && Array.isArray(parsed.players)) {
        rawPlayers = parsed.players;
      } else {
        throw new Error('Unexpected playerdata.json format');
      }

      // Transform and log the final data
      const players = rawPlayers.map(p => ({
        name: p.PlayerID,
        class: p.Class,
        location: {
          x: p.X ?? p.Location?.X,
          y: p.Y ?? p.Location?.Y,
          z: p.Z ?? p.Location?.Z
        },
        growth: p.Growth,
        health: p.Health ?? 0,
        stamina: p.Stamina ?? 0,
        hunger: p.Hunger ?? 0,
        thirst: p.Thirst ?? 0
      }));

      this.cache = {
        players,
        lastUpdate: Date.now(),
        // Optionally add current/previous if you want to keep them
      };
      fs.writeFileSync(this.cacheFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        current: players,
        previous: [] // or keep previous if you want
      }));

    } catch (error) {
      console.error('[Cache] Failed to update player cache:', error);
      if (error instanceof Error) {
        console.error('[Cache] Error stack:', error.stack);
      }
    } finally {
      sftp.end();
    }
  }

  public getPlayers(): PlayerData[] {
    const cacheString = fs.readFileSync(this.cacheFile, 'utf8');
    const data = JSON.parse(cacheString);
    // Support all possible formats
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.players)) return data.players;
    if (data && Array.isArray(data.current)) return data.current;
    return [];
  }

  public getPlayer(id: string): PlayerData | undefined {
    return this.cache.players.find(p => p.name === id);
  }

  public getLastUpdate(): number {
    return this.cache.lastUpdate;
  }

  public isStale(): boolean {
    return Date.now() - this.cache.lastUpdate > this.CACHE_DURATION;
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const playerCache = PlayerCache.getInstance();