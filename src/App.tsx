import { useState, useEffect } from 'react';
import { blink } from './blink/client';
import { CharacterSelection } from './components/CharacterSelection';
import { GameInterface } from './components/GameInterface';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Player } from './types/game';
import { Toaster } from './components/ui/toaster';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      setLoading(state.isLoading);
      
      // Load existing character when user is authenticated
      if (state.user && !state.isLoading) {
        const savedCharacter = localStorage.getItem(`mmo_character_${state.user.id}`);
        if (savedCharacter) {
          try {
            const character = JSON.parse(savedCharacter);
            // Update last seen timestamp
            character.lastSeen = new Date().toISOString();
            character.isOnline = true;
            setCurrentPlayer(character);
          } catch (error) {
            console.error('Failed to load saved character:', error);
          }
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleCharacterCreate = async (characterData: Omit<Player, 'id' | 'userId' | 'createdAt' | 'lastSeen'>) => {
    if (!user) return;

    try {
      const newPlayer: Player = {
        ...characterData,
        id: `player_${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      };

      // Save character to localStorage for persistence
      localStorage.setItem(`mmo_character_${user.id}`, JSON.stringify(newPlayer));
      
      setCurrentPlayer(newPlayer);
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const handleLogout = () => {
    setCurrentPlayer(null);
    blink.auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading MMO World...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Multiplayer MMO Game</h1>
          <p className="text-slate-300 mb-8">Please sign in to enter the world</p>
          <button 
            onClick={() => blink.auth.login()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In to Play
          </button>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <ErrorBoundary>
        <CharacterSelection onCharacterCreate={handleCharacterCreate} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <GameInterface player={currentPlayer} onLogout={handleLogout} />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;