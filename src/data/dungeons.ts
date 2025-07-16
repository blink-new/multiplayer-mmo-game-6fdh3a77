import { Dungeon, GameMap, Item, Boss, Enemy, BiomeData, Landmark, SafeZone } from '../types/game';

// Generate random items based on dungeon level
export const generateRandomItem = (dungeonLevel: number): Item => {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
  const types = ['weapon', 'armor', 'consumable', 'material', 'accessory'] as const;
  
  // Higher level dungeons have better rarity chances
  const rarityWeights = dungeonLevel <= 10 ? [50, 30, 15, 4, 1] :
                       dungeonLevel <= 30 ? [30, 35, 25, 8, 2] :
                       [20, 25, 30, 20, 5];
  
  const randomRarity = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < rarityWeights.length; i++) {
      cumulative += rarityWeights[i];
      if (random <= cumulative) return rarities[i];
    }
    return rarities[0];
  };

  const rarity = randomRarity();
  const type = types[Math.floor(Math.random() * types.length)];
  const level = dungeonLevel + Math.floor(Math.random() * 3) - 1; // ±1 level variance
  
  const rarityMultiplier = {
    common: 1,
    uncommon: 1.5,
    rare: 2,
    epic: 3,
    legendary: 5
  }[rarity];

  const baseStats = {
    damage: type === 'weapon' ? Math.floor((level * 10 + Math.random() * 20) * rarityMultiplier) : undefined,
    defense: type === 'armor' ? Math.floor((level * 8 + Math.random() * 15) * rarityMultiplier) : undefined,
    health: Math.random() > 0.7 ? Math.floor((level * 15 + Math.random() * 30) * rarityMultiplier) : undefined,
    mana: Math.random() > 0.8 ? Math.floor((level * 12 + Math.random() * 25) * rarityMultiplier) : undefined,
    criticalChance: Math.random() > 0.9 ? Math.floor(Math.random() * 15 * rarityMultiplier) : undefined,
    criticalDamage: Math.random() > 0.9 ? Math.floor(Math.random() * 50 * rarityMultiplier) : undefined,
    healingPower: type === 'weapon' && Math.random() > 0.95 ? Math.floor((level * 5 + Math.random() * 10) * rarityMultiplier) : undefined,
  };

  const itemNames = {
    weapon: ['Sword', 'Staff', 'Bow', 'Dagger', 'Mace', 'Axe', 'Wand', 'Spear'],
    armor: ['Helmet', 'Chestplate', 'Leggings', 'Boots', 'Gloves', 'Shield'],
    consumable: ['Health Potion', 'Mana Potion', 'Elixir', 'Scroll', 'Food'],
    material: ['Ore', 'Gem', 'Crystal', 'Essence', 'Fragment'],
    accessory: ['Ring', 'Amulet', 'Bracelet', 'Earring', 'Charm']
  };

  const prefixes = {
    common: ['Simple', 'Basic', 'Plain'],
    uncommon: ['Fine', 'Quality', 'Sturdy'],
    rare: ['Superior', 'Excellent', 'Masterwork'],
    epic: ['Legendary', 'Mythical', 'Ancient'],
    legendary: ['Divine', 'Celestial', 'Eternal']
  };

  const baseName = itemNames[type][Math.floor(Math.random() * itemNames[type].length)];
  const prefix = prefixes[rarity][Math.floor(Math.random() * prefixes[rarity].length)];
  
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${prefix} ${baseName}`,
    type,
    rarity,
    level,
    stats: baseStats,
    description: `A ${rarity} ${type} found in a level ${dungeonLevel} dungeon.`
  };
};

// Generate boss for dungeon with scaling difficulty and abilities
const generateBoss = (dungeonLevel: number, dungeonId: string): Boss => {
  // Boss names based on dungeon level ranges
  const getBossPool = (level: number) => {
    if (level <= 50) {
      return [
        'Goblin King', 'Skeleton Lord', 'Alpha Wolf', 'Spider Matriarch', 'Bandit Chief',
        'Orc Warlord', 'Zombie Master', 'Rat King', 'Slime Overlord', 'Kobold Shaman'
      ];
    } else if (level <= 100) {
      return [
        'Goblin Emperor', 'Bone Sovereign', 'Dire Alpha', 'Arachnid Queen', 'Shadow Captain',
        'Orc Chieftain', 'Death Lord', 'Void Stalker', 'Flame Overlord', 'Stone Titan'
      ];
    } else if (level <= 200) {
      return [
        'Orc Overlord', 'Death Emperor', 'Frost Sovereign', 'Lightning Lord', 'Shadow Master',
        'Troll King', 'Dragon Lich', 'Void Emperor', 'Inferno King', 'Crystal Overlord'
      ];
    } else if (level <= 300) {
      return [
        'Shadow Emperor', 'Arch Lich', 'Storm Sovereign', 'Infernal Overlord', 'Void Sovereign',
        'Ancient Titan', 'Nightmare Emperor', 'Chaos Overlord', 'Elemental God', 'Soul Emperor'
      ];
    } else if (level <= 400) {
      return [
        'Demon Emperor', 'Lich God', 'Titan Sovereign', 'Void God', 'Chaos Emperor',
        'Dragon God', 'Nightmare Sovereign', 'World Destroyer', 'Elemental Emperor', 'Death God'
      ];
    } else {
      return [
        'Cosmic Emperor', 'Reality God', 'Time Sovereign', 'Dimension Emperor', 'Universe God',
        'Eternal Sovereign', 'Infinite Emperor', 'Absolute God', 'Divine Emperor', 'Omnipotent Sovereign'
      ];
    }
  };
  
  const bossPool = getBossPool(dungeonLevel);
  const name = bossPool[Math.floor(Math.random() * bossPool.length)];
  
  // Boss is significantly stronger than dungeon level
  const level = dungeonLevel + 5;
  
  // Scale boss health dramatically with level
  const baseHealth = level * 1000;
  const healthVariation = Math.floor(Math.random() * (level * 200));
  const health = baseHealth + healthVariation;
  
  // Boss damage scales with level
  const baseDamage = level * 50;
  const damageVariation = Math.floor(Math.random() * (level * 10));
  const damage = baseDamage + damageVariation;
  
  // Generate boss abilities based on level
  const generateAbilities = (bossLevel: number) => {
    const abilities = [];
    
    // Basic attack ability
    abilities.push({
      id: `ability_basic_${Date.now()}`,
      name: 'Devastating Strike',
      damage: bossLevel * 60,
      cooldown: 3000,
      description: 'A powerful melee attack that deals massive damage'
    });
    
    // Area attack
    abilities.push({
      id: `ability_area_${Date.now()}`,
      name: 'Area Devastation',
      damage: bossLevel * 40,
      cooldown: 6000,
      description: 'Damages all nearby enemies in a large radius'
    });
    
    // Special ability based on level
    if (bossLevel >= 50) {
      abilities.push({
        id: `ability_special_${Date.now()}`,
        name: 'Elemental Fury',
        damage: bossLevel * 80,
        cooldown: 10000,
        description: 'Unleashes elemental magic dealing extreme damage'
      });
    }
    
    if (bossLevel >= 100) {
      abilities.push({
        id: `ability_ultimate_${Date.now()}`,
        name: 'Reality Shatter',
        damage: bossLevel * 100,
        cooldown: 15000,
        description: 'Tears through reality itself, dealing catastrophic damage'
      });
    }
    
    if (bossLevel >= 200) {
      abilities.push({
        id: `ability_godlike_${Date.now()}`,
        name: 'Divine Annihilation',
        damage: bossLevel * 150,
        cooldown: 20000,
        description: 'Channels divine power to obliterate all opposition'
      });
    }
    
    return abilities;
  };
  
  // Generate chest with better loot for higher level bosses
  const chestItemCount = Math.min(3 + Math.floor(dungeonLevel / 25), 10);
  const chestItems = Array.from({ length: chestItemCount }, () => generateRandomItem(dungeonLevel));
  
  // Add guaranteed rare+ item for higher level bosses
  if (dungeonLevel >= 100) {
    const guaranteedRare = generateRandomItem(dungeonLevel);
    guaranteedRare.rarity = dungeonLevel >= 300 ? 'legendary' : dungeonLevel >= 200 ? 'epic' : 'rare';
    chestItems.push(guaranteedRare);
  }
  
  return {
    id: `boss_${dungeonId}_${Date.now()}`,
    name,
    level,
    health,
    maxHealth: health,
    damage,
    position: { x: 0, y: 0, z: 0 },
    isAlive: true,
    chest: {
      id: `chest_${dungeonId}_${Date.now()}`,
      dungeonLevel,
      items: chestItems,
      isOpened: false
    },
    abilities: generateAbilities(level)
  };
};

// Generate enemies for dungeon floor based on level and theme
const generateEnemies = (dungeonLevel: number, floorNumber: number): Enemy[] => {
  // Enemy types based on dungeon level ranges
  const getEnemyPool = (level: number) => {
    if (level <= 50) {
      return [
        'Goblin Scout', 'Skeleton Warrior', 'Wild Wolf', 'Cave Spider', 'Bandit Thief',
        'Orc Grunt', 'Zombie Shambler', 'Giant Rat', 'Slime Blob', 'Kobold Fighter'
      ];
    } else if (level <= 100) {
      return [
        'Goblin Berserker', 'Skeleton Archer', 'Dire Wolf', 'Venomous Spider', 'Bandit Captain',
        'Orc Warrior', 'Undead Knight', 'Shadow Stalker', 'Fire Imp', 'Stone Golem'
      ];
    } else if (level <= 200) {
      return [
        'Orc Chieftain', 'Death Knight', 'Frost Wraith', 'Lightning Elemental', 'Dark Assassin',
        'Troll Berserker', 'Bone Dragon', 'Void Walker', 'Flame Demon', 'Crystal Guardian'
      ];
    } else if (level <= 300) {
      return [
        'Shadow Lord', 'Lich Mage', 'Storm Titan', 'Infernal Beast', 'Void Reaper',
        'Ancient Golem', 'Nightmare Spawn', 'Chaos Warrior', 'Elemental Master', 'Soul Devourer'
      ];
    } else if (level <= 400) {
      return [
        'Demon Prince', 'Arch Lich', 'Titan Destroyer', 'Void Emperor', 'Chaos God',
        'Ancient Dragon', 'Nightmare King', 'Destroyer of Worlds', 'Elemental Overlord', 'Death Incarnate'
      ];
    } else {
      return [
        'Cosmic Horror', 'Reality Bender', 'Time Destroyer', 'Dimension Ripper', 'Universe Ender',
        'Eternal Nightmare', 'Infinite Void', 'Absolute Chaos', 'Divine Destroyer', 'Omnipotent Terror'
      ];
    }
  };
  
  const enemyPool = getEnemyPool(dungeonLevel);
  
  // More enemies in higher level dungeons and later floors
  const baseEnemyCount = Math.min(3 + Math.floor(dungeonLevel / 50), 8);
  const floorMultiplier = floorNumber === 1 ? 1 : 1.5;
  const enemyCount = Math.floor(baseEnemyCount * floorMultiplier) + Math.floor(Math.random() * 3);
  
  const enemies: Enemy[] = [];
  
  for (let i = 0; i < enemyCount; i++) {
    const name = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const level = dungeonLevel + floorNumber - 1;
    
    // Scale health and damage with level progression
    const baseHealth = level * 100;
    const healthVariation = Math.floor(Math.random() * (level * 20));
    const health = baseHealth + healthVariation;
    
    const baseDamage = level * 20;
    const damageVariation = Math.floor(Math.random() * (level * 5));
    const damage = baseDamage + damageVariation;
    
    // Higher level enemies have better loot chances
    const lootChance = Math.min(0.3 + (dungeonLevel / 1000), 0.8);
    const lootCount = Math.random() < lootChance ? 1 + Math.floor(Math.random() * 2) : 0;
    
    enemies.push({
      id: `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      level,
      health,
      maxHealth: health,
      damage,
      position: {
        x: (Math.random() - 0.5) * 30,
        y: 0,
        z: (Math.random() - 0.5) * 30
      },
      isAlive: true,
      lootTable: Array.from({ length: lootCount }, () => generateRandomItem(dungeonLevel))
    });
  }
  
  return enemies;
};

// Generate 50 dungeons distributed across the 100km² map with level differences of 10
export const generateDungeons = (): Dungeon[] => {
  const dungeons: Dungeon[] = [];
  const mapSize = 100000; // 100km in meters
  
  // Dungeon themes and names for variety
  const dungeonThemes = [
    { name: 'Shadow Crypts', prefix: 'Crypt of' },
    { name: 'Crystal Caverns', prefix: 'Cavern of' },
    { name: 'Flame Sanctuaries', prefix: 'Sanctuary of' },
    { name: 'Ice Fortresses', prefix: 'Fortress of' },
    { name: 'Void Temples', prefix: 'Temple of' },
    { name: 'Storm Towers', prefix: 'Tower of' },
    { name: 'Earth Dungeons', prefix: 'Dungeon of' },
    { name: 'Light Shrines', prefix: 'Shrine of' },
    { name: 'Dark Labyrinths', prefix: 'Labyrinth of' },
    { name: 'Ancient Ruins', prefix: 'Ruins of' }
  ];
  
  for (let i = 0; i < 50; i++) {
    // Level progression: 1, 11, 21, 31, ... up to 491 (with 10 level differences)
    const level = (i * 10) + 1;
    const dungeonId = `dungeon_${String(i + 1).padStart(2, '0')}`;
    
    // Strategic distribution across biomes based on level
    let position: { x: number; y: number; z: number };
    
    if (level <= 100) {
      // Low level dungeons near safe zones and plains
      position = {
        x: (Math.random() - 0.5) * 40000, // Closer to center
        y: Math.random() * 50 + 10,
        z: (Math.random() - 0.5) * 40000
      };
    } else if (level <= 250) {
      // Mid level dungeons in forests and mountains
      position = {
        x: (Math.random() - 0.5) * 70000,
        y: Math.random() * 100 + 20,
        z: (Math.random() - 0.5) * 70000
      };
    } else {
      // High level dungeons in dangerous outer regions
      position = {
        x: (Math.random() - 0.5) * mapSize,
        y: Math.random() * 200 + 50,
        z: (Math.random() - 0.5) * mapSize
      };
    }
    
    // Select theme based on level and position
    const themeIndex = Math.floor(i / 5) % dungeonThemes.length;
    const theme = dungeonThemes[themeIndex];
    
    // Generate 2 regular floors + 1 boss floor
    const floors = [
      {
        id: `${dungeonId}_floor_1`,
        dungeonId,
        floorNumber: 1,
        enemies: generateEnemies(level, 1),
        isCleared: false,
        requiredLevel: level
      },
      {
        id: `${dungeonId}_floor_2`,
        dungeonId,
        floorNumber: 2,
        enemies: generateEnemies(level, 2),
        isCleared: false,
        requiredLevel: level
      },
      {
        id: `${dungeonId}_floor_boss`,
        dungeonId,
        floorNumber: 3,
        enemies: [],
        boss: generateBoss(level, dungeonId),
        isCleared: false,
        requiredLevel: level
      }
    ];
    
    dungeons.push({
      id: dungeonId,
      name: `${theme.prefix} ${getDungeonSuffix(level)}`,
      level,
      position,
      floors,
      isActive: true,
      playersInside: [],
      createdAt: new Date().toISOString()
    });
  }
  
  return dungeons;
};

// Generate appropriate dungeon suffix based on level
const getDungeonSuffix = (level: number): string => {
  if (level <= 50) return ['Beginnings', 'First Steps', 'Dawn', 'Awakening', 'Novice Trials'][Math.floor(Math.random() * 5)];
  if (level <= 100) return ['Shadows', 'Mist', 'Twilight', 'Echoes', 'Whispers'][Math.floor(Math.random() * 5)];
  if (level <= 200) return ['Storms', 'Flames', 'Thunder', 'Lightning', 'Fury'][Math.floor(Math.random() * 5)];
  if (level <= 300) return ['Darkness', 'Void', 'Abyss', 'Nightmare', 'Terror'][Math.floor(Math.random() * 5)];
  if (level <= 400) return ['Destruction', 'Chaos', 'Apocalypse', 'Ruin', 'Devastation'][Math.floor(Math.random() * 5)];
  return ['Eternity', 'Infinity', 'Transcendence', 'Ascension', 'Divinity'][Math.floor(Math.random() * 5)];
};

// Generate biomes for the map
export const generateBiomes = (): BiomeData[] => {
  return [
    {
      id: 'forest_1',
      name: 'Whispering Woods',
      type: 'forest',
      area: { x: -40000, y: -40000, width: 30000, height: 30000 },
      color: '#2d5016'
    },
    {
      id: 'mountain_1',
      name: 'Frozen Peaks',
      type: 'mountain',
      area: { x: 10000, y: -45000, width: 35000, height: 25000 },
      color: '#4a5568'
    },
    {
      id: 'desert_1',
      name: 'Scorching Sands',
      type: 'desert',
      area: { x: -45000, y: 15000, width: 40000, height: 30000 },
      color: '#d69e2e'
    },
    {
      id: 'swamp_1',
      name: 'Murky Marshlands',
      type: 'swamp',
      area: { x: 5000, y: 20000, width: 25000, height: 25000 },
      color: '#2d3748'
    },
    {
      id: 'plains_1',
      name: 'Golden Plains',
      type: 'plains',
      area: { x: -15000, y: -15000, width: 30000, height: 30000 },
      color: '#38a169'
    },
    {
      id: 'tundra_1',
      name: 'Icy Wasteland',
      type: 'tundra',
      area: { x: 25000, y: 25000, width: 20000, height: 20000 },
      color: '#e2e8f0'
    }
  ];
};

// Generate landmarks
export const generateLandmarks = (): Landmark[] => {
  return [
    {
      id: 'landmark_1',
      name: 'Ancient Tower',
      type: 'tower',
      position: { x: 0, y: 150, z: 0 },
      size: 50
    },
    {
      id: 'landmark_2',
      name: 'Crystal Lake',
      type: 'lake',
      position: { x: -20000, y: 0, z: 15000 },
      size: 200
    },
    {
      id: 'landmark_3',
      name: 'Dragon Mountain',
      type: 'mountain',
      position: { x: 30000, y: 300, z: -30000 },
      size: 500
    },
    {
      id: 'landmark_4',
      name: 'Lost Ruins',
      type: 'ruins',
      position: { x: -35000, y: 20, z: -20000 },
      size: 100
    },
    {
      id: 'landmark_5',
      name: 'Enchanted Forest',
      type: 'forest',
      position: { x: -25000, y: 10, z: -25000 },
      size: 300
    }
  ];
};

// Generate safe zones
export const generateSafeZones = (): SafeZone[] => {
  return [
    {
      id: 'safe_zone_1',
      name: 'Central City',
      position: { x: 0, y: 0, z: 0 },
      radius: 1000,
      type: 'town'
    },
    {
      id: 'safe_zone_2',
      name: 'Northern Outpost',
      position: { x: 0, y: 0, z: -40000 },
      radius: 500,
      type: 'outpost'
    },
    {
      id: 'safe_zone_3',
      name: 'Eastern Sanctuary',
      position: { x: 40000, y: 0, z: 0 },
      radius: 750,
      type: 'sanctuary'
    },
    {
      id: 'safe_zone_4',
      name: 'Southern Trading Post',
      position: { x: 0, y: 0, z: 40000 },
      radius: 500,
      type: 'outpost'
    },
    {
      id: 'safe_zone_5',
      name: 'Western Haven',
      position: { x: -40000, y: 0, z: 0 },
      radius: 750,
      type: 'sanctuary'
    }
  ];
};

// Generate the complete game map
export const generateGameMap = (): GameMap => {
  const dungeons = generateDungeons();
  const biomes = generateBiomes();
  const landmarks = generateLandmarks();
  const safeZones = generateSafeZones();
  
  // Generate height map (simplified)
  const heightMapSize = 200;
  const heightMap: number[][] = [];
  for (let x = 0; x < heightMapSize; x++) {
    heightMap[x] = [];
    for (let z = 0; z < heightMapSize; z++) {
      // Simple noise-like height generation
      const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 50 +
                   Math.sin(x * 0.05) * Math.cos(z * 0.05) * 100 +
                   Math.random() * 20;
      heightMap[x][z] = Math.max(0, noise);
    }
  }
  
  return {
    id: 'main_world',
    name: 'Realm of Shadows',
    size: { width: 100000, height: 1000, depth: 100000 },
    dungeons,
    safeZones,
    terrain: {
      heightMap,
      biomes,
      landmarks
    }
  };
};