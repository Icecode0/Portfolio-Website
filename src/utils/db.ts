import mysql from 'mysql2/promise';
import { DbUser, DbSkin } from '@/types/database';

export const pool = mysql.createPool({
  host: 'OMITTED',
  port: 3306,
  user: 'OMITTED',
  password: 'OMITTED',
  database: 'OMITTED',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export async function getUserData(discordId: string): Promise<DbUser | null> {
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE discordId = ?',
      [discordId]
    );

    if (!rows.length) return null;
    
    // Process the datetime fields to ensure they're in the correct format
    const user = rows[0] as DbUser;
    
    // Ensure timer fields are properly formatted
    for (let i = 1; i <= 8; i++) {
      const timerField = `custom${i}timer` as keyof DbUser;
      if (user[timerField]) {
        // If the field exists and has a value, ensure it's a string
        const timerValue = user[timerField];
        if (timerValue instanceof Date) {
          user[timerField] = timerValue.toISOString() as any;
        }
      }
    }
    
    return user;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getUserSkins(discordId: string): Promise<DbSkin[]> {
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM skins WHERE userid = ?',
      [discordId]
    );

    return rows as DbSkin[];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function saveSkin(skin: Omit<DbSkin, 'id'>): Promise<number> {
  try {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'INSERT INTO skins (userid, skinName, skinJson) VALUES (?, ?, ?)',
      [skin.userid, skin.skinName, skin.skinJson]
    );

    return result.insertId;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getUserMigration(discordId: string) {
  const connection = await pool.getConnection();
  
  try {
    // Get user data including steamId, using CAST to handle the bigint
    const [users] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT CAST(steamId AS CHAR) as steamId, migrating, migration FROM users WHERE discordId = ?',
      [discordId]
    );

    if (!users.length) {
      return null;
    }

    const user = users[0];


    // If user is migrating and has a migration ID, get migration data
    if (user.migrating === 1 && user.migration) {
      const [migrations] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT migration, CAST(migrateX AS CHAR) as migrateX, CAST(migrateY AS CHAR) as migrateY FROM migrations WHERE migration = ?',
        [user.migration]
      );
      
      if (migrations.length) {
        return {
          migrating: true,
          migration: {
            ...migrations[0],
            steamId: user.steamId
          }
        };
      }
    }

    return {
      migrating: user.migrating === 1,
      migration: null
    };

  } finally {
    connection.release();
  }
}