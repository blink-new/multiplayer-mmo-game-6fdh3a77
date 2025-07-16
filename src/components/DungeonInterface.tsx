import { useState, useEffect } from 'react';
import { Dungeon, DungeonFloor, Enemy, Boss, Item, Player } from '../types/game';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Skull, 
  Crown, 
  Gift, 
  ArrowLeft,
  Users,
  Star
} from 'lucide-react';

interface DungeonInterfaceProps {
  dungeon: Dungeon;
  currentPlayer: Player;
  onExitDungeon: () => void;
  onFloorComplete: (floorId: string) => void;
  onBossDefeated: (bossId: string, loot: Item[]) => void;
  onEnemyDefeated: (enemyId: string, loot: Item[]) => void;
}

export function DungeonInterface({
  dungeon,
  currentPlayer,
  onExitDungeon,
  onFloorComplete,
  onBossDefeated,
  onEnemyDefeated
}: DungeonInterfaceProps) {
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [combatTarget, setCombatTarget] = useState<Enemy | Boss | null>(null);
  const [playerHealth, setPlayerHealth] = useState(currentPlayer.health);
  const [playerMana, setPlayerMana] = useState(currentPlayer.mana);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [lootReceived, setLootReceived] = useState<Item[]>([]);
  const [showLootModal, setShowLootModal] = useState(false);

  const currentFloor = dungeon.floors[currentFloorIndex];
  const [floorEnemies, setFloorEnemies] = useState(currentFloor?.enemies || []);
  const [floorBoss, setFloorBoss] = useState(currentFloor?.boss || null);

  useEffect(() => {
    const floor = dungeon.floors[currentFloorIndex];
    if (floor) {
      setFloorEnemies(floor.enemies || []);
      setFloorBoss(floor.boss || null);
    }
  }, [currentFloorIndex, dungeon.floors]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const startCombat = (target: Enemy | Boss) => {
    setCombatTarget(target);
    setCombatLog([`Combat started with ${target.name}!`]);
  };

  const attack = () => {
    if (!combatTarget) return;

    const playerDamage = Math.floor(Math.random() * 50) + 25;
    const targetDamage = Math.floor(Math.random() * combatTarget.damage) + 10;

    // Player attacks target
    const newTargetHealth = Math.max(0, combatTarget.health - playerDamage);
    
    if ('boss' in combatTarget || floorBoss?.id === combatTarget.id) {
      setFloorBoss(prev => prev ? { ...prev, health: newTargetHealth } : null);
    } else {
      setFloorEnemies(prev => 
        prev.map(enemy => 
          enemy.id === combatTarget.id 
            ? { ...enemy, health: newTargetHealth }
            : enemy
        )
      );
    }

    setCombatLog(prev => [
      ...prev,
      `You deal ${playerDamage} damage to ${combatTarget.name}!`
    ]);

    // Check if target is defeated
    if (newTargetHealth <= 0) {
      const loot = 'lootTable' in combatTarget ? combatTarget.lootTable : combatTarget.chest.items;
      
      setCombatLog(prev => [
        ...prev,
        `${combatTarget.name} has been defeated!`,
        `You received ${loot.length} items!`
      ]);

      setLootReceived(loot);
      setShowLootModal(true);
      setCombatTarget(null);

      if ('boss' in combatTarget || floorBoss?.id === combatTarget.id) {
        onBossDefeated(combatTarget.id, loot);
        // Move to next floor or complete dungeon
        if (currentFloorIndex < dungeon.floors.length - 1) {
          setTimeout(() => {
            setCurrentFloorIndex(prev => prev + 1);
          }, 2000);
        }
      } else {
        onEnemyDefeated(combatTarget.id, loot);
        // Remove defeated enemy
        setFloorEnemies(prev => prev.filter(enemy => enemy.id !== combatTarget.id));
      }
      return;
    }

    // Target attacks back if still alive
    const newPlayerHealth = Math.max(0, playerHealth - targetDamage);
    setPlayerHealth(newPlayerHealth);
    
    setCombatLog(prev => [
      ...prev,
      `${combatTarget.name} deals ${targetDamage} damage to you!`
    ]);

    // Check if player is defeated
    if (newPlayerHealth <= 0) {
      setCombatLog(prev => [
        ...prev,
        'You have been defeated! Respawning outside dungeon...'
      ]);
      
      setTimeout(() => {
        onExitDungeon();
      }, 2000);
    }
  };

  const castSkill = (skillType: 'heal' | 'damage' | 'shield') => {
    if (playerMana < 20) {
      setCombatLog(prev => [...prev, 'Not enough mana!']);
      return;
    }

    setPlayerMana(prev => Math.max(0, prev - 20));

    switch (skillType) {
      case 'heal': {
        const healAmount = Math.floor(Math.random() * 30) + 20;
        setPlayerHealth(prev => Math.min(currentPlayer.maxHealth, prev + healAmount));
        setCombatLog(prev => [...prev, `You heal for ${healAmount} health!`]);
        break;
      }
      
      case 'damage':
        if (combatTarget) {
          const skillDamage = Math.floor(Math.random() * 80) + 40;
          const newTargetHealth = Math.max(0, combatTarget.health - skillDamage);
          
          if ('boss' in combatTarget || floorBoss?.id === combatTarget.id) {
            setFloorBoss(prev => prev ? { ...prev, health: newTargetHealth } : null);
          } else {
            setFloorEnemies(prev => 
              prev.map(enemy => 
                enemy.id === combatTarget.id 
                  ? { ...enemy, health: newTargetHealth }
                  : enemy
              )
            );
          }
          
          setCombatLog(prev => [...prev, `Skill deals ${skillDamage} damage to ${combatTarget.name}!`]);
        }
        break;
      
      case 'shield':
        setCombatLog(prev => [...prev, 'You cast a protective shield!']);
        break;
    }
  };

  const proceedToNextFloor = () => {
    if (floorEnemies.every(enemy => enemy.health <= 0) && (!floorBoss || floorBoss.health <= 0)) {
      onFloorComplete(currentFloor.id);
      if (currentFloorIndex < dungeon.floors.length - 1) {
        setCurrentFloorIndex(prev => prev + 1);
        setCombatLog([]);
      } else {
        setCombatLog(prev => [...prev, 'Dungeon completed! Congratulations!']);
        setTimeout(() => {
          onExitDungeon();
        }, 3000);
      }
    }
  };

  const canProceed = floorEnemies.every(enemy => enemy.health <= 0) && (!floorBoss || floorBoss.health <= 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={onExitDungeon} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Dungeon
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{dungeon.name}</h1>
              <p className="text-slate-300">Floor {currentFloorIndex + 1} of {dungeon.floors.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white">
              <Users className="w-4 h-4 mr-1" />
              {dungeon.playersInside.length} players
            </Badge>
            <Badge variant="outline" className="text-white">
              Level {dungeon.level}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Player Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>Health</span>
                  <span>{playerHealth}/{currentPlayer.maxHealth}</span>
                </div>
                <Progress 
                  value={(playerHealth / currentPlayer.maxHealth) * 100} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>Mana</span>
                  <span>{playerMana}/{currentPlayer.maxMana}</span>
                </div>
                <Progress 
                  value={(playerMana / currentPlayer.maxMana) * 100} 
                  className="h-2 [&>div]:bg-blue-500"
                />
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => castSkill('heal')} 
                  disabled={playerMana < 20}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Heal (20 mana)
                </Button>
                
                <Button 
                  onClick={() => castSkill('damage')} 
                  disabled={playerMana < 20 || !combatTarget}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Power Attack (20 mana)
                </Button>
                
                <Button 
                  onClick={() => castSkill('shield')} 
                  disabled={playerMana < 20}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Shield (20 mana)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Floor Content */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sword className="w-5 h-5 text-yellow-400" />
                Floor {currentFloorIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Enemies */}
              {floorEnemies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Skull className="w-4 h-4" />
                    Enemies
                  </h3>
                  <div className="space-y-2">
                    {floorEnemies.map((enemy) => (
                      <div 
                        key={enemy.id} 
                        className={`p-3 rounded border ${
                          enemy.health <= 0 
                            ? 'bg-slate-700/50 border-slate-600' 
                            : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                        } transition-colors`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${
                            enemy.health <= 0 ? 'text-slate-500 line-through' : 'text-white'
                          }`}>
                            {enemy.name} (Lv.{enemy.level})
                          </span>
                          {enemy.health > 0 && (
                            <Button 
                              onClick={() => startCombat(enemy)}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Attack
                            </Button>
                          )}
                        </div>
                        
                        {enemy.health > 0 && (
                          <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Health</span>
                              <span>{enemy.health}/{enemy.maxHealth}</span>
                            </div>
                            <Progress 
                              value={(enemy.health / enemy.maxHealth) * 100} 
                              className="h-1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boss */}
              {floorBoss && (
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    Boss
                  </h3>
                  <div className={`p-4 rounded border ${
                    floorBoss.health <= 0 
                      ? 'bg-slate-700/50 border-slate-600' 
                      : 'bg-gradient-to-r from-purple-900/50 to-red-900/50 border-purple-500'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-lg font-bold ${
                        floorBoss.health <= 0 ? 'text-slate-500 line-through' : 'text-yellow-400'
                      }`}>
                        {floorBoss.name} (Lv.{floorBoss.level})
                      </span>
                      {floorBoss.health > 0 && (
                        <Button 
                          onClick={() => startCombat(floorBoss)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Challenge Boss
                        </Button>
                      )}
                    </div>
                    
                    {floorBoss.health > 0 && (
                      <div>
                        <div className="flex justify-between text-sm text-slate-300 mb-1">
                          <span>Health</span>
                          <span>{floorBoss.health}/{floorBoss.maxHealth}</span>
                        </div>
                        <Progress 
                          value={(floorBoss.health / floorBoss.maxHealth) * 100} 
                          className="h-3 [&>div]:bg-purple-500"
                        />
                      </div>
                    )}
                    
                    {floorBoss.health <= 0 && (
                      <div className="mt-2 p-2 bg-green-900/30 rounded border border-green-700">
                        <div className="flex items-center gap-2 text-green-400">
                          <Gift className="w-4 h-4" />
                          <span className="text-sm">Boss defeated! Chest available.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Floor Progress */}
              {canProceed && currentFloorIndex < dungeon.floors.length - 1 && (
                <Button 
                  onClick={proceedToNextFloor}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Proceed to Next Floor
                </Button>
              )}
              
              {canProceed && currentFloorIndex === dungeon.floors.length - 1 && (
                <div className="text-center p-4 bg-green-900/30 rounded border border-green-700">
                  <div className="text-green-400 font-bold mb-2">🎉 Dungeon Completed! 🎉</div>
                  <p className="text-slate-300 text-sm">You will be teleported out in a few seconds...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Combat & Combat Log */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sword className="w-5 h-5 text-red-400" />
                Combat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {combatTarget ? (
                <div className="space-y-4">
                  <div className="p-3 bg-red-900/30 rounded border border-red-700">
                    <div className="text-white font-medium mb-2">
                      Fighting: {combatTarget.name}
                    </div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>Enemy Health</span>
                      <span>{combatTarget.health}/{combatTarget.maxHealth}</span>
                    </div>
                    <Progress 
                      value={(combatTarget.health / combatTarget.maxHealth) * 100} 
                      className="h-2 [&>div]:bg-red-500"
                    />
                  </div>
                  
                  <Button 
                    onClick={attack}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Sword className="w-4 h-4 mr-2" />
                    Attack
                  </Button>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Sword className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Select an enemy to start combat</p>
                </div>
              )}
              
              {/* Combat Log */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Combat Log</h4>
                <div className="bg-slate-900/50 rounded p-3 h-40 overflow-y-auto">
                  {combatLog.length > 0 ? (
                    <div className="space-y-1">
                      {combatLog.map((log, index) => (
                        <div key={index} className="text-sm text-slate-300">
                          {log}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm text-center py-8">
                      Combat log will appear here
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loot Modal */}
      {showLootModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-400" />
              Loot Received!
            </h3>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {lootReceived.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded border ${getRarityColor(item.rarity)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{item.name}</span>
                    <Badge variant="outline" className={getRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-300">{item.description}</div>
                  
                  {/* Item stats */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.stats.damage && (
                      <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded">
                        +{item.stats.damage} DMG
                      </span>
                    )}
                    {item.stats.defense && (
                      <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                        +{item.stats.defense} DEF
                      </span>
                    )}
                    {item.stats.health && (
                      <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded">
                        +{item.stats.health} HP
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => setShowLootModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}