import { useState, useEffect, useCallback, useRef } from 'react';
import { blink } from '../blink/client';
import { Player, ChatMessage } from '../types/game';
import type { RealtimeChannel } from '@blinkdotnew/sdk';

interface MultiplayerState {
  onlinePlayers: Player[];
  chatMessages: ChatMessage[];
  isConnected: boolean;
}

interface UseMultiplayerProps {
  player: Player;
  gameChannel?: string;
}

export function useMultiplayer({ player, gameChannel = 'mmo-world' }: UseMultiplayerProps) {
  const [state, setState] = useState<MultiplayerState>({
    onlinePlayers: [],
    chatMessages: [],
    isConnected: false
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const playerRef = useRef(player);

  // Update player ref when player changes
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Initialize realtime connection
  useEffect(() => {
    if (!player?.id) return;

    let channel: RealtimeChannel | null = null;
    let isMounted = true;

    const initializeRealtime = async () => {
      try {
        channel = blink.realtime.channel(gameChannel);
        channelRef.current = channel;

        // Subscribe with player metadata
        await channel.subscribe({
          userId: playerRef.current.userId,
          metadata: {
            playerId: playerRef.current.id,
            characterName: playerRef.current.characterName,
            characterClass: playerRef.current.characterClass,
            level: playerRef.current.level,
            faction: playerRef.current.faction,
            health: playerRef.current.health,
            mana: playerRef.current.mana,
            maxHealth: playerRef.current.maxHealth,
            maxMana: playerRef.current.maxMana,
            experience: playerRef.current.experience,
            positionX: playerRef.current.positionX,
            positionY: playerRef.current.positionY,
            appearance: playerRef.current.appearance,
            isOnline: true
          }
        });

        // Listen for messages
        channel.onMessage((message) => {
          if (message.type === 'chat') {
            const chatMessage: ChatMessage = {
              id: message.id,
              playerId: message.metadata?.playerId || message.userId,
              message: message.data.text,
              channel: message.data.channel || 'global',
              playerName: message.metadata?.characterName || 'Unknown',
              createdAt: new Date(message.timestamp).toISOString()
            };

            if (isMounted) {
              setState(prev => ({
                ...prev,
                chatMessages: [...prev.chatMessages.slice(-49), chatMessage] // Keep last 50 messages
              }));
            }
          } else if (message.type === 'player-action') {
            // Handle player actions like skill usage, movement, etc.
            console.log('Player action:', message.data);
          } else if (message.type === 'combat') {
            // Handle combat events
            console.log('Combat event:', message.data);
          }
        });

        // Listen for presence changes (online players)
        channel.onPresence((users) => {
          const players: Player[] = users.map(user => ({
            id: user.metadata?.playerId || user.userId,
            userId: user.userId,
            characterName: user.metadata?.characterName || 'Unknown',
            characterClass: user.metadata?.characterClass || 'dps',
            level: user.metadata?.level || 1,
            health: user.metadata?.health || 100,
            mana: user.metadata?.mana || 100,
            maxHealth: user.metadata?.maxHealth || 100,
            maxMana: user.metadata?.maxMana || 100,
            experience: user.metadata?.experience || 0,
            faction: user.metadata?.faction || 'neutral',
            positionX: user.metadata?.positionX || 400,
            positionY: user.metadata?.positionY || 300,
            isOnline: true,
            lastSeen: new Date(user.lastSeen).toISOString(),
            createdAt: new Date(user.joinedAt).toISOString(),
            appearance: user.metadata?.appearance || {
              race: 'human',
              gender: 'male',
              hairstyle: 1,
              eyeColor: '#8B4513',
              hairColor: '#2C1810',
              skinColor: '#FDBCB4',
              mouthType: 1,
              beardStyle: 0,
              beardColor: '#2C1810',
              bodyType: 3,
              faceType: 1
            }
          }));

          if (isMounted) {
            setState(prev => ({
              ...prev,
              onlinePlayers: players
            }));
          }
        });

        // Load recent chat messages
        const recentMessages = await channel.getMessages({ limit: 50 });
        const chatMessages: ChatMessage[] = recentMessages
          .filter(msg => msg.type === 'chat')
          .map(msg => ({
            id: msg.id,
            playerId: msg.metadata?.playerId || msg.userId,
            message: msg.data.text,
            channel: msg.data.channel || 'global',
            playerName: msg.metadata?.characterName || 'Unknown',
            createdAt: new Date(msg.timestamp).toISOString()
          }));

        if (isMounted) {
          setState(prev => ({
            ...prev,
            chatMessages,
            isConnected: true
          }));
        }

      } catch (error) {
        console.error('Failed to initialize realtime:', error);
        if (isMounted) {
          setState(prev => ({ ...prev, isConnected: false }));
        }
      }
    };

    initializeRealtime();

    return () => {
      isMounted = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [player?.id, gameChannel]);

  // Send chat message
  const sendChatMessage = useCallback(async (message: string, channel: string = 'global') => {
    if (!channelRef.current || !message.trim()) return;

    try {
      await channelRef.current.publish('chat', {
        text: message,
        channel,
        timestamp: Date.now()
      }, {
        userId: playerRef.current.userId,
        metadata: {
          playerId: playerRef.current.id,
          characterName: playerRef.current.characterName,
          characterClass: playerRef.current.characterClass,
          level: playerRef.current.level,
          faction: playerRef.current.faction
        }
      });
    } catch (error) {
      console.error('Failed to send chat message:', error);
    }
  }, []);

  // Update player position
  const updatePlayerPosition = useCallback(async (x: number, y: number) => {
    if (!channelRef.current) return;

    try {
      // Update local player position
      playerRef.current.positionX = x;
      playerRef.current.positionY = y;
      
      // Save updated position to localStorage
      const savedCharacter = localStorage.getItem(`mmo_character_${playerRef.current.userId}`);
      if (savedCharacter) {
        const character = JSON.parse(savedCharacter);
        character.positionX = x;
        character.positionY = y;
        character.lastSeen = new Date().toISOString();
        localStorage.setItem(`mmo_character_${playerRef.current.userId}`, JSON.stringify(character));
      }

      await channelRef.current.publish('player-action', {
        action: 'move',
        positionX: x,
        positionY: y,
        timestamp: Date.now()
      }, {
        userId: playerRef.current.userId,
        metadata: {
          playerId: playerRef.current.id,
          characterName: playerRef.current.characterName,
          characterClass: playerRef.current.characterClass,
          level: playerRef.current.level,
          faction: playerRef.current.faction,
          health: playerRef.current.health,
          mana: playerRef.current.mana,
          maxHealth: playerRef.current.maxHealth,
          maxMana: playerRef.current.maxMana,
          experience: playerRef.current.experience,
          positionX: x,
          positionY: y,
          appearance: playerRef.current.appearance,
          isOnline: true
        }
      });
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  }, []);

  // Use skill
  const useSkill = useCallback(async (skillId: string, targetId?: string) => {
    if (!channelRef.current) return;

    try {
      await channelRef.current.publish('player-action', {
        action: 'skill',
        skillId,
        targetId,
        timestamp: Date.now()
      }, {
        userId: playerRef.current.userId,
        metadata: {
          playerId: playerRef.current.id,
          characterName: playerRef.current.characterName,
          characterClass: playerRef.current.characterClass
        }
      });
    } catch (error) {
      console.error('Failed to use skill:', error);
    }
  }, []);

  // Update player stats (health, mana, etc.)
  const updatePlayerStats = useCallback(async (stats: Partial<Pick<Player, 'health' | 'mana' | 'level'>>) => {
    if (!channelRef.current) return;

    try {
      await channelRef.current.publish('player-action', {
        action: 'stats-update',
        stats,
        timestamp: Date.now()
      }, {
        userId: playerRef.current.userId,
        metadata: {
          playerId: playerRef.current.id,
          characterName: playerRef.current.characterName,
          ...stats
        }
      });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }, []);

  // Start PvP combat
  const initiateCombat = useCallback(async (targetPlayerId: string) => {
    if (!channelRef.current) return;

    try {
      await channelRef.current.publish('combat', {
        action: 'initiate',
        attackerId: playerRef.current.id,
        defenderId: targetPlayerId,
        timestamp: Date.now()
      }, {
        userId: playerRef.current.userId,
        metadata: {
          playerId: playerRef.current.id,
          characterName: playerRef.current.characterName,
          characterClass: playerRef.current.characterClass
        }
      });
    } catch (error) {
      console.error('Failed to initiate combat:', error);
    }
  }, []);

  return {
    ...state,
    sendChatMessage,
    updatePlayerPosition,
    useSkill,
    updatePlayerStats,
    initiateCombat
  };
}