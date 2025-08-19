import { useGLTF } from '@react-three/drei';

export function useModel(path: string) {
  const { scene, materials } = useGLTF(path);
  
  const updateMaterials = (colors: Record<string, string>) => {
    Object.entries(colors).forEach(([part, color]) => {
      if (materials[part]) {
        materials[part].color.set(color);
        materials[part].needsUpdate = true;
      }
    });
  };

  return {
    scene,
    materials,
    updateMaterials
  };
}