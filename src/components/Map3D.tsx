import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GameMap, Dungeon, Player, SafeZone, Landmark } from '../types/game';
import { generateGameMap } from '../data/dungeons';
import { MapPin, Users, Sword, Shield, Heart, Crown } from 'lucide-react';

interface Map3DProps {
  currentPlayer: Player;
  onlinePlayers: Player[];
  onDungeonEnter: (dungeon: Dungeon) => void;
  onPlayerMove: (x: number, z: number) => void;
}

// Terrain component
function Terrain({ gameMap }: { gameMap: GameMap }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(gameMap.size.width, gameMap.size.depth, 199, 199);
    const vertices = geo.attributes.position.array as Float32Array;
    
    // Apply height map
    for (let i = 0; i < vertices.length; i += 3) {
      const x = Math.floor((vertices[i] + gameMap.size.width / 2) / (gameMap.size.width / 200));
      const z = Math.floor((vertices[i + 2] + gameMap.size.depth / 2) / (gameMap.size.depth / 200));
      
      if (x >= 0 && x < 200 && z >= 0 && z < 200) {
        vertices[i + 1] = gameMap.terrain.heightMap[x]?.[z] || 0;
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [gameMap]);

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshLambertMaterial color="#4a5568" wireframe={false} />
    </mesh>
  );
}

// Biome component
function Biomes({ gameMap }: { gameMap: GameMap }) {
  return (
    <>
      {gameMap.terrain.biomes.map((biome) => (
        <mesh
          key={biome.id}
          position={[
            biome.area.x + biome.area.width / 2,
            5,
            biome.area.y + biome.area.height / 2
          ]}
        >
          <planeGeometry args={[biome.area.width, biome.area.height]} />
          <meshBasicMaterial color={biome.color} transparent opacity={0.3} />
        </mesh>
      ))}
    </>
  );
}

// Dungeon marker component
function DungeonMarker({ dungeon, onClick }: { dungeon: Dungeon; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.position.y = dungeon.position.y + Math.sin(state.clock.elapsedTime * 2) * 2;
    }
  });

  const getDifficultyColor = (level: number) => {
    if (level <= 50) return '#22c55e'; // Green - Beginner
    if (level <= 100) return '#eab308'; // Yellow - Novice
    if (level <= 200) return '#f97316'; // Orange - Intermediate
    if (level <= 300) return '#dc2626'; // Red - Advanced
    if (level <= 400) return '#8b5cf6'; // Purple - Expert
    return '#ec4899'; // Pink - Legendary
  };

  return (
    <group position={[dungeon.position.x, dungeon.position.y, dungeon.position.z]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <coneGeometry args={[50, 100, 6]} />
        <meshPhongMaterial 
          color={getDifficultyColor(dungeon.level)} 
          emissive={hovered ? getDifficultyColor(dungeon.level) : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {/* Dungeon info */}
      <Html distanceFactor={10}>
        <div className={`
          bg-slate-800/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap
          transition-all duration-200 pointer-events-none
          ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <div className="font-medium">{dungeon.name}</div>
          <div className="text-slate-300">Level {dungeon.level}</div>
          <div className="text-slate-400">{dungeon.playersInside.length} players inside</div>
        </div>
      </Html>
      
      {/* Level indicator */}
      <Text
        position={[0, 120, 0]}
        fontSize={30}
        color={getDifficultyColor(dungeon.level)}
        anchorX="center"
        anchorY="middle"
      >
        {dungeon.level}
      </Text>
    </group>
  );
}

// Player marker component
function PlayerMarker({ player, isCurrentPlayer }: { player: Player; isCurrentPlayer: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isCurrentPlayer) {
      meshRef.current.position.y = 20 + Math.sin(state.clock.elapsedTime * 3) * 5;
    }
  });

  const getClassColor = (characterClass: string) => {
    switch (characterClass) {
      case 'healer': return '#22c55e';
      case 'tank': return '#3b82f6';
      case 'dps': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case 'alliance': return '#3b82f6';
      case 'horde': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <group position={[player.positionX * 100 - 50000, 0, player.positionY * 100 - 50000]}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[15, 15, 30, 8]} />
        <meshPhongMaterial color={getClassColor(player.characterClass)} />
      </mesh>
      
      {/* Faction ring */}
      <mesh position={[0, 5, 0]}>
        <torusGeometry args={[25, 3, 8, 16]} />
        <meshBasicMaterial color={getFactionColor(player.faction)} />
      </mesh>
      
      {/* Player info */}
      <Html distanceFactor={10}>
        <div className={`
          bg-slate-800/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap
          ${isCurrentPlayer ? 'border border-purple-400' : ''}
        `}>
          <div className="font-medium">{player.characterName}</div>
          <div className="text-slate-300">Lv.{player.level} {player.characterClass}</div>
          <div className="text-slate-400">{player.faction}</div>
        </div>
      </Html>
      
      {isCurrentPlayer && (
        <mesh position={[0, 60, 0]}>
          <sphereGeometry args={[5]} />
          <meshBasicMaterial color="#8b5cf6" />
        </mesh>
      )}
    </group>
  );
}

// Safe zone component
function SafeZoneMarker({ safeZone }: { safeZone: SafeZone }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'town': return '#22c55e';
      case 'outpost': return '#eab308';
      case 'sanctuary': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <group position={[safeZone.position.x, safeZone.position.y, safeZone.position.z]}>
      {/* Safe zone boundary */}
      <mesh>
        <cylinderGeometry args={[safeZone.radius, safeZone.radius, 10, 32]} />
        <meshBasicMaterial 
          color={getZoneColor(safeZone.type)} 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Central marker */}
      <mesh ref={meshRef} position={[0, 50, 0]} castShadow>
        <octahedronGeometry args={[30]} />
        <meshPhongMaterial color={getZoneColor(safeZone.type)} />
      </mesh>
      
      {/* Zone info */}
      <Html distanceFactor={10}>
        <div className="bg-slate-800/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          <div className="font-medium">{safeZone.name}</div>
          <div className="text-slate-300 capitalize">{safeZone.type}</div>
        </div>
      </Html>
    </group>
  );
}

// Landmark component
function LandmarkMarker({ landmark }: { landmark: Landmark }) {
  const getGeometry = (type: string, size: number) => {
    switch (type) {
      case 'mountain':
        return <coneGeometry args={[size, size * 2, 8]} />;
      case 'tower':
        return <cylinderGeometry args={[size * 0.3, size * 0.5, size * 3, 8]} />;
      case 'lake':
        return <cylinderGeometry args={[size, size, 5, 32]} />;
      case 'forest':
        return <sphereGeometry args={[size]} />;
      case 'ruins':
        return <boxGeometry args={[size, size * 0.5, size]} />;
      default:
        return <boxGeometry args={[size, size, size]} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'mountain': return '#6b7280';
      case 'tower': return '#8b5cf6';
      case 'lake': return '#3b82f6';
      case 'forest': return '#22c55e';
      case 'ruins': return '#a3a3a3';
      default: return '#6b7280';
    }
  };

  return (
    <group position={[landmark.position.x, landmark.position.y, landmark.position.z]}>
      <mesh castShadow>
        {getGeometry(landmark.type, landmark.size)}
        <meshPhongMaterial color={getColor(landmark.type)} />
      </mesh>
      
      <Html distanceFactor={15}>
        <div className="bg-slate-800/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          <div className="font-medium">{landmark.name}</div>
          <div className="text-slate-300 capitalize">{landmark.type}</div>
        </div>
      </Html>
    </group>
  );
}

// Camera controller
function CameraController({ currentPlayer }: { currentPlayer: Player }) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Follow current player
    const playerX = currentPlayer.positionX * 100 - 50000;
    const playerZ = currentPlayer.positionY * 100 - 50000;
    
    camera.position.set(playerX, 1000, playerZ + 500);
    camera.lookAt(playerX, 0, playerZ);
  }, [camera, currentPlayer.positionX, currentPlayer.positionY]);
  
  return null;
}

export function Map3D({ currentPlayer, onlinePlayers, onDungeonEnter, onPlayerMove }: Map3DProps) {
  const [gameMap] = useState<GameMap>(() => generateGameMap());
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);

  const handleDungeonClick = (dungeon: Dungeon) => {
    setSelectedDungeon(dungeon);
  };

  const handleEnterDungeon = () => {
    if (selectedDungeon) {
      onDungeonEnter(selectedDungeon);
      setSelectedDungeon(null);
    }
  };

  const handleMapClick = (event: any) => {
    if (event.point) {
      const x = (event.point.x + 50000) / 100;
      const z = (event.point.z + 50000) / 100;
      onPlayerMove(Math.max(0, Math.min(800, x)), Math.max(0, Math.min(600, z)));
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1000, 500], fov: 60 }}
        onClick={handleMapClick}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[1000, 1000, 500]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={10000}
          shadow-camera-left={-5000}
          shadow-camera-right={5000}
          shadow-camera-top={5000}
          shadow-camera-bottom={-5000}
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={5000}
          minDistance={100}
        />
        
        {/* Camera controller */}
        <CameraController currentPlayer={currentPlayer} />
        
        {/* Terrain */}
        <Terrain gameMap={gameMap} />
        
        {/* Biomes */}
        <Biomes gameMap={gameMap} />
        
        {/* Dungeons */}
        {gameMap.dungeons.map((dungeon) => (
          <DungeonMarker
            key={dungeon.id}
            dungeon={dungeon}
            onClick={() => handleDungeonClick(dungeon)}
          />
        ))}
        
        {/* Players */}
        {onlinePlayers.map((player) => (
          <PlayerMarker
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === currentPlayer.id}
          />
        ))}
        
        {/* Safe zones */}
        {gameMap.safeZones.map((safeZone) => (
          <SafeZoneMarker key={safeZone.id} safeZone={safeZone} />
        ))}
        
        {/* Landmarks */}
        {gameMap.terrain.landmarks.map((landmark) => (
          <LandmarkMarker key={landmark.id} landmark={landmark} />
        ))}
      </Canvas>
      
      {/* UI Overlays */}
      <div className="absolute top-4 left-4 bg-slate-800/90 rounded-lg p-4 text-white max-w-sm">
        <h3 className="font-bold text-lg mb-2">100km² World Map</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Beginner (1-50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Novice (51-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Intermediate (101-200)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Advanced (201-300)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Expert (301-400)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded"></div>
            <span>Legendary (401+)</span>
          </div>
        </div>
      </div>
      
      {/* Map stats */}
      <div className="absolute top-4 right-4 bg-slate-800/90 rounded-lg p-4 text-white">
        <h4 className="font-bold mb-2">Map Statistics</h4>
        <div className="space-y-1 text-sm">
          <div>Total Dungeons: {gameMap.dungeons.length}</div>
          <div>Online Players: {onlinePlayers.length}</div>
          <div>Safe Zones: {gameMap.safeZones.length}</div>
          <div>Landmarks: {gameMap.terrain.landmarks.length}</div>
        </div>
      </div>
      
      {/* Dungeon selection modal */}
      {selectedDungeon && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-lg p-6 text-white max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{selectedDungeon.name}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-medium">{selectedDungeon.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Floors:</span>
                <span className="font-medium">{selectedDungeon.floors.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Players Inside:</span>
                <span className="font-medium">{selectedDungeon.playersInside.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${
                  selectedDungeon.isActive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedDungeon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleEnterDungeon}
                disabled={!selectedDungeon.isActive || currentPlayer.level < selectedDungeon.level}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded font-medium transition-colors"
              >
                Enter Dungeon
              </button>
              <button
                onClick={() => setSelectedDungeon(null)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
            
            {currentPlayer.level < selectedDungeon.level && (
              <p className="text-red-400 text-sm mt-2">
                You need to be level {selectedDungeon.level} to enter this dungeon.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}