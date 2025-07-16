import { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterAppearance } from '../types/game';

interface Character3DPreviewProps {
  appearance: CharacterAppearance;
  className?: string;
}

export function Character3DPreview({ appearance, className = '' }: Character3DPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [rotation, setRotation] = useState(0);

  const drawCharacter3D = useCallback((ctx: CanvasRenderingContext2D, appearance: CharacterAppearance, rotation: number) => {
    const centerX = 150;
    const centerY = 200;
    
    // Apply rotation transform
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-centerX, -centerY);

    // Draw character based on race and appearance
    drawBody(ctx, appearance, centerX, centerY);
    drawHead(ctx, appearance, centerX, centerY - 80);
    drawHair(ctx, appearance, centerX, centerY - 80);
    drawFace(ctx, appearance, centerX, centerY - 80);
    drawBeard(ctx, appearance, centerX, centerY - 80);
    
    ctx.restore();
  }, []);

  const drawBody = (ctx: CanvasRenderingContext2D, appearance: CharacterAppearance, x: number, y: number) => {
    // Body shape varies by race and body type
    const bodyWidth = 40 + (appearance.bodyType * 8);
    const bodyHeight = 120;
    
    // Skin color
    ctx.fillStyle = appearance.skinColor;
    
    // Torso
    ctx.fillRect(x - bodyWidth/2, y - 20, bodyWidth, bodyHeight);
    
    // Arms
    ctx.fillRect(x - bodyWidth/2 - 15, y - 10, 15, 80);
    ctx.fillRect(x + bodyWidth/2, y - 10, 15, 80);
    
    // Legs
    ctx.fillRect(x - 20, y + bodyHeight - 20, 15, 60);
    ctx.fillRect(x + 5, y + bodyHeight - 20, 15, 60);
    
    // Add race-specific body features
    if (appearance.race === 'orc') {
      ctx.fillStyle = '#4a5d23';
      ctx.fillRect(x - bodyWidth/2, y - 20, bodyWidth, bodyHeight);
    } else if (appearance.race === 'dwarf') {
      ctx.fillRect(x - bodyWidth/2, y + 20, bodyWidth, bodyHeight - 40);
    }
  };

  const drawHead = (ctx: CanvasRenderingContext2D, appearance: CharacterAppearance, x: number, y: number) => {
    const headSize = appearance.race === 'dwarf' ? 35 : 40;
    
    // Head shape varies by face type
    ctx.fillStyle = appearance.skinColor;
    
    if (appearance.faceType <= 2) {
      // Round face
      ctx.beginPath();
      ctx.arc(x, y, headSize, 0, 2 * Math.PI);
      ctx.fill();
    } else if (appearance.faceType <= 4) {
      // Square face
      ctx.fillRect(x - headSize, y - headSize, headSize * 2, headSize * 2);
    } else {
      // Oval face
      ctx.beginPath();
      ctx.ellipse(x, y, headSize * 0.8, headSize, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Race-specific head features
    if (appearance.race === 'elf') {
      // Pointed ears
      ctx.fillStyle = appearance.skinColor;
      ctx.beginPath();
      ctx.moveTo(x - headSize, y - 10);
      ctx.lineTo(x - headSize - 15, y - 20);
      ctx.lineTo(x - headSize, y);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(x + headSize, y - 10);
      ctx.lineTo(x + headSize + 15, y - 20);
      ctx.lineTo(x + headSize, y);
      ctx.fill();
    } else if (appearance.race === 'orc') {
      // Tusks
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 8, y + 15, 4, 12);
      ctx.fillRect(x + 4, y + 15, 4, 12);
    }
  };

  const drawHair = (ctx: CanvasRenderingContext2D, appearance: CharacterAppearance, x: number, y: number) => {
    if (appearance.hairstyle === 0) return;
    
    ctx.fillStyle = appearance.hairColor;
    const headSize = appearance.race === 'dwarf' ? 35 : 40;
    
    // Different hairstyles
    switch (appearance.hairstyle) {
      case 1: // Short hair
        ctx.fillRect(x - headSize, y - headSize, headSize * 2, 20);
        break;
      case 2: // Long hair
        ctx.fillRect(x - headSize, y - headSize, headSize * 2, 30);
        ctx.fillRect(x - headSize - 5, y - headSize + 20, headSize * 2 + 10, 40);
        break;
      case 3: // Spiky hair
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(x - headSize + (i * 20), y - headSize);
          ctx.lineTo(x - headSize + (i * 20) + 10, y - headSize - 15);
          ctx.lineTo(x - headSize + (i * 20) + 20, y - headSize);
          ctx.fill();
        }
        break;
      case 4: // Ponytail
        ctx.fillRect(x - headSize, y - headSize, headSize * 2, 20);
        ctx.fillRect(x - 5, y - headSize + 20, 10, 50);
        break;
      case 5: // Bald with sides
        ctx.fillRect(x - headSize, y - headSize + 10, 15, 30);
        ctx.fillRect(x + headSize - 15, y - headSize + 10, 15, 30);
        break;
      default:
        ctx.fillRect(x - headSize, y - headSize, headSize * 2, 25);
    }
  };

  const drawFace = (ctx: CanvasRenderingContext2D, appearance: CharacterAppearance, x: number, y: number) => {
    // Eyes
    ctx.fillStyle = appearance.eyeColor;
    ctx.beginPath();
    ctx.arc(x - 12, y - 8, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 12, y - 8, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eye pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 12, y - 8, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 12, y - 8, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth based on mouth type
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    switch (appearance.mouthType) {
      case 1: // Smile
        ctx.arc(x, y + 8, 8, 0, Math.PI);
        break;
      case 2: // Neutral
        ctx.moveTo(x - 8, y + 12);
        ctx.lineTo(x + 8, y + 12);
        break;
      case 3: // Frown
        ctx.arc(x, y + 20, 8, Math.PI, 2 * Math.PI);
        break;
      case 4: // Open smile
        ctx.arc(x, y + 8, 10, 0, Math.PI);
        ctx.fillStyle = '#8B4513';
        ctx.fill();
        break;
      default:
        ctx.moveTo(x - 6, y + 12);
        ctx.lineTo(x + 6, y + 12);
    }
    ctx.stroke();
    
    // Nose
    ctx.strokeStyle = appearance.skinColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 2);
    ctx.lineTo(x - 2, y + 2);
    ctx.moveTo(x, y - 2);
    ctx.lineTo(x + 2, y + 2);
    ctx.stroke();
  };

  const drawBeard = (ctx: CanvasRenderingContext2D, appearance: CharacterAppearance, x: number, y: number) => {
    if (appearance.beardStyle === 0) return;
    
    ctx.fillStyle = appearance.beardColor;
    const headSize = appearance.race === 'dwarf' ? 35 : 40;
    
    switch (appearance.beardStyle) {
      case 1: // Goatee
        ctx.fillRect(x - 8, y + 15, 16, 20);
        break;
      case 2: // Full beard
        ctx.fillRect(x - headSize + 5, y + 10, (headSize - 5) * 2, 25);
        break;
      case 3: // Mustache
        ctx.fillRect(x - 12, y + 5, 24, 8);
        break;
      case 4: // Long beard
        ctx.fillRect(x - headSize + 5, y + 10, (headSize - 5) * 2, 40);
        break;
      case 5: // Braided beard
        ctx.fillRect(x - 6, y + 15, 12, 35);
        // Braid lines
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y + 20 + (i * 10));
          ctx.lineTo(x + 4, y + 25 + (i * 10));
          ctx.stroke();
        }
        break;
      default:
        ctx.fillRect(x - 10, y + 12, 20, 15);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas size
      canvas.width = 300;
      canvas.height = 400;
      
      // Draw 3D-style character representation
      drawCharacter3D(ctx, appearance, rotation);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [appearance, rotation, drawCharacter3D]);

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation(prev => {
      const newRotation = direction === 'left' ? prev - 15 : prev + 15;
      return newRotation % 360;
    });
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-slate-600 rounded-lg bg-gradient-to-b from-slate-700 to-slate-800"
        width={300}
        height={400}
      />
      
      {/* Rotation controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button
          onClick={() => handleRotate('left')}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
        >
          ← Rotate
        </button>
        <button
          onClick={() => handleRotate('right')}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
        >
          Rotate →
        </button>
      </div>
      
      {/* Character info overlay */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
        <div>{appearance.race.charAt(0).toUpperCase() + appearance.race.slice(1)} {appearance.gender}</div>
        <div>Face: {appearance.faceType} | Body: {appearance.bodyType}</div>
      </div>
    </div>
  );
}