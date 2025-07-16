import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Sword, Shield, Users, Crown } from 'lucide-react';
import { GameNotification } from '../hooks/useGameNotifications';

interface GameNotificationsProps {
  notifications: GameNotification[];
  onDismiss: (id: string) => void;
}

export function GameNotifications({ notifications, onDismiss }: GameNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<GameNotification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);

    // Auto-close notifications with autoClose property
    notifications.forEach(notification => {
      if (notification.autoClose) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.autoClose);
      }
    });
  }, [notifications, onDismiss]);

  const getNotificationIcon = (type: GameNotification['type']) => {
    switch (type) {
      case 'combat-challenge':
        return <Sword className="w-5 h-5 text-red-400" />;
      case 'guild-invite':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'system':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'achievement':
        return <Users className="w-5 h-5 text-green-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: GameNotification['type']) => {
    switch (type) {
      case 'combat-challenge':
        return 'border-red-400/50 bg-red-400/10';
      case 'guild-invite':
        return 'border-yellow-400/50 bg-yellow-400/10';
      case 'system':
        return 'border-blue-400/50 bg-blue-400/10';
      case 'achievement':
        return 'border-green-400/50 bg-green-400/10';
      default:
        return 'border-gray-400/50 bg-gray-400/10';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card 
          key={notification.id}
          className={`p-4 border ${getNotificationColor(notification.type)} backdrop-blur-sm animate-in slide-in-from-right-full duration-300`}
        >
          <div className="flex items-start gap-3">
            {getNotificationIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  onClick={() => onDismiss(notification.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-slate-300 text-sm mb-2">{notification.message}</p>
              
              {notification.fromPlayer && (
                <Badge variant="outline" className="text-xs mb-2">
                  From: {notification.fromPlayer}
                </Badge>
              )}
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex gap-2">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant || 'default'}
                      className="text-xs h-7"
                      onClick={() => {
                        action.action();
                        onDismiss(notification.id);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

