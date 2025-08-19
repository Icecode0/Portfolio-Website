'use client';
import React, { Suspense, useState, useEffect, memo, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { TextureLoader, Texture } from 'three';
import { DINOSAURS } from '@/types/dinosaurs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define types for our props and state
type ColorState = {
  maleColor: string;
  highColor: string;
  midColor: string;
  mid2Color: string;
  lowColor: string;
  bottomColor: string;
  eyeColor: string;
};

type ModelProps = {
  colors: ColorState;
  selectedPattern: number;
  selectedDino: string;
  glitchSkinValues: Partial<Record<keyof ColorState, string>>;
};

type DbSkin = {
  id: string | number;
  skinName: string;
  skinJson: string;
};

type UserData = {
  id: string;
  activeSkin: string | null;
  savedSkins: DbSkin[];
  primalPoints: number;
  customSlots?: Record<string, { skin: string | null; timer: string | null }>;
};

type ColorPickerItem = {
  label: string;
  key: keyof ColorState;
};

type SkinSlot = {
  id: number;
  isActive: boolean;
  isLocked: boolean;
  isSelected: boolean;
  skin: string | null;
  timer: Date | null;
  skinName?: string;
};

// Add this with your other type definitions
type GlitchSkinOption = {
  name: string;
  value: string;
  description?: string;
};

type GlitchEffect = {
  x: number;
  y: number;
  z: number;
  description: string;
};
type GlitchEffectGroup = { [interior: string]: GlitchEffect[] };




// // Add this with your other constants
// const GLITCH_SKIN_OPTIONS: Record<keyof ColorState, GlitchSkinOption[]> = {
//   maleColor: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ],
//   highColor: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ],
//   midColor: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ],
//   mid2Color: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ],
//   lowColor: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ],
//   bottomColor: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ],
//   eyeColor: [
//     { name: "Black w/ White Outline", value: "X=10.0,Y=10.0,Z=10.0" },
//     { name: "Black w/ Pink Outline", value: "X=10.0,Y=0.00000000001,Z=10.0" },
//     { name: "Black w/ Turquoise Outline", value: "X=0.00000000001,Y=10.0,Z=10.0" },
//     { name: "Black w/ Yellow Outline", value: "X=10.0,Y=10.0,Z=0.00000001" },
//     { name: "Black w/ Red Outline", value: "X=10.0,Y=0.00001,Z=0.000001" },
//     { name: "Black w/ Blue Outline", value: "X=0.00001,Y=0.00001,Z=10.0" },
//     { name: "Black w/ Green Outline", value: "X=0.00001,Y=10.0,Z=0.0000001" }
//   ]
// };

// Helper to check if a pixel is a glitch pixel and get its XYZ and intensity
function getGlitchInfo(xyzString: string) {
  const xyz = parseXYZ(xyzString);
  const isGlitch = xyz.X >= 1.0 || xyz.Y >= 1.0 || xyz.Z >= 1.0;
  let intensity: 'none' | 'thin' | 'normal' | 'bold' = 'none';
  if (xyz.X >= 10 || xyz.Y >= 10 || xyz.Z >= 10) intensity = 'thin';
  else if (xyz.X >= 5 || xyz.Y >= 5 || xyz.Z >= 5) intensity = 'normal';
  else if (xyz.X >= 2 || xyz.Y >= 2 || xyz.Z >= 2) intensity = 'bold';
  return { isGlitch, xyz, intensity };
}

// Add this function before modifyTextureColors
function transformColor(r: number, g: number, b: number) {
  // This is a special transformation for low color
  // You can customize this based on how you want to transform it
  
  // For now, let's implement a simple transformation that enhances vibrancy
  const intensity = Math.max(r, g, b) / 255;
  
  // Adjust brightness and saturation
  const adjustedR = Math.min(255, r * 1.2);
  const adjustedG = Math.min(255, g * 1.2);
  const adjustedB = Math.min(255, b * 1.2);
  
  // Ensure contrast with surrounding colors
  return {
    r: Math.round(adjustedR),
    g: Math.round(adjustedG),
    b: Math.round(adjustedB)
  };
}

// Helper function to parse XYZ string values - move this up
function parseXYZ(xyzStr: string) {
  const matches = xyzStr.match(/X=([-\d.]+),Y=([-\d.]+),Z=([-\d.]+)/);
  if (!matches) {
    return { X: 0, Y: 0, Z: 0 };
  }
  return {
    X: parseFloat(matches[1]),
    Y: parseFloat(matches[2]),
    Z: parseFloat(matches[3])
  };
}

// Add this function after your parseXYZ function
function isGlitchSkin(xyzString: string): boolean {
  try {
    const xyz = parseXYZ(xyzString);
    return xyz.X > 5 || xyz.X < 0.0001 || xyz.Y > 5 || xyz.Y < 0.0001 || xyz.Z > 5 || xyz.Z < 0.0001;
  } catch (e) {
    return false;
  }
}




// Update modifyTextureColors to handle glitch skin values
function modifyTextureColors(
  texture: Texture, 
  colors: ColorState, 
  threshold: number = 12,
  glitchSkinValues: Partial<Record<keyof ColorState, string>> = {}
): Texture {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context');

  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  ctx.drawImage(texture.image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Define reference colors
  const referenceColors = {
      maleColor: { r: 255, g: 0, b: 0 },      // Male Color
      highColor:  { r: 0, g: 1, b: 245 },
      midColor: { r: 255, g: 0, b: 255 },     // High Color
      mid2Color: { r: 255, g: 255, b: 0 },    // Mid 2 Color
      lowColor: { r: 0, g: 255, b: 241 },     // Low Color
      bottomColor: { r: 0, g: 255, b: 0 },    // Bottom Color
  };

  // Create a map for the color regions
  const pixelRegions = new Uint8Array(data.length / 4);
  
  const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
      return Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2);
  };

  const maxColorDistance = 195075;
  const thresholdDistance = (threshold / 100) * maxColorDistance;

  // First pass: identify regions
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const pixelIndex = i / 4;
    
    // Find what color region this pixel belongs to
    Object.entries(referenceColors).forEach(([key, refColor], regionIndex) => {
      if (colorDistance(r, g, b, refColor.r, refColor.g, refColor.b) <= thresholdDistance) {
        pixelRegions[pixelIndex] = regionIndex + 1; // Store 1-based region index
      }
    });
  }

  const adjustSaturation = (r: number, g: number, b: number, saturationPercent: number = 20) => {
    // Convert RGB to HSL
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      if (max === r / 255) h = (g / 255 - b / 255) / d + (g < b ? 6 : 0);
      else if (max === g / 255) h = (b / 255 - r / 255) / d + 2;
      else if (max === b / 255) h = (r / 255 - g / 255) / d + 4;
      
      h /= 6;
    }

    // Adjust saturation
    s = Math.min(1, s * (1 + saturationPercent / 100));

    // Convert back to RGB
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
  
      const newR = Math.round(hue2rgb(p, q, h + 1/3) * 255);
      const newG = Math.round(hue2rgb(p, q, h) * 255);
      const newB = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  
      return { r: newR, g: newG, b: newB };
    };

  // Parse glitch skin value to RGB for outline effect
  const parseGlitchSkinToRGB = (xyzString: string) => {
    try {
      // Now parseXYZ is defined when we use it
      const xyz = parseXYZ(xyzString);
      // Check if this is a special glitch value (very small or large values)
      const isGlitchX = xyz.X > 5 || xyz.X < 0.0001;
      const isGlitchY = xyz.Y > 5 || xyz.Y < 0.0001;
      const isGlitchZ = xyz.Z > 5 || xyz.Z < 0.0001;
      
      // If this is a glitch value with very small components, use them for outline detection
      // and make the main color black
      if (isGlitchX || isGlitchY || isGlitchZ) {
        // Base color is black
        let outlineColor = { r: 0, g: 0, b: 0 };
        
        // White outline (all values high)
        if (xyz.X > 5 && xyz.Y > 5 && xyz.Z > 5) {
          outlineColor = { r: 255, g: 255, b: 255 };
        }
        // Pink outline (X high, Y very low, Z high)
        else if (xyz.X > 5 && xyz.Y < 0.0001 && xyz.Z > 5) {
          outlineColor = { r: 255, g: 0, b: 255 };
        }
        // Turquoise outline (X very low, Y high, Z high)
        else if (xyz.X < 0.0001 && xyz.Y > 5 && xyz.Z > 5) {
          outlineColor = { r: 0, g: 255, b: 255 };
        }
        // Yellow outline (X high, Y high, Z very low)
        else if (xyz.X > 5 && xyz.Y > 5 && xyz.Z < 0.0001) {
          outlineColor = { r: 255, g: 255, b: 0 };
        }
        // Red outline (X high, Y very low, Z very low)
        else if (xyz.X > 5 && xyz.Y < 0.0001 && xyz.Z < 0.0001) {
          outlineColor = { r: 255, g: 0, b: 0 };
        }
        // Blue outline (X very low, Y very low, Z high)
        else if (xyz.X < 0.0001 && xyz.Y < 0.0001 && xyz.Z > 5) {
          outlineColor = { r: 0, g: 0, b: 255 };
        }
        // Green outline (X very low, Y high, Z very low)
        else if (xyz.X < 0.0001 && xyz.Y > 5 && xyz.Z < 0.0001) {
          outlineColor = { r: 0, g: 255, b: 0 };
        }
        
        return { 
          isGlitch: true, 
          baseColor: { r: 0, g: 0, b: 0 },
          outlineColor
        };
      }
      
      // Regular color processing
      return { 
        isGlitch: false,
        baseColor: { 
          r: Math.round(xyz.X * 255), 
          g: Math.round(xyz.Y * 255), 
          b: Math.round(xyz.Z * 255) 
        }
      };
    } catch (e) {
      console.error("Error parsing glitch skin value:", e);
      return { 
        isGlitch: false, 
        baseColor: { r: 0, g: 0, b: 0 } 
      };
    }
  };

  // Check if a pixel is on the boundary between regions
  const isOnBoundary = (pixelIndex: number, width: number) => {
    const currentRegion = pixelRegions[pixelIndex];
    if (currentRegion === 0) return false; // No region assigned
    
    // Check neighboring pixels (4-way connectivity)
    const neighbors = [
      pixelIndex - 1, // left
      pixelIndex + 1, // right
      pixelIndex - width, // up
      pixelIndex + width, // down
    ];
    
    for (const neighbor of neighbors) {
      // Skip out-of-bounds neighbors
      if (neighbor < 0 || neighbor >= pixelRegions.length) continue;
      
      // If neighbor is from a different region, this is a boundary
      if (pixelRegions[neighbor] !== 0 && pixelRegions[neighbor] !== currentRegion) {
        return true;
      }
    }
    
    return false;
  };

  // Second pass: process and color pixels with new glitch logic
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const regionIndex = pixelRegions[pixelIndex] - 1;
    if (regionIndex < 0) continue;
    const colorKey = Object.keys(referenceColors)[regionIndex] as keyof typeof colors;

  // If this region has a glitch value
  if (glitchSkinValues[colorKey]) {
    const { isGlitch, xyz, intensity } = getGlitchInfo(glitchSkinValues[colorKey] as string);

    if (isGlitch) {
      // Get neighbors (left, right, up, down)
      const neighbors = [
        pixelIndex - 1,
        pixelIndex + 1,
        pixelIndex - canvas.width,
        pixelIndex + canvas.width,
      ].filter(idx => idx >= 0 && idx < pixelRegions.length);

      let neighborGlitches = [];
      for (const nIdx of neighbors) {
        // Find which region this neighbor is
        const nRegionIndex = pixelRegions[nIdx] - 1;
        if (nRegionIndex < 0) continue;
        const nColorKey = Object.keys(referenceColors)[nRegionIndex] as keyof typeof colors;
        const nGlitchValue = glitchSkinValues[nColorKey];
        if (nGlitchValue) {
          const nInfo = getGlitchInfo(nGlitchValue);
          if (nInfo.isGlitch) {
            neighborGlitches.push({ idx: nIdx, xyz: nInfo.xyz, value: nGlitchValue });
          }
        }
      }

      // Rule A: Same glitch effect touching itself
      if (neighborGlitches.some(n => JSON.stringify(n.xyz) === JSON.stringify(xyz))) {
        // Black seam
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        continue;
      }

      // Rule B: Different glitch effects touching
      const diffNeighbor = neighborGlitches.find(n => JSON.stringify(n.xyz) !== JSON.stringify(xyz));
      if (diffNeighbor) {
        // Additive RGB blending
        const rgbA = {
          r: Math.min(255, Math.round(xyz.X * 255)),
          g: Math.min(255, Math.round(xyz.Y * 255)),
          b: Math.min(255, Math.round(xyz.Z * 255)),
        };
        const rgbB = {
          r: Math.min(255, Math.round(diffNeighbor.xyz.X * 255)),
          g: Math.min(255, Math.round(diffNeighbor.xyz.Y * 255)),
          b: Math.min(255, Math.round(diffNeighbor.xyz.Z * 255)),
        };
        data[i] = Math.min(255, rgbA.r + rgbB.r);
        data[i + 1] = Math.min(255, rgbA.g + rgbB.g);
        data[i + 2] = Math.min(255, rgbA.b + rgbB.b);
        continue;
      }

      // Rule C: Glitch pixel next to normal pixel (do nothing special)
      // Intensity logic:
      if (intensity === 'thin') {
        // Only draw on boundary
        if (isOnBoundary(pixelIndex, canvas.width)) {
          data[i] = Math.round(xyz.X * 255);
          data[i + 1] = Math.round(xyz.Y * 255);
          data[i + 2] = Math.round(xyz.Z * 255);
        } else {
          // Transparent or base color (optional)
          data[i + 3] = 0;
        }
      } else if (intensity === 'normal') {
        // Draw on boundary and some random interior pixels
        if (isOnBoundary(pixelIndex, canvas.width) || Math.random() < 0.3) {
          data[i] = Math.round(xyz.X * 255);
          data[i + 1] = Math.round(xyz.Y * 255);
          data[i + 2] = Math.round(xyz.Z * 255);
        } else {
          data[i + 3] = 0;
        }
      } else {
        // Bold: fill all
        data[i] = Math.round(xyz.X * 255);
        data[i + 1] = Math.round(xyz.Y * 255);
        data[i + 2] = Math.round(xyz.Z * 255);
      }
      // (inside each glitch case, after setting RGB)
      data[i + 3] = 255;
      continue;
    }
  }

  // Regular processing for non-glitch values
  const hex = colors[colorKey];
  data[i] = parseInt(hex.slice(1, 3), 16);
  data[i + 1] = parseInt(hex.slice(3, 5), 16);
  data[i + 2] = parseInt(hex.slice(5, 7), 16);
  data[i + 3] = 255;
}

  ctx.putImageData(imageData, 0, 0);

  const newTexture = new THREE.Texture(canvas);
  newTexture.needsUpdate = true;
  return newTexture;
}

function Model({ colors, selectedPattern, selectedDino, glitchSkinValues }: ModelProps) {
  const dinoData = DINOSAURS[selectedDino];
  const obj = useLoader(OBJLoader, dinoData.model);
  const normalMap = useLoader(TextureLoader, dinoData.normalMap);
  const patternTexture = useLoader(TextureLoader, dinoData.patterns[selectedPattern]);
  const modifiedTexture = modifyTextureColors(patternTexture, colors, 12, glitchSkinValues);
  
  // Setup normal map parameters
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  
  // Create material with normal map
  const material = new THREE.MeshStandardMaterial({
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1, 1),
    roughness: 0.7,
    metalness: 0.3,
    map: modifiedTexture
  });

  // Apply material and modify colors
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        material.map = modifiedTexture;
        material.normalMap = normalMap; // ✅ Apply normal map
        material.normalScale = new THREE.Vector2(7, 7);
        material.needsUpdate = true;
        material.roughness = 0.75;
      }
    });

  return (
    <primitive 
      object={obj} 
      scale={dinoData.scale}
      position={dinoData.position}
    />
  );
}

// First, add this constant at the top of the file with your other constants
const DISCORD_AUTH_URL = 'https://discord.com/oauth2/authorize?client_id=1307836138123432047&response_type=code&redirect_uri=https%3A%2F%2Fprimalheaven.com%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify+guilds+guilds.members.read';

// ///////////////////// testing ////////////
// const DISCORD_AUTH_URL = 'https://discord.com/oauth2/authorize?client_id=1307836138123432047&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify+guilds+guilds.members.read';

// Add this CSS at the top of your file after your imports
const activeSlotStyles = `
  relative
  before:content-['Active']
  before:absolute
  before:-top-[12px]
  before:left-1/2
  before:-translate-x-1/2
  before:text-[10px]
  before:font-bold
  before:text-white
  before:tracking-widest
  before:[text-shadow:1px_1px_0px_black,-1px_-1px_0px_black,1px_-1px_0px_black,-1px_1px_0px_black]
  
  border-1
  border-t-[11px]
  border-yellow-400
  pt-[1px]
  pb-[1px]
  px-[1px]
`

// Add this component at the top of your file with other components
const MobileMessage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-6 text-center">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-24 w-24 text-indigo-500 mb-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
      />
    </svg>
    <h1 className="text-3xl font-bold text-white mb-4">
      Under Construction
    </h1>
    <p className="text-gray-300 text-lg mb-6">
      Please visit us on desktop to use the Skin Creator.
    </p>
    <p className="text-indigo-400 text-sm">
      We are working on mobile support!
    </p>
  </div>
);

export default function SkinCreator() {
    // Mock auth data
  const isAuthenticated = true;
  const isAuthLoading = false;
  const user = {
    id: "123456789",
    roles: ["patron_tier_5", "admin"]
  };

  const [isDaylight, setIsDaylight] = useState(true);
  // 1. All state hooks at the top
  const [marks, setMarks] = useState<boolean>(false);
  const [skinName, setSkinName] = useState<string>('Dibble');
  const [selectedPattern, setSelectedPattern] = useState<number>(1);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorState>({
    maleColor: '#FFFFFF',
    highColor: '#FFFFFF',
    midColor: '#FFFFFF',
    mid2Color: '#FFFFFF',
    lowColor: '#FFFFFF',
    bottomColor: '#FFFFFF',
    eyeColor: '#FFFFFF',
  });
  const colorPickers: ColorPickerItem[] = [
    { label: 'Male Color', key: 'maleColor' },
    { label: 'High Color', key: 'highColor' },
    { label: 'Mid Color', key: 'midColor' },
    { label: 'Mid 2 Color', key: 'mid2Color' },
    { label: 'Low Color', key: 'lowColor' },
    { label: 'Bottom Color', key: 'bottomColor' },
    { label: 'Eye Color', key: 'eyeColor' },
  ];

  const [skinSlots, setSkinSlots] = useState<SkinSlot[]>([
    { id: 1, isActive: false, isLocked: false, isSelected: true, skin: null, timer: null },
    { id: 2, isActive: false, isLocked: false, isSelected: false, skin: null, timer: null },
    { id: 3, isActive: false, isLocked: false, isSelected: false, skin: null, timer: null },
    { id: 4, isActive: false, isLocked: true, isSelected: false, skin: null, timer: null },
    { id: 5, isActive: false, isLocked: true, isSelected: false, skin: null, timer: null },
    { id: 6, isActive: false, isLocked: true, isSelected: false, skin: null, timer: null },
    { id: 7, isActive: false, isLocked: true, isSelected: false, skin: null, timer: null },
    { id: 8, isActive: false, isLocked: true, isSelected: false, skin: null, timer: null },
  ]);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [primalPoints, setPrimalPoints] = useState<number>(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPatreonModal, setShowPatreonModal] = useState(false);
  const [selectedLockedSlot, setSelectedLockedSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDino, setSelectedDino] = useState<string>("dibble");
  const [showGlitchModal, setShowGlitchModal] = useState(false);
  const [selectedColorForGlitch, setSelectedColorForGlitch] = useState<keyof ColorState | null>(null);
  const [glitchSkinValues, setGlitchSkinValues] = useState<Partial<Record<keyof ColorState, string>>>({});
  const lastSelectedSlot = useRef<number | null>(null);

  // Add this to your SkinCreator state variables
const [unlockedSkins, setUnlockedSkins] = useState<Array<{
  id: number;
  skinName: string;
  displayName: string | null;
  skinJson: string;
}>>([]);
const [selectedPremadeSkin, setSelectedPremadeSkin] = useState<string>('');
const [showPremadeDropdown, setShowPremadeDropdown] = useState<boolean>(false);

// Add this to your SkinCreator function near other state variables
const [showExportModal, setShowExportModal] = useState(false);

// Add this function to handle exporting the skin data
const handleExportSkin = () => {
  setShowExportModal(true);
};


// 1. Import handler
const handleImportSkin = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!canExportSkins) {
    showToast('This feature has been removed for portfolio purposes.', 'error');
    return;
  }
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target?.result as string);

      // Validate structure
      const requiredKeys = ['b', 'e', 'f', 'm', 'u', 'd1', 'md', 'pi', 'sv'];
      const isValid =
        typeof json === 'object' &&
        requiredKeys.every((k) => typeof json[k] === 'string');

      if (!isValid) {
        showToast('Invalid skin file format.', 'error');
        return;
      }

      // Parse glitch values
      const glitchValues: Partial<Record<keyof ColorState, string>> = {};
      if (isGlitchSkin(json.md)) glitchValues.maleColor = json.md;
      if (isGlitchSkin(json.f)) glitchValues.highColor = json.f;
      if (isGlitchSkin(json.m)) glitchValues.midColor = json.m;
      if (isGlitchSkin(json.d1)) glitchValues.mid2Color = json.d1;
      if (isGlitchSkin(json.b)) glitchValues.lowColor = json.b;
      if (isGlitchSkin(json.u)) glitchValues.bottomColor = json.u;
      if (isGlitchSkin(json.e)) glitchValues.eyeColor = json.e;

      setGlitchSkinValues(glitchValues);

      setColors({
        maleColor: convertXYZToHex(parseXYZ(json.md)),
        highColor: convertXYZToHex(parseXYZ(json.f)),
        midColor: convertXYZToHex(parseXYZ(json.m)),
        mid2Color: convertXYZToHex(parseXYZ(json.d1)),
        lowColor: convertXYZToHex(parseXYZ(json.b)),
        bottomColor: convertXYZToHex(parseXYZ(json.u)),
        eyeColor: convertXYZToHex(parseXYZ(json.e)),
      });
      setSelectedPattern(parseInt(json.pi) || 1);
      setMarks(json.sv === "1");
      setSkinName('Imported Skin');
      showToast('Skin imported!', 'success');
    } catch (err) {
      showToast('Failed to import skin: Invalid JSON.', 'error');
    }
  };
  reader.readAsText(file);
};


// Move these inside the component
const canUseGlitchSkins = useMemo(() => {
  if (!user?.roles || !user?.id) return false;
  
  const authorizedTier1Ids = [
    '579999588522655765', // Kruemelfelix
    '199300423851573248', // bruv
    '790141346610544652', // Edoras
    '301646793555443715', // AustralianX
    '380181914075791360', // Sugarberry
    '227589663299207169', // Morten
    '198356724174946306', // Lissy
    '133417271807836160', // Rzr
    '967772797910806598', // A Prawn in a Sock
    '322803514181156864', // Got2kRunes
    '244290797313327105'  // mine
  ];
  
  const allowedRoles = [
    '1332044195069952000', // owner
    '1307793767662751895', // skin creator
    '1307794034311303239', // staff
    '1307793972026015876', // head staff
    '1308103830956806204', // tier 1
    '1308103869380694037', // tier 2
    '1308103913161101475', // tier 3
    '1308103945750712391', // tier 4
    '1308103972535402546', // tier 5
    '1390909192600027327', // tier 6
  ];
  
  return user.roles.some(role => allowedRoles.includes(role)) || authorizedTier1Ids.includes(user.id);
}, [user?.roles, user?.id]);

const canExportSkins = useMemo(() => {
  if (!user?.roles || !user?.id) return false;
  
  const authorizedTier1Ids = [
    '579999588522655765', // Kruemelfelix
    '199300423851573248', // bruv
    '790141346610544652', // Edoras
    '301646793555443715', // AustralianX
    '380181914075791360', // Sugarberry
    '227589663299207169', // Morten
    '198356724174946306', // Lissy
    '133417271807836160', // Rzr
    '967772797910806598', // A Prawn in a Sock
    '322803514181156864', // Got2kRunes
    '244290797313327105'  // mine
  ];

  const allowedRoles = [
    '1332044195069952000', // owner
    '1307793767662751895', // skin creator
    '1308103972535402546', // tier 5
    '1390909192600027327', // tier 6
    '1308103945750712391', // tier 4
    '1308103913161101475', // tier 3
    '1308103869380694037', // tier 2
    '1308103830956806204', // tier 1
  ];
  
  return user.roles.some(role => allowedRoles.includes(role)) || authorizedTier1Ids.includes(user.id);
}, [user?.roles, user?.id]);

// Add this function to format the skin data without stringifying
const formatRawSkinData = (
  colors: ColorState, 
  pattern: number, 
  marks: boolean,
  glitchValues: Partial<Record<keyof ColorState, string>> = {}
) => {
  // Convert hex color to X,Y,Z format, or use glitch value if available
  const getColorValue = (key: keyof ColorState): string => {
    if (glitchValues[key]) {
      return glitchValues[key] as string;
    }
    
    const hex = colors[key];
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    // Ensure no value is exactly 0
    const safeValue = (v: number) => v === 0 ? 0.0001 : v;
    return `X=${safeValue(r)},Y=${safeValue(g)},Z=${safeValue(b)}`;
  };

  return {
    b: getColorValue('lowColor'),
    e: getColorValue('eyeColor'),
    f: getColorValue('highColor'),
    m: getColorValue('midColor'),
    u: getColorValue('bottomColor'),
    d1: getColorValue('mid2Color'),
    md: getColorValue('maleColor'),
    pi: pattern.toString(),
    sv: marks ? "1" : "0"
  };
};

  // Add this helper function
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(null), 3000);
  };

  // Update the parseSkinJson function to detect glitch skins
function parseSkinJson(jsonStr: string) {
  const data = JSON.parse(jsonStr);
  
  // Create an object to store detected glitch values
  const glitchValues: Partial<Record<keyof ColorState, string>> = {};
  
  // Check each color component for glitch values
  if (isGlitchSkin(data.md)) glitchValues.maleColor = data.md;
  if (isGlitchSkin(data.f)) glitchValues.highColor = data.f;
  if (isGlitchSkin(data.m)) glitchValues.midColor = data.m;
  if (isGlitchSkin(data.d1)) glitchValues.mid2Color = data.d1;
  if (isGlitchSkin(data.b)) glitchValues.lowColor = data.b;
  if (isGlitchSkin(data.u)) glitchValues.bottomColor = data.u;
  if (isGlitchSkin(data.e)) glitchValues.eyeColor = data.e;
  
  // Store the glitch values for later use
  setGlitchSkinValues(glitchValues);
  
  // Return the parsed color data
  return {
    maleColor: convertXYZToHex(parseXYZ(data.md)),
    highColor: convertXYZToHex(parseXYZ(data.f)),
    midColor: convertXYZToHex(parseXYZ(data.m)),
    mid2Color: convertXYZToHex(parseXYZ(data.d1)),
    lowColor: convertXYZToHex(parseXYZ(data.b)),
    bottomColor: convertXYZToHex(parseXYZ(data.u)),
    eyeColor: convertXYZToHex(parseXYZ(data.e)),
    pattern: parseInt(data.pi) || 0,
    marks: parseInt(data.sv) === 1
  };
}

  const LightToggle = () => (
    <button
      onClick={() => setIsDaylight(prev => !prev)}
      className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-full p-2 border border-indigo-500/50"
    >
      {isDaylight ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-yellow-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-indigo-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
  
  // Helper function to parse XYZ string values
  function parseXYZ(xyzStr: string) {
    const matches = xyzStr.match(/X=([-\d.]+),Y=([-\d.]+),Z=([-\d.]+)/);
    if (!matches) {
      return { X: 0, Y: 0, Z: 0 };
    }
    return {
      X: parseFloat(matches[1]),
      Y: parseFloat(matches[2]),
      Z: parseFloat(matches[3])
    };
  }
  
  // Update convertXYZToHex to handle display values
  function convertXYZToHex({ X, Y, Z }: { X: number, Y: number, Z: number }) {
    // Normalize values to 0-255 range
    const normalizeValue = (value: number) => {
      // Handle negative values
      if (value < 0) value = 0;
      // If value is in 0-1 range, multiply by 255
      if (value >= 0 && value <= 1) value = value * 255;
      // Clamp to 255 for display
      if (value > 255) value = 255;
      return Math.round(value);
    };
  
    const r = normalizeValue(X);
    const g = normalizeValue(Y);
    const b = normalizeValue(Z);
  
    // Ensure hex values are properly padded
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  const handleColorChange = (key: keyof ColorState, value: string) => {
    // Ensure value is a valid hex color
    console.log(`Changing color for ${key}:`, value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setColors(prev => ({
        ...prev,
        [key]: value
      }));
      
      // If we change a color manually, remove any glitch skin value for that color
      if (glitchSkinValues[key]) {
        setGlitchSkinValues(prev => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }
    }
  };

  // Update the handleApplyGlitchSkin function
  const handleApplyGlitchSkin = (colorKey: keyof ColorState, glitchSkin: { x: number; y: number; z: number; value?: string }) => {
    if (!canUseGlitchSkins) {
      showToast('This feature has been removed for portfolio purposes.', 'error');
      setShowGlitchModal(false);
      return;
    }
    // Store as XYZ string
    setGlitchSkinValues(prev => ({
      ...prev,
      [colorKey]: glitchSkin.value || `X=${glitchSkin.x},Y=${glitchSkin.y},Z=${glitchSkin.z}`
    }));
    setShowGlitchModal(false);
    setSelectedColorForGlitch(null);
  };

  // Similarly, update the handleResetGlitchSkin function
  const handleResetGlitchSkin = (colorKey: keyof ColorState) => {
    if (!canUseGlitchSkins) {
      showToast('This feature has been removed for portfolio purposes.', 'error');
      return;
    }
    
    setGlitchSkinValues(prev => {
      const updated = { ...prev };
      delete updated[colorKey];
      return updated;
    });
  };

  // Load cached data initialization
  useEffect(() => {
    // Try to load from localStorage first
    const cachedString = localStorage.getItem('skinCreatorCache');
    if (cachedString) {
      try {
        const cachedData = JSON.parse(cachedString);
        const mockData: UserData = {
          id: "mock-user-id",
          activeSkin: cachedData.activeSkin,
          savedSkins: cachedData.savedSkins || [],
          primalPoints: cachedData.primalPoints || 1000,
          customSlots: cachedData.customSlots || {}
        };
        setUserData(mockData);
        setPrimalPoints(mockData.primalPoints);
        return;
      } catch (e) {
        console.error('Error loading cached data:', e);
      }
    }

    // If no cache, use default values
    const mockData: UserData = {
      id: "mock-user-id",
      activeSkin: null,
      savedSkins: [],
      primalPoints: 1000,
      customSlots: {}
    };
    setUserData(mockData);
    setPrimalPoints(mockData.primalPoints);
    
    // Initialize the cache
    localStorage.setItem('skinCreatorCache', JSON.stringify(mockData));

    // Set initial slot state
    const mockSlots = Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      isLocked: index > 2, // First 3 slots are unlocked
      isActive: false,
      isSelected: index === 0,
      skin: null,
      timer: null,
      skinName: undefined
    }));

    // Set the slots
    setSkinSlots(mockSlots);
    setSelectedSlot(1);
  }, []);

    
  // 2. Add this formatter function to format the time remaining in a readable format
  const formatTimeRemaining = (timerDate: string | null): string | null => {
    if (!timerDate) return null;
    
    const expiryTime = new Date(timerDate).getTime();
    const now = new Date().getTime();
    const timeRemaining = expiryTime - now;
    
    if (timeRemaining <= 0) return 'Expired';
    
    // Convert to days/hours/minutes
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  // 3. Add a useEffect to update the timer display every minute
  useEffect(() => {
    // Skip if there are no timers
    if (!skinSlots.some(slot => slot.timer)) return;
    
    // Update timer display every minute
    const timerInterval = setInterval(() => {
      setSkinSlots(prev => [...prev]); // Force re-render to update timer display
    }, 60000);
    
    return () => clearInterval(timerInterval);
  }, [skinSlots]);

  useEffect(() => {
    if (!userData) return;

    const currentSlot = skinSlots.find(slot => slot.id === selectedSlot);
    if (currentSlot?.skin) {
      const skinId = currentSlot.skin.startsWith('C') ? currentSlot.skin.substring(1) : currentSlot.skin;
      const skinData = userData.savedSkins.find(
        (skin: DbSkin) => skin.id.toString() === skinId
      );

      if (skinData) {
        // Skip this effect when we have glitch skin values - don't try to update from skin data
        if (Object.keys(glitchSkinValues).length > 0) {
          console.log('Skipping skin data update due to active glitch skins');
          return;
        }

        const parsedColors = parseSkinJson(skinData.skinJson);

        // Only update state if we're loading a new skin (slot change)
        // This prevents overwriting user changes
        if (
          // Only update if we've just changed slots and need to load new data
          lastSelectedSlot.current !== selectedSlot
        ) {
          console.log('Updating colors from skin data:', skinData);
          setSkinName(skinData.skinName);
          setColors(parsedColors);
          setSelectedPattern(Number(parsedColors.pattern) || 1);
          setMarks(Boolean(parsedColors.marks));
          
          // Remember this slot for next time
          lastSelectedSlot.current = selectedSlot;
        }
      }
    } else {
      // Handle empty slot
      lastSelectedSlot.current = selectedSlot;
    }
  }, [userData, skinSlots, selectedSlot]);

  // Add this effect to update isSaved state when changing slots
  useEffect(() => {
    const currentSlot = skinSlots.find(s => s.id === selectedSlot);
    setIsSaved(Boolean(currentSlot?.skin));
  }, [selectedSlot, skinSlots]);

  

  const [glitchEffects, setGlitchEffects] = useState<GlitchEffectGroup>({});

  useEffect(() => {
    fetch('/glitches.json')
      .then(res => res.json())
      .then(setGlitchEffects)
      .catch(() => setGlitchEffects({}));
  }, []);

  // 3. Event handlers
  const handleSlotSelect = (slotId: number) => {
    if (!userData) return;
    setSelectedPremadeSkin('');
    setSelectedSlot(slotId);
  
    setSkinSlots(prev => prev.map(slot => ({
      ...slot,
      isSelected: slot.id === slotId
    })));
  
    const selectedSlot = skinSlots.find(s => s.id === slotId);
    
    // If slot is empty or has no skin, set default values
    if (!selectedSlot?.skin) {
      setSkinName('New Skin');
      setColors({
        maleColor: '#FFFFFF',
        highColor: '#FFFFFF',
        midColor: '#FFFFFF',
        mid2Color: '#FFFFFF',
        lowColor: '#FFFFFF',
        bottomColor: '#FFFFFF',
        eyeColor: '#FFFFFF'
      });
      setSelectedPattern(1);
      setMarks(false);
      setGlitchSkinValues({}); // Clear glitch values for new skin
      return;
    }
  
    // Handle slot with skin...
    const skinId = selectedSlot.skin.substring(1);
  
    const skinData = userData.savedSkins.find(
      (skin: DbSkin) => skin.id.toString() === skinId
    );
  
    if (skinData) {
      setSkinName(skinData.skinName);
      
      // Parse the skin JSON and extract both colors and glitch values
      const skinJson = JSON.parse(skinData.skinJson);
      const newGlitchValues: Partial<Record<keyof ColorState, string>> = {};
      
      // Only apply glitch values if user has permission
      if (canUseGlitchSkins) {
        // Check each component for glitch values
        if (isGlitchSkin(skinJson.md)) newGlitchValues.maleColor = skinJson.md;
        if (isGlitchSkin(skinJson.f)) newGlitchValues.highColor = skinJson.f;
        if (isGlitchSkin(skinJson.m)) newGlitchValues.midColor = skinJson.m;
        if (isGlitchSkin(skinJson.d1)) newGlitchValues.mid2Color = skinJson.d1;
        if (isGlitchSkin(skinJson.b)) newGlitchValues.lowColor = skinJson.b;
        if (isGlitchSkin(skinJson.u)) newGlitchValues.bottomColor = skinJson.u;
        if (isGlitchSkin(skinJson.e)) newGlitchValues.eyeColor = skinJson.e;
      }
      
      // Set the glitch values (will be empty if user doesn't have permission)
      setGlitchSkinValues(newGlitchValues);
      
      // Set the regular colors (will be disabled for glitch values)
      const colors = parseSkinJson(skinData.skinJson);
      setColors({
        maleColor: colors.maleColor,
        highColor: colors.highColor,
        midColor: colors.midColor,
        mid2Color: colors.mid2Color,
        lowColor: colors.lowColor,
        bottomColor: colors.bottomColor,
        eyeColor: colors.eyeColor
      });
      
      setSelectedPattern(colors.pattern || 1);
      setMarks(colors.marks);
    }
  };
  
const handleNameChange = async (newName: string) => {
  if (!user || !selectedSlot) return;
  
  const currentSlot = skinSlots.find(s => s.id === selectedSlot);
  if (!currentSlot?.skin) return;
  
  const skinId = currentSlot.skin.substring(1);
  
  try {
    const response = await fetch('/api/user/update-skin-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        skinId,
        skinName: newName,
        userId: user.id 
      })
    });
    
    if (!response.ok) throw new Error('Failed to update skin name');
    
    // Update local states
    setSkinName(newName);
    setIsEditingName(false);
    
    // Update userData state
    setUserData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        savedSkins: prev.savedSkins.map(skin => 
          skin.id.toString() === skinId
            ? { ...skin, skinName: newName }
            : skin
        )
      };
    });

    // Update skinSlots state
    setSkinSlots(prev => prev.map(slot => 
      slot.id === selectedSlot
        ? { ...slot, skinName: newName }
        : slot
    ));
    
    showToast('Skin name updated successfully');
    
  } catch (error) {
    console.error('Error updating skin name:', error);
    showToast('Failed to update skin name', 'error');
  }
};

const handleSaveSkin = async () => {
  if (!userData || !selectedSlot) return;
  
  const currentSlot = skinSlots.find(s => s.id === selectedSlot);
  const cost = currentSlot?.skin ? 100 : 500;
  
  if (primalPoints < cost) {
    showToast(`Not enough Primal Points. You need ${cost} points.`, 'error');
    return;
  }
  
  setIsLoading(true);
  try {
    // Format the skin data correctly
    const formattedSkinData = formatSkinDataForSave(colors, selectedPattern, marks, glitchSkinValues);

    // Generate new skin ID
    const newSkinId = Date.now();
    
    // Fetch current cache
    const cachedData = {
      primalPoints: primalPoints - cost,
      activeSkin: userData.activeSkin,
      savedSkins: userData.savedSkins,
      customSlots: userData.customSlots || {}
    };
    
    // Update cached data
    const updatedCache = {
      ...cachedData,
      savedSkins: [...(cachedData.savedSkins || [])
        .filter(skin => !currentSlot?.skin || skin.id.toString() !== currentSlot.skin.replace('C', '')),
        {
          id: newSkinId,
          skinName,
          skinJson: formattedSkinData
        }
      ]
    };
    
    // Update local state first
    setIsSaved(true);
    setPrimalPoints(updatedCache.primalPoints);
    
    // Update skin slots with new data
    setSkinSlots(prev => prev.map(slot => 
      slot.id === selectedSlot 
        ? { ...slot, skin: `C${newSkinId}`, isActive: true }
        : slot
    ));

    // Update the userData state
    setUserData(prev => ({
      ...prev!,
      savedSkins: updatedCache.savedSkins,
      primalPoints: updatedCache.primalPoints
    }));

    // Save cache to localStorage for persistence
    localStorage.setItem('skinCreatorCache', JSON.stringify(updatedCache));
    
    showToast(currentSlot?.skin ? 'Skin updated successfully' : 'Skin purchased successfully');  } catch (error) {
    console.error('Error saving skin:', error);
    showToast('Failed to save skin', 'error');
  } finally {
    setIsLoading(false);
  }
};

  // Add this to your SkinCreator component where the other handlers are defined
const handleSetActive = async () => {
  if (!userData || !selectedSlot) return;
  
  const currentSlot = skinSlots.find(s => s.id === selectedSlot);
  if (!currentSlot?.skin) {
    showToast('No skin to set active', 'error');
    return;
  }

  // Check if this is already the active skin
  const isAlreadyActive = currentSlot.skin === userData.activeSkin;

  setIsLoading(true);
  try {
    // Fetch current cache
    const response = await fetch('/cacheFile.json');
    const cachedData = await response.json();
    
    // Update cached data
    const updatedCache = {
      ...cachedData,
      activeSkin: isAlreadyActive ? null : currentSlot.skin
    };
    
    // Save updated cache
    await fetch('/cacheFile.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCache)
    });

    if (isAlreadyActive) {
      // Deactivating - update the UI to show no active skin
      setSkinSlots(prev => prev.map(slot => ({
        ...slot,
        isActive: Boolean(slot.skin) // Keep slots with skins as "active" but not "activeSkin"
      })));

      // Update the user data to reflect no active skin
      setUserData(prev => prev ? {
        ...prev,
        activeSkin: null
      } : null);

      showToast('Skin deactivated successfully');
    } else {
      // Activating - update the UI to show which slot is active
      setSkinSlots(prev => prev.map(slot => ({
        ...slot,
        isActive: slot.id === selectedSlot || Boolean(slot.skin)
      })));

      // Update the user data to reflect the new active skin
      setUserData(prev => prev ? {
        ...prev,
        activeSkin: currentSlot.skin
      } : null);

      showToast('Skin set as active successfully');
    }

  } catch (error) {
    console.error('Error toggling active skin:', error);
    showToast(isAlreadyActive ? 'Failed to deactivate skin' : 'Failed to set active skin', 'error');
  } finally {
    setIsLoading(false);
  }
};

const handleDeleteSkin = async () => {
  if (!userData || !selectedSlot) return;
  
  const currentSlot = skinSlots.find(s => s.id === selectedSlot);
  if (!currentSlot?.skin) return;

  setIsLoading(true);
  try {
    // Mock API response - always successful
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update local state
    setSkinSlots(prev => prev.map(slot => 
      slot.id === selectedSlot 
        ? { ...slot, skin: null, isActive: false, skinName: null }
        : slot
    ));

    setUserData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        savedSkins: prev.savedSkins.filter(
          skin => skin.id.toString() !== currentSlot.skin.replace('C', '')
        )
      };
    });

    showToast('Skin deleted successfully');
    setShowDeleteModal(false);
    
    // Reset the color pickers and pattern
    setColors({
      maleColor: '#FFFFFF',
      highColor: '#FFFFFF',
      midColor: '#FFFFFF',
      mid2Color: '#FFFFFF',
      lowColor: '#FFFFFF',
      bottomColor: '#FFFFFF',
      eyeColor: '#FFFFFF',
    });
    setSelectedPattern(1);
    setMarks(false);
    setSkinName('New Skin');
    setIsSaved(false);

  } catch (error) {
    console.error('Error deleting skin:', error);
    showToast('Failed to delete skin', 'error');
  } finally {
    setIsLoading(false);
  }
};

// Add a function to handle loading a premade skin
const handleLoadPremadeSkin = (skinId: string) => {
  const skin = unlockedSkins.find(s => s.id.toString() === skinId);
  if (!skin) return;
  
  setSelectedPremadeSkin(skinId);
  setSkinName(skin.displayName || skin.skinName);
  
  // Parse the skin JSON
  try {
    const skinJson = JSON.parse(skin.skinJson);
    const newGlitchValues: Partial<Record<keyof ColorState, string>> = {};
    
    // Check each component for glitch values - allow even if user doesn't have permissions
    if (isGlitchSkin(skinJson.md)) newGlitchValues.maleColor = skinJson.md;
    if (isGlitchSkin(skinJson.f)) newGlitchValues.highColor = skinJson.f;
    if (isGlitchSkin(skinJson.m)) newGlitchValues.midColor = skinJson.m;
    if (isGlitchSkin(skinJson.d1)) newGlitchValues.mid2Color = skinJson.d1;
    if (isGlitchSkin(skinJson.b)) newGlitchValues.lowColor = skinJson.b;
    if (isGlitchSkin(skinJson.u)) newGlitchValues.bottomColor = skinJson.u;
    if (isGlitchSkin(skinJson.e)) newGlitchValues.eyeColor = skinJson.e;
    
    // Set glitch values for premade skins
    setGlitchSkinValues(newGlitchValues);
    
    // Set regular colors
    setColors({
      maleColor: convertXYZToHex(parseXYZ(skinJson.md)),
      highColor: convertXYZToHex(parseXYZ(skinJson.f)),
      midColor: convertXYZToHex(parseXYZ(skinJson.m)),
      mid2Color: convertXYZToHex(parseXYZ(skinJson.d1)),
      lowColor: convertXYZToHex(parseXYZ(skinJson.b)),
      bottomColor: convertXYZToHex(parseXYZ(skinJson.u)),
      eyeColor: convertXYZToHex(parseXYZ(skinJson.e))
    });
    
    setSelectedPattern(parseInt(skinJson.pi) || 1);
    setMarks(skinJson.sv === "1");
    
  } catch (error) {
    console.error('Error parsing premade skin JSON:', error);
    showToast('Failed to load premade skin', 'error');
  }
};

// Add a function to set the premade skin as active
const handleSetPremadeSkinActive = async () => {
  if (!selectedPremadeSkin) {
    showToast('No premade skin selected', 'error');
    return;
  }
  
  setIsLoading(true);
  try {
    const response = await fetch('/api/user/set-active-skin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        skinId: `D${selectedPremadeSkin}`, // Use D prefix for default/defined skins
        userId: user.id
      })
    });

    if (!response.ok) {
      throw new Error('Failed to set active skin');
    }

    // Update the user data to reflect the new active skin
    setUserData(prev => prev ? {
      ...prev,
      activeSkin: `D${selectedPremadeSkin}`
    } : null);

    showToast('Premade skin set as active successfully');
  } catch (error) {
    console.error('Error setting premade skin as active:', error);
    showToast('Failed to set premade skin as active', 'error');
  } finally {
    setIsLoading(false);
  }
};

  // Mock data is always loaded and authenticated

  // If we get here, user is authenticated
  return (
    <>
      {/* Mobile/Portrait Check */}
      <div className="md:hidden h-screen">
        <MobileMessage />
      </div>

      {/* Existing Desktop Layout */}
      <div className="hidden md:block relative min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 -z-10" />

        {/* Main content */}
        <main className="pt-[22px] px-8 pb-16 overflow-auto max-h-screen"> {/* Reduced from pt-24 to pt-[22px] (about 10% less) */}
          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center mb-2">Skin Creator</h1>
          {isEditingName ? (
            <input
              type="text"
              value={skinName}
              onChange={(e) => setSkinName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNameChange(skinName);
                }
              }}
              className="text-2xl text-center bg-gray-800/50 text-white rounded-lg px-4 py-2 mb-1 mx-auto block"
              autoFocus
            />
          ) : (
            <div className="text-center mb-2">
              <h2 
                onClick={() => setIsEditingName(true)}
                className="text-2xl text-gray-300 cursor-pointer hover:text-white transition-colors"
              >
                {skinName}
              </h2>
              
              {/* Timer display under the skin name */}
              {selectedSlot && skinSlots.find(slot => slot.id === selectedSlot)?.timer && (
                <p className="text-yellow-300 text-xs mt-1 font-medium">
                  {formatTimeRemaining(skinSlots.find(slot => slot.id === selectedSlot)?.timer || null)}
                </p>
              )}
            </div>
          )}

          {/* Main Container - change from fixed height to minimum height */}
          <div className="w-[90%] min-h-[67.5vh] mx-auto mb-8"> 
            <div className="grid grid-cols-5 gap-8">
              {/* Left side - Controls (20%) */}
              <div className="col-span-1 bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm max-h-[67.5vh] overflow-y-auto">
                {/* Pattern Selector Dropdown */}
                <select
                  value={selectedPattern}
                  onChange={(e) => setSelectedPattern(Number(e.target.value))}
                  className="w-full p-1.5 mb-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm" 
                >
                  {[1, 2, 3].map((pattern) => (
                    <option key={pattern} value={pattern}>
                      Pattern {pattern}
                    </option>
                  ))}
                </select>

                {/* Marks Toggle */}
                <div className="flex items-center justify-between mb-4 bg-gray-700/50 p-1.5 rounded-lg"> {/* Reduced padding */}
                  <span className="text-white text-base font-medium">Marks</span> {/* Reduced text size */}
                  <button
                    onClick={() => setMarks(prev => !prev)}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      marks 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {marks ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Color Pickers with reduced spacing */}
                {/* Update the color pickers section */}
                <div className="relative space-y-1.5">
                  {colorPickers.map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between bg-gray-700/50 p-1 rounded-lg">
                      <label className="text-white text-base font-medium">
                        {label}
                      </label>
                      
                      <div className="flex items-center gap-1.5">
                        {/* Glitch button before each color input */}
                        <div className="group">
                          <button
                            onClick={() => {
                              if (canUseGlitchSkins) {
                                setSelectedColorForGlitch(key);
                                setShowGlitchModal(true);
                              } else {
                                showToast('This feature has been removed for portfolio purposes.', 'error');
                              }
                            }}
                            className={`p-1.5 ${
                              !canUseGlitchSkins
                                ? 'bg-gray-700/80 cursor-not-allowed opacity-50' 
                                : glitchSkinValues[key] 
                                  ? 'bg-indigo-600/80 hover:bg-indigo-700/80' 
                                  : 'bg-gray-700/80 hover:bg-indigo-600/80'
                            } rounded-full transition-colors`}
                            aria-label="Glitch skins"
                          >
                            {!canUseGlitchSkins && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-700 rounded-full border border-gray-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                            <Image 
                              src="/GlitchIcon.png" 
                              alt="Glitch Skins" 
                              width={16} 
                              height={16}
                              className={`h-4 w-4 object-contain ${!canUseGlitchSkins ? 'opacity-50' : ''}`}
                            />
                          </button>
                          {/* Updated tooltip with information about access */}
                          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-36 px-2 py-1 bg-gray-800 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            Feature removed for portfolio
                          </div>
                        </div>
                        
                        <input
                          type="color"
                          value={colors[key]}
                          className={`w-10 h-7 rounded cursor-pointer bg-transparent ${
                            glitchSkinValues[key] ? 'opacity-50' : ''
                          }`}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          disabled={Boolean(glitchSkinValues[key])}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add this dropdown after your skin slots section */}
                <div className="mt-4 border-t border-gray-600 pt-3">
                  <h3 className="text-white text-base font-medium mb-2">Select Dinosaur</h3>
                  <select
                    value={selectedDino}
                    onChange={(e) => setSelectedDino(e.target.value)}
                    className="w-full p-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
                  >
                    {Object.entries(DINOSAURS).map(([key, dino]) => (
                      <option key={key} value={key}>
                        {dino.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Update Skin Slot Buttons section */}
                <div className="mt-4 border-t border-gray-600 pt-3"> {/* Reduced margins */}
                  <h3 className="text-white text-base font-medium mb-2">Skin Slots</h3> {/* Reduced text size and margin */}
                  <div className="grid grid-cols-4 gap-1.5"> {/* Reduced gap */}
                  {skinSlots.map((slot) => (
                    <div key={slot.id} className="relative group">
                      <button
                        onClick={() => {
                          if (slot.isLocked) {
                            setSelectedLockedSlot(slot.id);
                            setShowPatreonModal(true);
                          } else {
                            handleSlotSelect(slot.id);
                          }
                        }}
                        className={`
                          w-full px-1.5 py-1 rounded-lg font-medium transition-colors text-center text-xs
                          ${slot.skin !== userData?.activeSkin ? 'pt-[7px] pb-[7px]' : ''}
                          ${selectedSlot === slot.id ? 'ring-2 ring-indigo-500' : ''}
                          ${slot.skin === userData?.activeSkin ? activeSlotStyles : ''}
                          ${slot.isLocked 
                            ? 'bg-gray-700/50 text-gray-400 cursor-pointer hover:bg-gray-700' 
                            : slot.isActive
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-600 text-white hover:bg-gray-500'
                          }
                        `}
                      >
                        {slot.id}
                        {slot.isLocked && (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                />
                              </svg>
                            </div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 px-2 py-1 bg-gray-800 rounded-md text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                              Click for more info...
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                      </div>
                  </div>
              </div>

                {/* Right side - 3D Viewer (80%) */}
              <div className="col-span-4 bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm relative"> {/* Reduced padding */}
                {/* Primal Points Counter */}
                <div className="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-indigo-500/50"> {/* Adjusted positioning and padding */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-400 font-medium text-sm">Primal Points:</span>
                    <span className="text-white font-bold text-sm">
                      {typeof primalPoints === 'number' ? primalPoints.toLocaleString() : '0'}
                    </span>
                  </div>
                </div>                {/* Modify the buttons in the right side viewer */}
                <div className="absolute bottom-16 right-4 z-10 flex flex-col gap-1.5">
                  {/* Export button - only show if user has the required role */}
                  {canExportSkins && (
                    <button
                      onClick={handleExportSkin}
                      className="px-3 py-1.5 rounded-lg text-white font-medium text-sm transition-colors bg-purple-600 hover:bg-purple-700"
                    >
                      Export
                    </button>
                  )}
                  {canExportSkins && (
                    <button
                      className="px-3 py-1.5 rounded-lg text-white font-medium text-sm transition-colors bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowImportModal(true)}
                    >
                      Import
                    </button>
                  )}
                  
                  {/* Set Active button - conditionally show based on whether a premade skin is selected */}
                  {selectedPremadeSkin ? (
                    <button
                      onClick={handleSetPremadeSkinActive}
                      className="px-3 py-1.5 rounded-lg text-white font-medium text-sm transition-colors bg-green-600 hover:bg-green-700"
                    >
                      Set Premade Active
                    </button>
                  ) : (
                    <button
                      onClick={handleSetActive}
                      disabled={!isSaved}
                      className={`px-3 py-1.5 rounded-lg text-white font-medium text-sm transition-colors ${
                        !isSaved 
                          ? 'bg-gray-600 cursor-not-allowed'
                          : skinSlots.find(s => s.id === selectedSlot)?.skin === userData?.activeSkin
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {skinSlots.find(s => s.id === selectedSlot)?.skin === userData?.activeSkin 
                        ? 'Set Inactive' 
                        : 'Set Active'}
                    </button>
                  )}
                  
                  {/* Purchase/Update button - only show when not viewing a premade skin */}
                  {!selectedPremadeSkin && (
                    <button
                      onClick={handleSaveSkin}
                      disabled={primalPoints < (skinSlots.find(s => s.id === selectedSlot)?.skin ? 100 : 500)}
                      className={`px-3 py-1.5 rounded-lg text-white font-medium text-sm transition-colors ${
                        primalPoints < (skinSlots.find(s => s.id === selectedSlot)?.skin ? 100 : 500)
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {skinSlots.find(s => s.id === selectedSlot)?.skin ? 'Update (100)' : 'Purchase (500)'}
                    </button>
                  )}
                </div>

                <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={isDaylight ? 0.5 : 0.25} />
                    <directionalLight 
                      position={[10, 10, 5]} 
                      intensity={isDaylight ? 1 : 0.5} 
                    />
                    <Model 
                      colors={colors} 
                      selectedPattern={selectedPattern} 
                      selectedDino={selectedDino} 
                      glitchSkinValues={glitchSkinValues}
                    />
                    <OrbitControls 
                      autoRotate={false}
                      enableZoom={false}
                      enablePan={false}
                      minPolarAngle={Math.PI / 2}
                      maxPolarAngle={Math.PI / 2}
                    />
                  </Suspense>
                </Canvas>
                <LightToggle />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {skinSlots.find(s => s.id === selectedSlot)?.skin && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
                    >
                      Delete Skin
                    </button>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => showToast('Premade skins are unavailable in portfolio mode', 'error')}
                      className="w-full px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <span>Premade Skins</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
            <div className="bg-yellow-600/20 backdrop-blur-sm border border-yellow-500/50 px-4 py-2 rounded-lg">
              <p className="text-yellow-200 text-sm font-medium">
                This is a testing environment for portfolio purposes. All networking behavior has been removed.
              </p>
            </div>
        </main>
        {showPatreonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Additional Skin Slots</h3>
              <p className="text-gray-300 mb-6">
                Additional skin slots have been removed for portfolio purposes.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPatreonModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && <DeleteConfirmationModal onDelete={handleDeleteSkin} />}
        {isLoading && <LoadingOverlay />}
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all transform translate-y-0 opacity-100 z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {toast.message}
          </div>
        )}
        {showGlitchModal && (
          <GlitchSkinsModal 
            onClose={() => setShowGlitchModal(false)} 
            selectedColor={selectedColorForGlitch} 
            onApply={handleApplyGlitchSkin}
            onReset={handleResetGlitchSkin}
            hasGlitchValue={Boolean(selectedColorForGlitch && glitchSkinValues[selectedColorForGlitch])}
            colorPickers={colorPickers}
            glitchEffects={glitchEffects}
          />
        )}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Import Skin JSON</h3>
                <button 
                  onClick={() => {
                    setShowImportModal(false);
                    setImportJsonText('');
                    setImportError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <textarea
                className="w-full h-40 p-2 rounded bg-gray-900 text-white font-mono mb-2"
                placeholder='Paste your skin JSON here...'
                value={importJsonText}
                onChange={e => {
                  setImportJsonText(e.target.value);
                  setImportError(null);
                }}
              />
              {importError && (
                <div className="text-red-400 text-sm mb-2">{importError}</div>
              )}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportJsonText('');
                    setImportError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  disabled={!importJsonText}
                  onClick={() => {
                    // Validate JSON
                    try {
                      const json = JSON.parse(importJsonText);
                      const requiredKeys = ['b', 'e', 'f', 'm', 'u', 'd1', 'md', 'pi', 'sv'];
                      const isValid =
                        typeof json === 'object' &&
                        requiredKeys.every((k) => typeof json[k] === 'string');
                      if (!isValid) {
                        setImportError('Invalid skin file format.');
                        return;
                      }
                      // Parse glitch values
                      const glitchValues: Partial<Record<keyof ColorState, string>> = {};
                      if (isGlitchSkin(json.md)) glitchValues.maleColor = json.md;
                      if (isGlitchSkin(json.f)) glitchValues.highColor = json.f;
                      if (isGlitchSkin(json.m)) glitchValues.midColor = json.m;
                      if (isGlitchSkin(json.d1)) glitchValues.mid2Color = json.d1;
                      if (isGlitchSkin(json.b)) glitchValues.lowColor = json.b;
                      if (isGlitchSkin(json.u)) glitchValues.bottomColor = json.u;
                      if (isGlitchSkin(json.e)) glitchValues.eyeColor = json.e;

                      setGlitchSkinValues(glitchValues);

                      setColors({
                        maleColor: convertXYZToHex(parseXYZ(json.md)),
                        highColor: convertXYZToHex(parseXYZ(json.f)),
                        midColor: convertXYZToHex(parseXYZ(json.m)),
                        mid2Color: convertXYZToHex(parseXYZ(json.d1)),
                        lowColor: convertXYZToHex(parseXYZ(json.b)),
                        bottomColor: convertXYZToHex(parseXYZ(json.u)),
                        eyeColor: convertXYZToHex(parseXYZ(json.e)),
                      });
                      setSelectedPattern(parseInt(json.pi) || 1);
                      setMarks(json.sv === "1");
                      setSkinName('Imported Skin');
                      setShowImportModal(false);
                      setImportJsonText('');
                      setImportError(null);
                      showToast('Skin imported!', 'success');
                    } catch (err) {
                      setImportError('Failed to import skin: Invalid JSON.');
                    }
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add this with your other modals at the bottom of your component */}
{showExportModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Export Skin Data</h3>
        <button 
          onClick={() => setShowExportModal(false)}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="bg-gray-900 p-4 rounded-lg mb-4 max-h-96 overflow-auto">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
          {JSON.stringify(formatRawSkinData(colors, selectedPattern, marks, glitchSkinValues), null, 2)}
        </pre>
      </div>
      
      <div className="flex justify-end gap-4">
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(formatRawSkinData(colors, selectedPattern, marks, glitchSkinValues)));
            showToast('Skin data copied to clipboard');
          }}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={() => setShowExportModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}

// Add the NavDropdown component at the bottom of the file
const NavDropdown = ({ title, items }: { title: string; items: { name: string; href: string }[] }) => (
  <div className="relative group">
    <button className="px-4 py-2 hover:text-gray-300 font-medium">
      {title}
    </button>
    <div className="absolute hidden group-hover:block w-48 bg-gray-800 rounded-md shadow-lg">
      {items.map((item) => (
        <Link 
          key={item.name} 
          href={item.href}
          className="block px-4 py-2 text-sm hover:bg-gray-700"
        >
          {item.name}
        </Link>
      ))}
    </div>
  </div>
);


// Add this function to determine required tier
const getRequiredTier = (slotNumber: number) => {
  if (slotNumber <= 2) return null;
  if (slotNumber === 3) return "Tier 1";
  if (slotNumber === 4) return "Tier 2";
  if (slotNumber === 5) return "Tier 3";
  if (slotNumber === 6) return "Tier 4";
  return "Tier 5";
};

// Add this helper function to convert hex to XYZ format
function convertHexToXYZ(hex: string): string {
  // Remove the # from hex color
  const color = hex.substring(1);
  
  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;

  // Ensure no value is exactly 0
  const adjustValue = (val: number) => val === 0 ? 0.01 : val;

  // Format the XYZ string
  return `X=${adjustValue(r)},Y=${adjustValue(g)},Z=${adjustValue(b)}`;
}

// Update this function to handle glitch skins
function formatSkinDataForSave(
  colors: ColorState, 
  pattern: number, 
  marks: boolean,
  glitchValues: Partial<Record<keyof ColorState, string>> = {}
): string {
  // Convert hex color to X,Y,Z format, or use glitch value if available
  const getColorValue = (key: keyof ColorState): string => {
    if (glitchValues[key]) {
      return glitchValues[key] as string;
    }
    
    const hex = colors[key];
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    // Ensure no value is exactly 0
    const safeValue = (v: number) => v === 0 ? 0.0001 : v;
    return `X=${safeValue(r)},Y=${safeValue(g)},Z=${safeValue(b)}`;
  };

  const skinData = {
    b: getColorValue('lowColor'),
    e: getColorValue('eyeColor'),
    f: getColorValue('highColor'),
    m: getColorValue('midColor'),
    u: getColorValue('bottomColor'),
    d1: getColorValue('mid2Color'),
    md: getColorValue('maleColor'),
    pi: pattern.toString(),
    sv: marks ? "1" : "0"
  };

  // Convert to JSON and remove escaping
  return JSON.stringify(skinData);
}
// Update the GlitchSkinsModal component
// Update the GlitchSkinsModal component to include a warning
const GlitchSkinsModal = ({ 
  onClose, 
  selectedColor, 
  onApply,
  onReset,
  hasGlitchValue,
  colorPickers,
  glitchEffects
}: { 
  onClose: () => void;
  selectedColor: keyof ColorState | null;
  onApply: (colorKey: keyof ColorState, option: { x: number; y: number; z: number; description: string }) => void;
  onReset: (colorKey: keyof ColorState) => void;
  hasGlitchValue: boolean;
  colorPickers: ColorPickerItem[];
  glitchEffects: GlitchEffectGroup;
}) => {
  if (!selectedColor) return null;

  // Grouped by interior color
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">
            Glitch Skins
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-yellow-800/40 border border-yellow-600/60 rounded-md p-2 mb-4">
          <p className="text-yellow-300 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Warning:</strong> Glitch skin effects vary between devices especially when using more than one glitch effect. What you see here may not match exactly how it appears in-game.
            </span>
          </p>
        </div>
        <div className="text-gray-300 mb-4">
          <p>Select a glitch skin to apply a special effect to this color section.</p>
        </div>
        <div className="max-h-60 overflow-y-auto pr-2 mb-4">
          {Object.entries(glitchEffects).map(([interior, effects]) => (
            <div key={interior} className="mb-2">
              <div className="font-bold text-indigo-300 mb-1">{interior}</div>
              {effects.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onApply(selectedColor, {
                    ...option,
                    // Convert to XYZ string for storage
                    value: `X=${option.x},Y=${option.y},Z=${option.z}`
                  })}
                  className="w-full text-left p-2 hover:bg-gray-700 rounded-lg mb-1 transition-colors flex items-center"
                >
                  <span className="text-white">{option.description}</span>
                  <span className="ml-2 text-xs text-gray-400">{`(${option.x}, ${option.y}, ${option.z})`}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {hasGlitchValue && (
            <button
              onClick={() => onReset(selectedColor)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Reset to Normal
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// Add this component at the bottom of the file
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-800/90 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-white font-medium">Processing...</span>
    </div>
  </div>
);

// Add this component inside your SkinCreator component
const DeleteConfirmationModal = ({ onDelete }: { onDelete: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
      <h3 className="text-xl font-bold text-white mb-4">Delete Skin?</h3>
      <p className="text-gray-300 mb-6">
        This action cannot be undone. The skin will be permanently deleted and you will need to pay again to use this slot.
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
