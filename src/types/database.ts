export type UserData = {
  discordId: string;
  steamId?: string;
  primalPoints: number;
  unlockedSkins: string;
  activeSkin?: string;
  migrating: number;
  migration?: bigint | null;
  onlineTime: bigint;
  startx?: bigint | null;
  starty?: bigint | null;
  migDeaths?: bigint | null;
  questDeaths?: bigint | null;
  questDino?: string | null;
  hunger?: Date | null;
  thirst?: Date | null;
  grown?: Date | null;

};

export type SkinData = {
  id: number;
  userId: string;
  skinName: string;
  skinJson: string;
};

export type ParsedSkinJson = {
  b: string;  // bottom color
  e: string;  // eye color
  f: string;  // female color
  m: string;  // male color
  u: string;  // upper color
  d1: string; // mid color
  md: string; // mid2 color
  pi: string | number;
  sv: string | number;
};

export interface DbUser {
  discordId: string;
  primalPoints: number;
  unlockedSkins: string;
  activeSkin: string;
  custom1: string;
  custom1timer: Date | null;
  custom2: string;
  custom2timer: Date | null;
  custom3: string;
  custom3timer: Date | null;
  custom4: string;
  custom4timer: Date | null;
  custom5: string;
  custom5timer: Date | null;
  custom6: string;
  custom6timer: Date | null;
  custom7: string;
  custom7timer: Date | null;
  custom8: string;
  custom8timer: Date | null;
}

export interface DbSkin {
  id: number;
  userid: string;
  skinName: string;
  skinJson: string;
}

export interface SkinData {
  colors: {
    maleColor: string;
    highColor: string;
    midColor: string;
    mid2Color: string;
    lowColor: string;
    bottomColor: string;
    eyeColor: string;
  };
  pattern: number;
}

export interface UserData {
  discordId: string;
  primalPoints: number;
  activeSkin: string | null;
  custom1: string | null;
  custom1timer: Date | null;
  custom2: string | null;
  custom2timer: Date | null;
  custom3: string | null;
  custom3timer: Date | null;
  custom4: string | null;
  custom4timer: Date | null;
  custom5: string | null;
  custom5timer: Date | null;
  custom6: string | null;
  custom6timer: Date | null;
  custom7: string | null;
  custom7timer: Date | null;
  custom8: string | null;
  custom8timer: Date | null;
  unlockedSkins: string | null; // JSON string
}

export interface SkinSlot {
  id: number;
  isActive: boolean;
  isSelected: boolean;
  isLocked: boolean;
  skin: string | null;
  timer: Date | null;
}


export interface Migration {
  id: bigint;
  userId: bigint;
  targetX: bigint;
  targetY: bigint;
  startTime: Date;
  endTime?: Date | null;
  status: 'active' | 'completed' | 'failed';
}