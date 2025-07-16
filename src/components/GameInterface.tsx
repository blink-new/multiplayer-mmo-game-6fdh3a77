import { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Heart, 
  Zap, 
  Shield, 
  Sword, 
  Users, 
  MessageCircle, 
  Settings,
  Crown,
  Target,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Player, Skill } from '../types/game';
import { ALL_SKILLS } from '../data/skills';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { GameWorld } from './GameWorld';
import { GameNotifications } from './GameNotifications';
import { useGameNotifications } from '../hooks/useGameNotifications';

interface GameInterfaceProps {
  player: Player;
  onLogout: () => void;
}

export function GameInterface({ player, onLogout }: GameInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  
  // Use notifications system - must be called before any conditional returns
  const {
    notifications,
    dismissNotification,
    showCombatChallenge,
    showSystemMessage,
    showAchievement
  } = useGameNotifications();

  // Use multiplayer hook for real-time functionality
  const {
    onlinePlayers,
    chatMessages,
    isConnected,
    sendChatMessage,
    useSkill: multiplayerUseSkill,
    updatePlayerStats,
    updatePlayerPosition,
    initiateCombat
  } = useMultiplayer({ player });

  // Update player state when stats change
  const handlePlayerStatsUpdate = useCallback(async (stats: Partial<Pick<Player, 'health' | 'mana' | 'level'>>) => {
    // Update localStorage
    const savedCharacter = localStorage.getItem(`mmo_character_${player.userId}`);
    if (savedCharacter) {
      const character = JSON.parse(savedCharacter);
      Object.assign(character, stats);
      character.lastSeen = new Date().toISOString();
      localStorage.setItem(`mmo_character_${player.userId}`, JSON.stringify(character));
    }
    
    // Update multiplayer state
    await updatePlayerStats(stats);
  }, [player.userId, updatePlayerStats]);

  // Initialize skills based on character class
  useEffect(() => {
    const classSkills = ALL_SKILLS.filter(skill => 
      skill.characterClass === player.characterClass && 
      skill.levelRequired <= player.level
    ).slice(0, 10); // First 10 skills for hotbar
    setSelectedSkills(classSkills);
  }, [player.characterClass, player.level]);

  // Show welcome message and connection status
  useEffect(() => {
    if (isConnected && player?.characterName) {
      showSystemMessage('Connected!', 'You are now connected to the multiplayer world!', 4000);
      showAchievement('Welcome Adventurer!', `${player.characterName} has entered the realm!`, 6000);
    }
  }, [isConnected, player?.characterName, showSystemMessage, showAchievement]);

  // Handle skill cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setSkillCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(skillId => {
          if (updated[skillId] > 0) {
            updated[skillId] = Math.max(0, updated[skillId] - 100);
          }
        });
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Early return if player is invalid (after all hooks are called)
  if (!player || !player.id) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading player data...</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendChatMessage(newMessage, 'global');
    setNewMessage('');
  };

  const handleSkillUse = async (skill: Skill) => {
    if (!skill || !player) return;
    if (skillCooldowns[skill.id] > 0) return;
    if (player.mana < skill.manaCost) return;

    try {
      // Set cooldown
      setSkillCooldowns(prev => ({
        ...prev,
        [skill.id]: skill.cooldown
      }));

      // Update player mana
      const newMana = Math.max(0, player.mana - skill.manaCost);
      await handlePlayerStatsUpdate({ mana: newMana });

      // Broadcast skill usage to other players
      if (multiplayerUseSkill) {
        await multiplayerUseSkill(skill.id);
      }

      // Show skill usage notification
      showSystemMessage('Skill Used', `${skill.name} activated!`, 2000);
      
      console.log(`Used skill: ${skill.name}`);
    } catch (error) {
      console.error('Error using skill:', error);
      showSystemMessage('Error', 'Failed to use skill. Please try again.', 3000);
    }
  };

  const getClassColor = (characterClass: string) => {
    switch (characterClass) {
      case 'healer': return 'text-green-400';
      case 'tank': return 'text-blue-400';
      case 'dps': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case 'healer': return Heart;
      case 'tank': return Shield;
      case 'dps': return Sword;
      default: return Target;
    }
  };

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case 'alliance': return 'text-blue-300';
      case 'horde': return 'text-red-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <>
      <GameNotifications 
        notifications={notifications}
        onDismiss={dismissNotification}
      />
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = getClassIcon(player.characterClass);
                return <Icon className={`w-6 h-6 ${getClassColor(player.characterClass)}`} />;
              })()}
              <div>
                <h1 className="text-white font-bold">{player.characterName}</h1>
                <p className="text-slate-400 text-sm">
                  Level {player.level} {player.characterClass} • 
                  <span className={getFactionColor(player.faction)}> {player.faction}</span>
                </p>
              </div>
            </div>
            
            {/* Health and Mana Bars */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <div className="w-32">
                  <Progress value={(player.health / player.maxHealth) * 100} className="h-2" />
                  <p className="text-xs text-slate-400">{player.health}/{player.maxHealth}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <div className="w-32">
                  <Progress value={(player.mana / player.maxMana) * 100} className="h-2" />
                  <p className="text-xs text-slate-400">{player.mana}/{player.maxMana}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${isConnected ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}`}
            >
              {isConnected ? (
                <><Wifi className="w-3 h-3 mr-1" />Online: {onlinePlayers.length}</>
              ) : (
                <><WifiOff className="w-3 h-3 mr-1" />Offline</>
              )}
            </Badge>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <Settings className="w-4 h-4 mr-2" />
              Menu
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Game Area */}
        <div className="flex-1 flex flex-col">
          {/* Game Viewport */}
          <GameWorld 
            currentPlayer={player}
            onlinePlayers={onlinePlayers}
            onPlayerMove={updatePlayerPosition}
          />

          {/* Skill Hotbar */}
          <div className="bg-slate-800/80 border-t border-slate-700 p-4">
            <div className="flex justify-center">
              <div className="flex gap-2">
                {selectedSkills.map((skill, index) => {
                  const cooldownPercent = skillCooldowns[skill.id] ? 
                    (skillCooldowns[skill.id] / skill.cooldown) * 100 : 0;
                  const canUse = player.mana >= skill.manaCost && cooldownPercent === 0;
                  
                  return (
                    <div key={skill.id} className="relative">
                      <Button
                        variant="outline"
                        size="lg"
                        className={`w-16 h-16 p-2 ${
                          canUse 
                            ? 'bg-slate-700 hover:bg-slate-600 border-slate-500' 
                            : 'bg-slate-800 border-slate-600 opacity-50'
                        }`}
                        onClick={() => handleSkillUse(skill)}
                        disabled={!canUse}
                      >
                        <div className="text-center">
                          <div className="text-xs font-bold text-white">{index + 1}</div>
                          <div className="text-xs text-slate-300 truncate">{skill.name.slice(0, 6)}</div>
                        </div>
                      </Button>
                      
                      {/* Cooldown Overlay */}
                      {cooldownPercent > 0 && (
                        <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                          <div className="text-white text-xs font-bold">
                            {Math.ceil(skillCooldowns[skill.id] / 1000)}s
                          </div>
                        </div>
                      )}
                      
                      {/* Mana Cost */}
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded">
                        {skill.manaCost}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-slate-800/60 border-l border-slate-700">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              <TabsTrigger value="chat" className="text-slate-300">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="players" className="text-slate-300">
                <Users className="w-4 h-4 mr-2" />
                Players
              </TabsTrigger>
              <TabsTrigger value="guild" className="text-slate-300">
                <Crown className="w-4 h-4 mr-2" />
                Guild
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col p-4">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-2">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="text-sm">
                      <span className={getClassColor(player.characterClass)}>
                        [{message.playerName}]:
                      </span>
                      <span className="text-slate-300 ml-2">{message.message}</span>
                    </div>
                  ))}
                  {chatMessages.length === 0 && (
                    <p className="text-slate-400 text-center py-8">No messages yet...</p>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="sm">
                  Send
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="players" className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {onlinePlayers.map((p) => {
                    const Icon = getClassIcon(p.characterClass);
                    const isCurrentPlayer = p.id === player.id;
                    const canChallenge = !isCurrentPlayer && p.faction !== player.faction;
                    
                    return (
                      <Card key={p.id} className={`bg-slate-700/30 p-3 ${isCurrentPlayer ? 'ring-1 ring-purple-400' : ''}`}>
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${getClassColor(p.characterClass)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">{p.characterName}</p>
                              {isCurrentPlayer && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs">
                              Level {p.level} {p.characterClass}
                            </p>
                            {p.health !== undefined && p.maxHealth && (
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-12 h-1 bg-slate-600 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-red-400 transition-all duration-300"
                                    style={{ width: `${(p.health / p.maxHealth) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-400">{p.health}/{p.maxHealth}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getFactionColor(p.faction)} border-current`}
                            >
                              {p.faction}
                            </Badge>
                            {canChallenge && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 px-2 text-red-400 border-red-400 hover:bg-red-400/10"
                                onClick={() => {
                                  initiateCombat(p.id);
                                  showSystemMessage('Challenge Sent', `Combat challenge sent to ${p.characterName}!`, 3000);
                                }}
                              >
                                Challenge
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  {onlinePlayers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">No players online</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="guild" className="flex-1 p-4">
              <div className="text-center py-8">
                <Crown className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">You are not in a guild</p>
                <Button variant="outline" className="w-full">
                  Create Guild
                </Button>
                <Button variant="ghost" className="w-full mt-2">
                  Join Guild
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
    </>
  );
}