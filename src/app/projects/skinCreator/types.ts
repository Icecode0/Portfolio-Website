// Types for the skin creator
export type SkinSlot = {
  id: number;
  name: string;
  preview: string | null;
  isActive: boolean;
  isLocked: boolean;
  isSelected: boolean;
  skin: string | null;
  timer: number | null;
};

export type ColorState = {
  maleColor: string;
  highColor: string;
  midColor: string;
  mid2Color: string;
  lowColor: string;
  bottomColor: string;
  eyeColor: string;
};

type GlitchEffect = {
  name: string;
  value: string;
};

export type GlitchEffectGroup = { [interior: string]: GlitchEffect[] };

export interface DinosaurData {
  model: string;
  normalMap: string;
  patterns: Record<string, string>;
  scale: number;
  position: [number, number, number];
  name: string;
}
