export interface PlayerData {
  name: string;
  class: string;
  location: {
    x: number;
    y: number;
    z: number;
  };
  growth: number;
  health: number;
  stamina: number;
  hunger: number;
  thirst: number;
}