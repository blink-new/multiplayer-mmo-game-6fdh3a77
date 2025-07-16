export interface CharacterAppearance {
  race: 'human' | 'elf' | 'dwarf' | 'orc' | 'undead' | 'troll';
  gender: 'male' | 'female';
  hairstyle: number; // 1-10
  eyeColor: string;
  hairColor: string;
  skinColor: string;
  mouthType: number; // 1-8
  beardStyle: number; // 0-8 (0 = no beard)
  beardColor: string;
  bodyType: number; // 1-5 (body build)
  faceType: number; // 1-6 (face shape)
}

export interface Player {
  id: string;
  userId: string;
  characterName: string;
  characterClass: 'healer' | 'tank' | 'dps';
  level: number;
  health: number;
  mana: number;
  maxHealth: number;
  maxMana: number;
  experience: number;
  faction: 'alliance' | 'horde' | 'neutral';
  guildId?: string;
  positionX: number;
  positionY: number;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  appearance: CharacterAppearance;
}

export interface Guild {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  faction: 'alliance' | 'horde' | 'neutral';
  memberCount: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  characterClass: 'healer' | 'tank' | 'dps';
  skillType: 'active' | 'passive';
  damage: number;
  healing: number;
  manaCost: number;
  cooldown: number;
  levelRequired: number;
  icon?: string;
}

export interface PlayerSkill {
  id: string;
  playerId: string;
  skillId: string;
  skillLevel: number;
  isEquipped: boolean;
  hotbarSlot?: number;
  skill: Skill;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  message: string;
  channel: 'global' | 'guild' | 'faction' | 'whisper';
  targetPlayerId?: string;
  playerName: string;
  createdAt: string;
}

export interface PvPBattle {
  id: string;
  attackerId: string;
  defenderId: string;
  winnerId?: string;
  damageDealt: number;
  battleDuration: number;
  battleType: 'duel' | 'guild_war' | 'faction_war';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface MapPosition {
  x: number;
  y: number;
  z: number;
}

export interface Dungeon {
  id: string;
  name: string;
  level: number;
  position: MapPosition;
  floors: DungeonFloor[];
  isActive: boolean;
  playersInside: string[];
  createdAt: string;
}

export interface DungeonFloor {
  id: string;
  dungeonId: string;
  floorNumber: number;
  enemies: Enemy[];
  boss?: Boss;
  isCleared: boolean;
  requiredLevel: number;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  damage: number;
  position: MapPosition;
  isAlive: boolean;
  lootTable: Item[];
}

export interface Boss {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  damage: number;
  position: MapPosition;
  isAlive: boolean;
  chest: DungeonChest;
  abilities: BossAbility[];
}

export interface BossAbility {
  id: string;
  name: string;
  damage: number;
  cooldown: number;
  description: string;
}

export interface DungeonChest {
  id: string;
  dungeonLevel: number;
  items: Item[];
  isOpened: boolean;
  openedBy?: string;
  openedAt?: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  stats: ItemStats;
  description: string;
  icon?: string;
}

export interface ItemStats {
  damage?: number;
  defense?: number;
  health?: number;
  mana?: number;
  criticalChance?: number;
  criticalDamage?: number;
  healingPower?: number;
}

export interface PlayerInventory {
  id: string;
  playerId: string;
  items: InventoryItem[];
  maxSlots: number;
  gold: number;
}

export interface InventoryItem {
  id: string;
  itemId: string;
  quantity: number;
  item: Item;
}

export interface GameMap {
  id: string;
  name: string;
  size: { width: number; height: number; depth: number };
  dungeons: Dungeon[];
  safeZones: SafeZone[];
  terrain: TerrainData;
}

export interface SafeZone {
  id: string;
  name: string;
  position: MapPosition;
  radius: number;
  type: 'town' | 'outpost' | 'sanctuary';
}

export interface TerrainData {
  heightMap: number[][];
  biomes: BiomeData[];
  landmarks: Landmark[];
}

export interface BiomeData {
  id: string;
  name: string;
  type: 'forest' | 'mountain' | 'desert' | 'swamp' | 'plains' | 'tundra';
  area: { x: number; y: number; width: number; height: number };
  color: string;
}

export interface Landmark {
  id: string;
  name: string;
  type: 'mountain' | 'lake' | 'forest' | 'ruins' | 'tower';
  position: MapPosition;
  size: number;
}