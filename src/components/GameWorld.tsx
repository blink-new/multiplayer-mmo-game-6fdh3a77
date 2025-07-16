import { useEffect, useRef, useState } from 'react';
import { Player, Dungeon } from '../types/game';
import { Heart, Shield, Sword, Map, Globe } from 'lucide-react';
import { Map3D } from './Map3D';
import { DungeonInterface } from './DungeonInterface';

interface GameWorldProps {
  currentPlayer: Player;
  onlinePlayers: Player[];
  onPlayerMove: (x: number, y: number) => void;
}

export function GameWorld({ currentPlayer, onlinePlayers, onPlayerMove }: GameWorldProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [currentDungeon, setCurrentDungeon] = useState<Dungeon | null>(null);

  const getClassIcon = (characterClass: string) => {
    switch (characterClass) {
      case 'healer': return Heart;
      case 'tank': return Shield;
      case 'dps': return Sword;
      default: return Sword;
    }
  };

  const getClassColor = (characterClass: string) => {
    switch (characterClass) {
      case 'healer': return 'text-green-400 bg-green-400/20 border-green-400';
      case 'tank': return 'text-blue-400 bg-blue-400/20 border-blue-400';
      case 'dps': return 'text-red-400 bg-red-400/20 border-red-400';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Only move if significant movement
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      const newX = Math.max(0, Math.min(800, currentPlayer.positionX + deltaX * 0.5));
      const newY = Math.max(0, Math.min(600, currentPlayer.positionY + deltaY * 0.5));
      
      onPlayerMove(newX, newY);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onPlayerMove(x, y);
  };

  const handleDungeonEnter = (dungeon: Dungeon) => {
    setCurrentDungeon(dungeon);
  };

  const handleDungeonExit = () => {
    setCurrentDungeon(null);
  };

  const handleFloorComplete = (floorId: string) => {
    console.log('Floor completed:', floorId);
  };

  const handleBossDefeated = (bossId: string, loot: any[]) => {
    console.log('Boss defeated:', bossId, 'Loot:', loot);
  };

  const handleEnemyDefeated = (enemyId: string, loot: any[]) => {
    console.log('Enemy defeated:', enemyId, 'Loot:', loot);
  };

  // If in dungeon, show dungeon interface
  if (currentDungeon) {
    return (
      <DungeonInterface
        dungeon={currentDungeon}
        currentPlayer={currentPlayer}
        onExitDungeon={handleDungeonExit}
        onFloorComplete={handleFloorComplete}
        onBossDefeated={handleBossDefeated}
        onEnemyDefeated={handleEnemyDefeated}
      />
    );
  }

  return (
    <div className="flex-1 bg-slate-800/20 relative overflow-hidden">
      {/* View Mode Toggle */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setViewMode('2d')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            viewMode === '2d' 
              ? 'bg-purple-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Map className="w-4 h-4 mr-1 inline" />
          2D View
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            viewMode === '3d' 
              ? 'bg-purple-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Globe className="w-4 h-4 mr-1 inline" />
          3D Map
        </button>
      </div>

      {viewMode === '3d' ? (
        <Map3D
          currentPlayer={currentPlayer}
          onlinePlayers={onlinePlayers}
          onDungeonEnter={handleDungeonEnter}
          onPlayerMove={onPlayerMove}
        />
      ) : (
        <div 
          ref={canvasRef}
          className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-green-900/20 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

        {/* Game world elements */}
        <div className="absolute inset-0">
          {/* Render all online players including current player */}
          {[currentPlayer, ...onlinePlayers.filter(p => p.id !== currentPlayer.id)].map((player) => {
            const Icon = getClassIcon(player.characterClass);
            const isCurrentPlayer = player.id === currentPlayer.id;
            const colors = getClassColor(player.characterClass);
            
            return (
              <div
                key={player.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isCurrentPlayer ? 'z-20' : 'z-10'
                }`}
                style={{
                  left: `${player.positionX}px`,
                  top: `${player.positionY}px`,
                }}
              >
                {/* Player avatar */}
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  ${colors}
                  ${isCurrentPlayer ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900' : ''}
                  ${isDragging && isCurrentPlayer ? 'scale-110' : 'hover:scale-105'}
                  transition-all duration-200 cursor-pointer
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Player name and info */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center">
                  <div className={`
                    px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                    ${isCurrentPlayer ? 'bg-purple-600 text-white' : 'bg-slate-800/80 text-slate-200'}
                  `}>
                    {player.characterName}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Lv.{player.level} {player.characterClass}
                  </div>
                  
                  {/* Health bar */}
                  {player.health !== undefined && player.maxHealth && (
                    <div className="mt-1 w-16 h-1 bg-slate-600 rounded-full overflow-hidden mx-auto">
                      <div 
                        className="h-full bg-red-400 transition-all duration-300"
                        style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Faction indicator */}
                <div className={`
                  absolute -top-2 -right-2 w-4 h-4 rounded-full border flex items-center justify-center text-xs font-bold
                  ${player.faction === 'alliance' ? 'bg-blue-600 border-blue-400 text-white' : 
                    player.faction === 'horde' ? 'bg-red-600 border-red-400 text-white' : 
                    'bg-gray-600 border-gray-400 text-white'}
                `}>
                  {player.faction.charAt(0).toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions overlay */}
        <div className="absolute top-4 left-4 bg-slate-800/80 rounded-lg p-3 text-sm text-slate-300">
          <p className="font-medium text-white mb-1">Game World</p>
          <p>• Click to move your character</p>
          <p>• Drag to move continuously</p>
          <p>• Challenge other faction players</p>
        </div>

        {/* Mini-map */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-800/80 rounded border border-slate-600">
          <div className="relative w-full h-full overflow-hidden">
            <div className="text-xs text-slate-400 p-1 border-b border-slate-600">Mini-map</div>
            <div className="relative flex-1 p-1">
              {[currentPlayer, ...onlinePlayers.filter(p => p.id !== currentPlayer.id)].map((player) => {
                const isCurrentPlayer = player.id === currentPlayer.id;
                return (
                  <div
                    key={player.id}
                    className={`absolute w-2 h-2 rounded-full ${
                      isCurrentPlayer ? 'bg-purple-400' : 
                      player.faction === 'alliance' ? 'bg-blue-400' :
                      player.faction === 'horde' ? 'bg-red-400' : 'bg-gray-400'
                    }`}
                    style={{
                      left: `${(player.positionX / 800) * 100}%`,
                      top: `${(player.positionY / 600) * 80}%`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}