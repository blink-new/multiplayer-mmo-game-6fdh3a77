import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Shuffle, RotateCcw } from 'lucide-react';
import { CharacterAppearance } from '../types/game';
import { Character3DPreview } from './Character3DPreview';

interface CharacterCustomizationProps {
  appearance: CharacterAppearance;
  onAppearanceChange: (appearance: CharacterAppearance) => void;
  className?: string;
}

const RACES = [
  { id: 'human', name: 'Human', description: 'Versatile and adaptable' },
  { id: 'elf', name: 'Elf', description: 'Graceful and magical' },
  { id: 'dwarf', name: 'Dwarf', description: 'Strong and resilient' },
  { id: 'orc', name: 'Orc', description: 'Powerful and fierce' },
  { id: 'undead', name: 'Undead', description: 'Dark and mysterious' },
  { id: 'troll', name: 'Troll', description: 'Large and intimidating' }
] as const;

const HAIR_COLORS = [
  '#2C1810', '#8B4513', '#D2691E', '#DAA520', '#FFD700',
  '#FF6347', '#DC143C', '#800080', '#4B0082', '#000000',
  '#696969', '#C0C0C0', '#FFFFFF', '#228B22', '#0000FF'
];

const EYE_COLORS = [
  '#8B4513', '#654321', '#2E8B57', '#4682B4', '#6495ED',
  '#9370DB', '#32CD32', '#FFD700', '#FF6347', '#DC143C'
];

const SKIN_COLORS = [
  '#FDBCB4', '#EEA2A2', '#DDB7AB', '#CC9966', '#E6B800',
  '#8D5524', '#C68642', '#E0AC69', '#F1C27D', '#FFDBAC',
  '#4a5d23', '#2d4016', '#8B7355', '#A0522D', '#D2B48C'
];

const HAIRSTYLE_NAMES = [
  'Bald', 'Short', 'Long', 'Spiky', 'Ponytail', 'Sides Only',
  'Curly', 'Braided', 'Mohawk', 'Wavy'
];

const MOUTH_TYPES = [
  'Neutral', 'Smile', 'Serious', 'Frown', 'Open Smile',
  'Smirk', 'Grin', 'Pout'
];

const BEARD_STYLES = [
  'None', 'Goatee', 'Full Beard', 'Mustache', 'Long Beard',
  'Braided', 'Stubble', 'Soul Patch', 'Handlebar'
];

export function CharacterCustomization({ appearance, onAppearanceChange, className = '' }: CharacterCustomizationProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'face' | 'hair' | 'colors'>('basic');

  const updateAppearance = (updates: Partial<CharacterAppearance>) => {
    onAppearanceChange({ ...appearance, ...updates });
  };

  const randomizeAppearance = () => {
    const randomAppearance: CharacterAppearance = {
      race: RACES[Math.floor(Math.random() * RACES.length)].id as any,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      hairstyle: Math.floor(Math.random() * 10) + 1,
      eyeColor: EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)],
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      skinColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
      mouthType: Math.floor(Math.random() * 8) + 1,
      beardStyle: Math.floor(Math.random() * 9),
      beardColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      bodyType: Math.floor(Math.random() * 5) + 1,
      faceType: Math.floor(Math.random() * 6) + 1
    };
    onAppearanceChange(randomAppearance);
  };

  const resetToDefault = () => {
    const defaultAppearance: CharacterAppearance = {
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
    };
    onAppearanceChange(defaultAppearance);
  };

  const ColorPicker = ({ colors, value, onChange, label }: {
    colors: string[];
    value: string;
    onChange: (color: string) => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === color ? 'border-purple-400 scale-110' : 'border-slate-600 hover:border-slate-400'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* 3D Preview */}
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-semibold text-white">Character Preview</h3>
        <Character3DPreview appearance={appearance} />
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={randomizeAppearance}
            variant="outline"
            size="sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Randomize
          </Button>
          <Button
            onClick={resetToDefault}
            variant="outline"
            size="sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Customization Panel */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Customize Appearance</h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
          {[
            { id: 'basic', label: 'Basic' },
            { id: 'face', label: 'Face' },
            { id: 'hair', label: 'Hair & Beard' },
            { id: 'colors', label: 'Colors' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="bg-slate-800/40 border-slate-600">
          <CardContent className="p-6 space-y-6">
            {/* Basic Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-300">Race</Label>
                  <Select value={appearance.race} onValueChange={(value: any) => updateAppearance({ race: value })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {RACES.map((race) => (
                        <SelectItem key={race.id} value={race.id} className="text-white hover:bg-slate-700">
                          <div>
                            <div className="font-medium">{race.name}</div>
                            <div className="text-sm text-slate-400">{race.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Gender</Label>
                  <Select value={appearance.gender} onValueChange={(value: any) => updateAppearance({ gender: value })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="male" className="text-white hover:bg-slate-700">Male</SelectItem>
                      <SelectItem value="female" className="text-white hover:bg-slate-700">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Body Type: {appearance.bodyType}</Label>
                  <Slider
                    value={[appearance.bodyType]}
                    onValueChange={([value]) => updateAppearance({ bodyType: value })}
                    min={1}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Slim</span>
                    <span>Average</span>
                    <span>Muscular</span>
                  </div>
                </div>
              </div>
            )}

            {/* Face Tab */}
            {activeTab === 'face' && (
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-300">Face Shape: {appearance.faceType}</Label>
                  <Slider
                    value={[appearance.faceType]}
                    onValueChange={([value]) => updateAppearance({ faceType: value })}
                    min={1}
                    max={6}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Round</span>
                    <span>Square</span>
                    <span>Oval</span>
                  </div>
                </div>

                <div>
                  <Label className="text-slate-300">Mouth Type</Label>
                  <Select 
                    value={appearance.mouthType.toString()} 
                    onValueChange={(value) => updateAppearance({ mouthType: parseInt(value) })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {MOUTH_TYPES.map((mouth, index) => (
                        <SelectItem key={index} value={(index + 1).toString()} className="text-white hover:bg-slate-700">
                          {mouth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Hair & Beard Tab */}
            {activeTab === 'hair' && (
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-300">Hairstyle</Label>
                  <Select 
                    value={appearance.hairstyle.toString()} 
                    onValueChange={(value) => updateAppearance({ hairstyle: parseInt(value) })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {HAIRSTYLE_NAMES.map((style, index) => (
                        <SelectItem key={index} value={index.toString()} className="text-white hover:bg-slate-700">
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Beard Style</Label>
                  <Select 
                    value={appearance.beardStyle.toString()} 
                    onValueChange={(value) => updateAppearance({ beardStyle: parseInt(value) })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {BEARD_STYLES.map((style, index) => (
                        <SelectItem key={index} value={index.toString()} className="text-white hover:bg-slate-700">
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <ColorPicker
                  colors={SKIN_COLORS}
                  value={appearance.skinColor}
                  onChange={(color) => updateAppearance({ skinColor: color })}
                  label="Skin Color"
                />

                <Separator className="bg-slate-600" />

                <ColorPicker
                  colors={EYE_COLORS}
                  value={appearance.eyeColor}
                  onChange={(color) => updateAppearance({ eyeColor: color })}
                  label="Eye Color"
                />

                <Separator className="bg-slate-600" />

                <ColorPicker
                  colors={HAIR_COLORS}
                  value={appearance.hairColor}
                  onChange={(color) => updateAppearance({ hairColor: color })}
                  label="Hair Color"
                />

                {appearance.beardStyle > 0 && (
                  <>
                    <Separator className="bg-slate-600" />
                    <ColorPicker
                      colors={HAIR_COLORS}
                      value={appearance.beardColor}
                      onChange={(color) => updateAppearance({ beardColor: color })}
                      label="Beard Color"
                    />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}