import { Skill } from '../types/game';

export const HEALER_SKILLS: Skill[] = [
  { id: 'heal_1', name: 'Minor Heal', description: 'Restores 50 health to target', characterClass: 'healer', skillType: 'active', damage: 0, healing: 50, manaCost: 20, cooldown: 2000, levelRequired: 1 },
  { id: 'heal_2', name: 'Greater Heal', description: 'Restores 100 health to target', characterClass: 'healer', skillType: 'active', damage: 0, healing: 100, manaCost: 40, cooldown: 4000, levelRequired: 5 },
  { id: 'heal_3', name: 'Group Heal', description: 'Heals all nearby allies for 75 health', characterClass: 'healer', skillType: 'active', damage: 0, healing: 75, manaCost: 60, cooldown: 8000, levelRequired: 10 },
  { id: 'heal_4', name: 'Regeneration', description: 'Heals target for 20 health over 10 seconds', characterClass: 'healer', skillType: 'active', damage: 0, healing: 20, manaCost: 30, cooldown: 6000, levelRequired: 8 },
  { id: 'heal_5', name: 'Divine Protection', description: 'Reduces damage taken by 50% for 10 seconds', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 50, cooldown: 15000, levelRequired: 12 },
  { id: 'heal_6', name: 'Resurrection', description: 'Revives a fallen ally with 50% health', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 100, cooldown: 30000, levelRequired: 15 },
  { id: 'heal_7', name: 'Mana Shield', description: 'Absorbs damage using mana instead of health', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 40, cooldown: 12000, levelRequired: 18 },
  { id: 'heal_8', name: 'Purify', description: 'Removes all debuffs from target', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 35, cooldown: 8000, levelRequired: 14 },
  { id: 'heal_9', name: 'Holy Light', description: 'Deals 80 damage to undead enemies or heals 80 to allies', characterClass: 'healer', skillType: 'active', damage: 80, healing: 80, manaCost: 45, cooldown: 5000, levelRequired: 16 },
  { id: 'heal_10', name: 'Sanctuary', description: 'Creates a healing zone that restores 15 health per second', characterClass: 'healer', skillType: 'active', damage: 0, healing: 15, manaCost: 70, cooldown: 20000, levelRequired: 20 },
  { id: 'heal_11', name: 'Blessing of Vitality', description: 'Increases max health by 25% for 5 minutes', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 60, cooldown: 300000, levelRequired: 22 },
  { id: 'heal_12', name: 'Spirit Link', description: 'Links health between caster and target', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 80, cooldown: 25000, levelRequired: 25 },
  { id: 'heal_13', name: 'Mass Resurrection', description: 'Revives all fallen allies in area', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 200, cooldown: 60000, levelRequired: 30 },
  { id: 'heal_14', name: 'Divine Favor', description: 'Next 3 spells cost no mana', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 0, cooldown: 45000, levelRequired: 28 },
  { id: 'heal_15', name: 'Healing Mastery', description: 'Passive: All healing spells are 25% more effective', characterClass: 'healer', skillType: 'passive', damage: 0, healing: 0, manaCost: 0, cooldown: 0, levelRequired: 35 },
  { id: 'heal_16', name: 'Mana Burn', description: 'Drains 60 mana from enemy and deals damage equal to mana drained', characterClass: 'healer', skillType: 'active', damage: 60, healing: 0, manaCost: 40, cooldown: 10000, levelRequired: 32 },
  { id: 'heal_17', name: 'Guardian Angel', description: 'Prevents target from dying for 5 seconds', characterClass: 'healer', skillType: 'active', damage: 0, healing: 0, manaCost: 120, cooldown: 120000, levelRequired: 40 },
  { id: 'heal_18', name: 'Tranquility', description: 'Channeled spell that heals all allies for 30 health per second', characterClass: 'healer', skillType: 'active', damage: 0, healing: 30, manaCost: 100, cooldown: 60000, levelRequired: 38 },
  { id: 'heal_19', name: 'Divine Wrath', description: 'Deals massive damage based on missing health of caster', characterClass: 'healer', skillType: 'active', damage: 200, healing: 0, manaCost: 80, cooldown: 30000, levelRequired: 45 },
  { id: 'heal_20', name: 'Ascension', description: 'Ultimate: Become invulnerable and heal all allies to full health', characterClass: 'healer', skillType: 'active', damage: 0, healing: 999, manaCost: 200, cooldown: 300000, levelRequired: 50 }
];

export const TANK_SKILLS: Skill[] = [
  { id: 'tank_1', name: 'Shield Bash', description: 'Deals 40 damage and stuns enemy for 2 seconds', characterClass: 'tank', skillType: 'active', damage: 40, healing: 0, manaCost: 15, cooldown: 6000, levelRequired: 1 },
  { id: 'tank_2', name: 'Taunt', description: 'Forces enemy to attack you for 5 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 20, cooldown: 8000, levelRequired: 3 },
  { id: 'tank_3', name: 'Shield Wall', description: 'Reduces damage taken by 75% for 8 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 40, cooldown: 20000, levelRequired: 7 },
  { id: 'tank_4', name: 'Charge', description: 'Rush to target dealing 60 damage and stunning for 1 second', characterClass: 'tank', skillType: 'active', damage: 60, healing: 0, manaCost: 25, cooldown: 10000, levelRequired: 5 },
  { id: 'tank_5', name: 'Intimidating Shout', description: 'Causes nearby enemies to flee for 3 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 30, cooldown: 15000, levelRequired: 9 },
  { id: 'tank_6', name: 'Revenge', description: 'Next attack deals 100% more damage after taking damage', characterClass: 'tank', skillType: 'active', damage: 80, healing: 0, manaCost: 35, cooldown: 12000, levelRequired: 11 },
  { id: 'tank_7', name: 'Guardian Stance', description: 'Reduces damage taken by 30% but also reduces damage dealt by 20%', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 50, cooldown: 5000, levelRequired: 13 },
  { id: 'tank_8', name: 'Shield Slam', description: 'Deals 70 damage and reduces enemy damage by 25% for 6 seconds', characterClass: 'tank', skillType: 'active', damage: 70, healing: 0, manaCost: 40, cooldown: 8000, levelRequired: 15 },
  { id: 'tank_9', name: 'Berserker Rage', description: 'Increases damage by 50% but takes 25% more damage for 10 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 60, cooldown: 25000, levelRequired: 17 },
  { id: 'tank_10', name: 'Fortress', description: 'Becomes immobile but immune to all damage for 5 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 80, cooldown: 45000, levelRequired: 20 },
  { id: 'tank_11', name: 'Armor Mastery', description: 'Passive: Reduces all physical damage by 15%', characterClass: 'tank', skillType: 'passive', damage: 0, healing: 0, manaCost: 0, cooldown: 0, levelRequired: 22 },
  { id: 'tank_12', name: 'Rallying Cry', description: 'Increases all nearby allies damage and defense by 20% for 30 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 70, cooldown: 60000, levelRequired: 25 },
  { id: 'tank_13', name: 'Earthquake', description: 'Deals 90 damage to all nearby enemies and slows them', characterClass: 'tank', skillType: 'active', damage: 90, healing: 0, manaCost: 100, cooldown: 20000, levelRequired: 28 },
  { id: 'tank_14', name: 'Last Stand', description: 'When health drops below 25%, gain 100% damage resistance for 8 seconds', characterClass: 'tank', skillType: 'passive', damage: 0, healing: 0, manaCost: 0, cooldown: 120000, levelRequired: 30 },
  { id: 'tank_15', name: 'Shield Mastery', description: 'Passive: 25% chance to block attacks completely', characterClass: 'tank', skillType: 'passive', damage: 0, healing: 0, manaCost: 0, cooldown: 0, levelRequired: 32 },
  { id: 'tank_16', name: 'Whirlwind', description: 'Spin attack that hits all nearby enemies for 85 damage', characterClass: 'tank', skillType: 'active', damage: 85, healing: 0, manaCost: 60, cooldown: 15000, levelRequired: 35 },
  { id: 'tank_17', name: 'Unbreakable', description: 'Immune to stuns, slows, and debuffs for 12 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 90, cooldown: 90000, levelRequired: 38 },
  { id: 'tank_18', name: 'Sacrifice', description: 'Take all damage intended for nearby allies for 10 seconds', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 120, cooldown: 120000, levelRequired: 40 },
  { id: 'tank_19', name: 'Meteor Strike', description: 'Leap into air and crash down dealing 250 damage in large area', characterClass: 'tank', skillType: 'active', damage: 250, healing: 0, manaCost: 150, cooldown: 60000, levelRequired: 45 },
  { id: 'tank_20', name: 'Immortal Guardian', description: 'Ultimate: Cannot die for 15 seconds and reflect all damage back to attackers', characterClass: 'tank', skillType: 'active', damage: 0, healing: 0, manaCost: 200, cooldown: 300000, levelRequired: 50 }
];

export const DPS_SKILLS: Skill[] = [
  { id: 'dps_1', name: 'Quick Strike', description: 'Fast attack dealing 45 damage', characterClass: 'dps', skillType: 'active', damage: 45, healing: 0, manaCost: 10, cooldown: 1500, levelRequired: 1 },
  { id: 'dps_2', name: 'Power Shot', description: 'Charged attack dealing 80 damage', characterClass: 'dps', skillType: 'active', damage: 80, healing: 0, manaCost: 25, cooldown: 4000, levelRequired: 3 },
  { id: 'dps_3', name: 'Stealth', description: 'Become invisible for 6 seconds, next attack deals double damage', characterClass: 'dps', skillType: 'active', damage: 0, healing: 0, manaCost: 40, cooldown: 15000, levelRequired: 6 },
  { id: 'dps_4', name: 'Poison Blade', description: 'Next 5 attacks deal additional 15 poison damage over time', characterClass: 'dps', skillType: 'active', damage: 15, healing: 0, manaCost: 35, cooldown: 12000, levelRequired: 8 },
  { id: 'dps_5', name: 'Multi-Shot', description: 'Attack hits up to 3 enemies for 60 damage each', characterClass: 'dps', skillType: 'active', damage: 60, healing: 0, manaCost: 45, cooldown: 8000, levelRequired: 10 },
  { id: 'dps_6', name: 'Critical Strike', description: 'Guaranteed critical hit dealing 120 damage', characterClass: 'dps', skillType: 'active', damage: 120, healing: 0, manaCost: 50, cooldown: 10000, levelRequired: 12 },
  { id: 'dps_7', name: 'Shadow Step', description: 'Teleport behind enemy and deal 70 damage', characterClass: 'dps', skillType: 'active', damage: 70, healing: 0, manaCost: 40, cooldown: 12000, levelRequired: 14 },
  { id: 'dps_8', name: 'Berserker Mode', description: 'Attack speed increased by 100% for 8 seconds', characterClass: 'dps', skillType: 'active', damage: 0, healing: 0, manaCost: 60, cooldown: 25000, levelRequired: 16 },
  { id: 'dps_9', name: 'Explosive Arrow', description: 'Ranged attack that explodes for 100 damage in area', characterClass: 'dps', skillType: 'active', damage: 100, healing: 0, manaCost: 55, cooldown: 15000, levelRequired: 18 },
  { id: 'dps_10', name: 'Assassinate', description: 'Instantly kill enemy below 30% health', characterClass: 'dps', skillType: 'active', damage: 999, healing: 0, manaCost: 80, cooldown: 30000, levelRequired: 20 },
  { id: 'dps_11', name: 'Dual Wield Mastery', description: 'Passive: 30% chance to attack twice', characterClass: 'dps', skillType: 'passive', damage: 0, healing: 0, manaCost: 0, cooldown: 0, levelRequired: 22 },
  { id: 'dps_12', name: 'Shadow Clone', description: 'Create a clone that fights alongside you for 20 seconds', characterClass: 'dps', skillType: 'active', damage: 50, healing: 0, manaCost: 100, cooldown: 45000, levelRequired: 25 },
  { id: 'dps_13', name: 'Flame Strike', description: 'Weapon ignites dealing 90 damage plus 20 fire damage over 5 seconds', characterClass: 'dps', skillType: 'active', damage: 90, healing: 0, manaCost: 65, cooldown: 18000, levelRequired: 28 },
  { id: 'dps_14', name: 'Evasion', description: 'Dodge all attacks for 5 seconds', characterClass: 'dps', skillType: 'active', damage: 0, healing: 0, manaCost: 70, cooldown: 35000, levelRequired: 30 },
  { id: 'dps_15', name: 'Weapon Mastery', description: 'Passive: All attacks have 20% chance to ignore armor', characterClass: 'dps', skillType: 'passive', damage: 0, healing: 0, manaCost: 0, cooldown: 0, levelRequired: 32 },
  { id: 'dps_16', name: 'Chain Lightning', description: 'Lightning jumps between up to 5 enemies dealing 85 damage each', characterClass: 'dps', skillType: 'active', damage: 85, healing: 0, manaCost: 90, cooldown: 20000, levelRequired: 35 },
  { id: 'dps_17', name: 'Time Slow', description: 'Slows all enemies by 75% for 8 seconds', characterClass: 'dps', skillType: 'active', damage: 0, healing: 0, manaCost: 120, cooldown: 60000, levelRequired: 38 },
  { id: 'dps_18', name: 'Perfect Strike', description: 'Next attack cannot miss and deals 200 damage', characterClass: 'dps', skillType: 'active', damage: 200, healing: 0, manaCost: 100, cooldown: 25000, levelRequired: 40 },
  { id: 'dps_19', name: 'Meteor Storm', description: 'Rain meteors in large area for 10 seconds, each dealing 80 damage', characterClass: 'dps', skillType: 'active', damage: 80, healing: 0, manaCost: 180, cooldown: 90000, levelRequired: 45 },
  { id: 'dps_20', name: 'Avatar of Destruction', description: 'Ultimate: Transform into pure damage, all attacks deal 300% damage for 20 seconds', characterClass: 'dps', skillType: 'active', damage: 0, healing: 0, manaCost: 200, cooldown: 300000, levelRequired: 50 }
];

export const ALL_SKILLS = [...HEALER_SKILLS, ...TANK_SKILLS, ...DPS_SKILLS];