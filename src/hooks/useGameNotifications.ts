import { useState, useCallback } from 'react';

export interface GameNotification {
  id: string;
  type: 'combat-challenge' | 'guild-invite' | 'system' | 'achievement';
  title: string;
  message: string;
  fromPlayer?: string;
  actions?: {
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive' | 'outline';
  }[];
  autoClose?: number; // milliseconds
}

// Hook for managing game notifications
export function useGameNotifications() {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);

  const addNotification = useCallback((notification: Omit<GameNotification, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper functions for common notification types
  const showCombatChallenge = useCallback((fromPlayer: string, onAccept: () => void, onDecline: () => void) => {
    addNotification({
      type: 'combat-challenge',
      title: 'PvP Challenge!',
      message: `${fromPlayer} has challenged you to combat!`,
      fromPlayer,
      actions: [
        {
          label: 'Accept',
          action: onAccept,
          variant: 'destructive'
        },
        {
          label: 'Decline',
          action: onDecline,
          variant: 'outline'
        }
      ]
    });
  }, [addNotification]);

  const showGuildInvite = useCallback((guildName: string, fromPlayer: string, onAccept: () => void, onDecline: () => void) => {
    addNotification({
      type: 'guild-invite',
      title: 'Guild Invitation',
      message: `You've been invited to join "${guildName}"`,
      fromPlayer,
      actions: [
        {
          label: 'Join',
          action: onAccept
        },
        {
          label: 'Decline',
          action: onDecline,
          variant: 'outline'
        }
      ]
    });
  }, [addNotification]);

  const showSystemMessage = useCallback((title: string, message: string, autoClose = 5000) => {
    addNotification({
      type: 'system',
      title,
      message,
      autoClose
    });
  }, [addNotification]);

  const showAchievement = useCallback((title: string, message: string, autoClose = 8000) => {
    addNotification({
      type: 'achievement',
      title,
      message,
      autoClose
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    showCombatChallenge,
    showGuildInvite,
    showSystemMessage,
    showAchievement
  };
}