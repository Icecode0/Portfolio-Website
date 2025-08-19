'use client';

import { memo, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { DinosaurData } from './types';

interface ModelProps {
  colors: string[];
  selectedPattern: string;
  selectedDino: string;
  glitchSkinValues: {
    hue: number;
    saturation: number;
    lightness: number;
  };
  DINOSAURS: Record<string, DinosaurData>;
}

const modifyTextureColors = (
  texture: THREE.Texture,
  colors: string[],
  segments: number,
  glitchValues: { hue: number; saturation: number; lightness: number }
) => {
  // Create a canvas to manipulate the texture
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  // Draw original texture to canvas
  ctx.drawImage(texture.image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert to HSL to determine which segment this color belongs to
    const hsl = rgbToHsl(r, g, b);
    const segmentIndex = Math.floor(hsl[2] * segments);
    
    if (segmentIndex < colors.length) {
      // Apply the corresponding color from the palette
      const targetColor = hexToRgb(colors[segmentIndex]);
      if (targetColor) {
        // Apply glitch values
        const glitchedColor = applyGlitchValues(
          targetColor,
          glitchValues.hue,
          glitchValues.saturation,
          glitchValues.lightness
        );
        
        data[i] = glitchedColor.r;
        data[i + 1] = glitchedColor.g;
        data[i + 2] = glitchedColor.b;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  // Create new texture from modified canvas
  const newTexture = new THREE.Texture(canvas);
  newTexture.needsUpdate = true;
  return newTexture;
};

const Model = memo<ModelProps>(({ colors, selectedPattern, selectedDino, glitchSkinValues, DINOSAURS }) => {
  const dinoData = DINOSAURS[selectedDino];
  const obj = useLoader(OBJLoader, dinoData.model);
  const normalMap = useLoader(TextureLoader, dinoData.normalMap);
  const patternTexture = useLoader(TextureLoader, dinoData.patterns[selectedPattern]);
  
  // Create material with normal map
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      normalMap: normalMap,
      normalScale: new THREE.Vector2(1, 1),
      roughness: 0.7,
      metalness: 0.3,
      map: modifyTextureColors(patternTexture, colors, 12, glitchSkinValues)
    });
  }, [normalMap, patternTexture, colors, glitchSkinValues]);

  useEffect(() => {
    obj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [obj, material]);

  return (
    <primitive 
      object={obj}
      scale={dinoData.scale}
      position={dinoData.position}
    />
  );
});

Model.displayName = 'Model';

export default Model;

// Helper functions
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  return [h, s, l];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function applyGlitchValues(
  color: { r: number; g: number; b: number },
  hueShift: number,
  saturationMult: number,
  lightnessMult: number
): { r: number; g: number; b: number } {
  const [h, s, l] = rgbToHsl(color.r, color.g, color.b);
  
  // Apply glitch transformations
  const newHue = (h + hueShift) % 1;
  const newSat = Math.max(0, Math.min(1, s * saturationMult));
  const newLight = Math.max(0, Math.min(1, l * lightnessMult));
  
  // Convert back to RGB
  return hslToRgb(newHue, newSat, newLight);
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { 
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
