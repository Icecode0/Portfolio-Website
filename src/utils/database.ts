import { UserData, SkinData } from '@/types/database';
import mysql from 'mysql2/promise';

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

export async function getUserData(discordId: string): Promise<UserData | null> {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE discordId = ?',
    [discordId]
  );
  return rows[0] || null;
}

export async function getUserSkins(discordId: string): Promise<SkinData[]> {
  const [rows] = await pool.execute(
    'SELECT * FROM skins WHERE userid = ?',
    [discordId]
  );
  return rows as SkinData[];
}

export async function saveSkin(
  data: Omit<SkinData, 'id'>,
  discordId: string,
  slotNumber: number
): Promise<number> {
  // Start a transaction
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Save the skin
    const [result] = await connection.execute(
      'INSERT INTO skins (userid, skinName, skinJson) VALUES (?, ?, ?)',
      [data.userId, data.skinName, data.skinJson]
    );
    const skinId = (result as any).insertId;

    // 2. Update the user's slot with the new skin and timer
    const timer = new Date();
    timer.setDate(timer.getDate() + 30); // Add 30 days

    await connection.execute(
      `UPDATE users 
       SET custom${slotNumber} = ?, 
       custom${slotNumber}timer = ?
       WHERE discordId = ?`,
      [skinId, timer, discordId]
    );

    await connection.commit();
    return skinId;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateSkin(skinId: string | number, data: { 
  skinName: string;
  skinJson: string;
}): Promise<void> {
  // Remove 'C' prefix if present
  const cleanSkinId = skinId.toString().replace('C', '');
  
  await pool.execute(
    'UPDATE skins SET skinName = ?, skinJson = ? WHERE id = ?',
    [data.skinName, data.skinJson, cleanSkinId]
  );
}

export async function updateUserPoints(discordId: string, points: number): Promise<void> {
  await pool.execute(
    'UPDATE users SET primalPoints = ? WHERE discordId = ?',
    [points, discordId]
  );
}

export async function getUserSlotsData(discordId: string): Promise<UserData | null> {
  const [rows] = await pool.execute(
    `SELECT discordId, activeSkin, 
     custom1, custom1timer, custom2, custom2timer,
     custom3, custom3timer, custom4, custom4timer,
     custom5, custom5timer, custom6, custom6timer,
     custom7, custom7timer, custom8, custom8timer,
     unlockedSkins
     FROM users WHERE discordId = ?`,
    [discordId]
  );
  return rows[0] || null;
}

export async function updateSkinSlot(
  discordId: string, 
  slotNumber: number, 
  skin: string | null,
  timer: Date | null
): Promise<void> {
  await pool.execute(
    `UPDATE users 
     SET custom${slotNumber} = ?, 
     custom${slotNumber}timer = ?
     WHERE discordId = ?`,
    [skin, timer, discordId]
  );
}

export async function updateSkinName(
  skinId: string | number,
  skinName: string,
): Promise<void> {
  // Remove 'C' prefix if present and convert to number
  const cleanSkinId = Number(skinId.toString().replace('C', ''));
  
  if (isNaN(cleanSkinId)) {
    throw new Error('Invalid skin ID');
  }

  await pool.execute(
    'UPDATE skins SET skinName = ? WHERE id = ?',
    [skinName || null, cleanSkinId]
  );
}

export async function deleteSkin(
  skinId: string,
  userId: string,
  slotNumber: number
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Delete the skin from skins table
    await connection.execute(
      'DELETE FROM skins WHERE id = ? AND userId = ?',
      [skinId, userId]
    );

    // Clear the slot in users table
    await connection.execute(
      `UPDATE users 
       SET custom${slotNumber} = NULL, 
           custom${slotNumber}timer = NULL
       WHERE discordId = ?`,
      [userId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


export async function getUnlockedSkins(skinNames: string[]): Promise<any[]> {
  if (!skinNames || skinNames.length === 0) {
    return [];
  }
  
  // Create placeholders for the IN clause
  const placeholders = skinNames.map(() => '?').join(',');
  
  const [rows] = await pool.execute(
    `SELECT id, skinName, skinJson, displayName, rarity 
     FROM defskins 
     WHERE skinName IN (${placeholders})
     AND active = 1`,
    [...skinNames]
  );
  
  return rows as any[];
}