import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Heart, Sword, User } from 'lucide-react';
import { Player, CharacterAppearance } from '../types/game';
import { CharacterCustomization } from './CharacterCustomization';
import { Character3DPreview } from './Character3DPreview';

interface CharacterSelectionProps {
  onCharacterCreate: (character: Omit<Player, 'id' | 'userId' | 'createdAt' | 'lastSeen'>) => void;
}

const CHARACTER_CLASSES = [
  {
    id: 'healer',
    name: 'Healer',
    description: 'Masters of restoration magic, keeping allies alive in battle',
    icon: Heart,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    stats: { health: 80, mana: 120, damage: 'Low', healing: 'High' }
  },
  {
    id: 'tank',
    name: 'Tank',
    description: 'Heavily armored warriors who protect their allies',
    icon: Shield,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    stats: { health: 150, mana: 60, damage: 'Medium', healing: 'None' }
  },
  {
    id: 'dps',
    name: 'DPS',
    description: 'Swift damage dealers who eliminate enemies quickly',
    icon: Sword,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    stats: { health: 100, mana: 80, damage: 'High', healing: 'None' }
  }
] as const;

const FACTIONS = [
  { id: 'alliance', name: 'Alliance', color: 'text-blue-300' },
  { id: 'horde', name: 'Horde', color: 'text-red-300' },
  { id: 'neutral', name: 'Neutral', color: 'text-gray-300' }
] as const;

export function CharacterSelection({ onCharacterCreate }: CharacterSelectionProps) {
  const [characterName, setCharacterName] = useState('');
  const [selectedClass, setSelectedClass] = useState<'healer' | 'tank' | 'dps' | ''>('');
  const [selectedFaction, setSelectedFaction] = useState<'alliance' | 'horde' | 'neutral'>('neutral');
  const [appearance, setAppearance] = useState<CharacterAppearance>({
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
  });

  const handleCreateCharacter = () => {
    if (!characterName.trim() || !selectedClass) return;

    const classData = CHARACTER_CLASSES.find(c => c.id === selectedClass)!;
    
    onCharacterCreate({
      characterName: characterName.trim(),
      characterClass: selectedClass,
      level: 1,
      health: classData.stats.health,
      mana: classData.stats.mana,
      maxHealth: classData.stats.health,
      maxMana: classData.stats.mana,
      experience: 0,
      faction: selectedFaction,
      positionX: 400,
      positionY: 300,
      isOnline: true,
      appearance
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Your Character</h1>
          <p className="text-slate-300">Choose your class, customize your appearance, and enter the world of adventure</p>
        </div>

        <Tabs defaultValue="class" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 mb-8">
            <TabsTrigger value="class" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Class Selection
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-purple-600">
              <User className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="finalize" className="data-[state=active]:bg-purple-600">
              <Sword className="w-4 h-4 mr-2" />
              Finalize
            </TabsTrigger>
          </TabsList>

          {/* Class Selection Tab */}
          <TabsContent value="class" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {CHARACTER_CLASSES.map((charClass) => {
                const Icon = charClass.icon;
                const isSelected = selectedClass === charClass.id;
                
                return (
                  <Card 
                    key={charClass.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-purple-400 bg-slate-800/80' 
                        : 'bg-slate-800/40 hover:bg-slate-800/60'
                    }`}
                    onClick={() => setSelectedClass(charClass.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`p-4 rounded-lg ${charClass.bgColor}`}>
                          <Icon className={`w-8 h-8 ${charClass.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{charClass.name}</CardTitle>
                          <CardDescription className="text-slate-300">
                            {charClass.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <span className="text-slate-400 block">Health</span>
                          <span className="text-white text-lg font-semibold">{charClass.stats.health}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block">Mana</span>
                          <span className="text-white text-lg font-semibold">{charClass.stats.mana}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block">Damage</span>
                          <Badge variant="outline" className="text-xs">
                            {charClass.stats.damage}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-400 block">Healing</span>
                          <Badge variant="outline" className="text-xs">
                            {charClass.stats.healing}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <CharacterCustomization
              appearance={appearance}
              onAppearanceChange={setAppearance}
            />
          </TabsContent>

          {/* Finalize Tab */}
          <TabsContent value="finalize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Character Summary */}
              <Card className="bg-slate-800/40">
                <CardHeader>
                  <CardTitle className="text-white">Character Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="characterName" className="text-slate-300">Character Name</Label>
                    <Input
                      id="characterName"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder="Enter your character name"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Faction</Label>
                    <Select value={selectedFaction} onValueChange={(value: 'alliance' | 'horde' | 'neutral') => setSelectedFaction(value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {FACTIONS.map((faction) => (
                          <SelectItem key={faction.id} value={faction.id} className="text-white hover:bg-slate-700">
                            <span className={faction.color}>{faction.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClass && (
                    <div className="pt-4 border-t border-slate-600">
                      <h3 className="text-white font-medium mb-2">Selected Class</h3>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const classData = CHARACTER_CLASSES.find(c => c.id === selectedClass)!;
                          const Icon = classData.icon;
                          return (
                            <>
                              <div className={`p-2 rounded-lg ${classData.bgColor}`}>
                                <Icon className={`w-5 h-5 ${classData.color}`} />
                              </div>
                              <div>
                                <p className="text-white font-medium">{classData.name}</p>
                                <p className="text-slate-400 text-sm">{classData.description}</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-600">
                    <h3 className="text-white font-medium mb-2">Character Appearance</h3>
                    <div className="text-sm text-slate-300 space-y-1">
                      <p><span className="text-slate-400">Race:</span> {appearance.race.charAt(0).toUpperCase() + appearance.race.slice(1)}</p>
                      <p><span className="text-slate-400">Gender:</span> {appearance.gender.charAt(0).toUpperCase() + appearance.gender.slice(1)}</p>
                      <p><span className="text-slate-400">Body Type:</span> {appearance.bodyType}/5</p>
                      <p><span className="text-slate-400">Face Type:</span> {appearance.faceType}/6</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateCharacter}
                    disabled={!characterName.trim() || !selectedClass}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    Create Character
                  </Button>
                </CardContent>
              </Card>

              {/* Final Preview */}
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-xl font-semibold text-white">Final Preview</h3>
                <div className="bg-slate-800/40 p-6 rounded-lg">
                  <div className="text-center space-y-2 mb-4">
                    <h4 className="text-lg font-medium text-white">
                      {characterName || 'Unnamed Character'}
                    </h4>
                    <p className="text-slate-300">
                      {selectedClass ? CHARACTER_CLASSES.find(c => c.id === selectedClass)?.name : 'No Class Selected'}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {FACTIONS.find(f => f.id === selectedFaction)?.name} • {appearance.race.charAt(0).toUpperCase() + appearance.race.slice(1)} {appearance.gender}
                    </p>
                  </div>
                  <Character3DPreview appearance={appearance} className="scale-75" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}