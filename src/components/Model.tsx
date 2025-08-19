// components/Model.tsx
interface ModelProps {
  colors: ColorState;
  selectedPattern: number;
  selectedDino: string;
}

export function Model({selectedPattern, selectedDino }: ModelProps) {
  const dinoData = DINOSAURS[selectedDino];
  const obj = useLoader(OBJLoader, dinoData.model);
  const normalMap = useLoader(TextureLoader, dinoData.normalMap);
  const patternTexture = useLoader(TextureLoader, dinoData.patterns[selectedPattern]);
  
  // Setup normal map parameters
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  
  // Create material with normal map
  const material = new THREE.MeshStandardMaterial({
    normalMap: normalMap,
    normalScale: new THREE.Vector2(1, 1),
    roughness: 0.7,
    metalness: 0.3,
    map: patternTexture
  });

  // Apply material and modify colors
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = material;
      // Your existing color modification code...
    }
  });

  return <primitive object={obj} />;
}