import { useRef } from "react";
import * as THREE from "three";

export interface Box3DType {
  id: string;
  position: THREE.Vector3;
  dimensions: THREE.Vector3;
  rotation: THREE.Euler;
}

export const Box3D: React.FC<{
  box: Box3DType;
  isSelected: boolean;
  onSelect: (mesh: THREE.Mesh) => void;
}> = ({ box, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      userData={{ id: box.id, isBox3D: true }}
      ref={meshRef}
      position={box.position}
      rotation={box.rotation}
      scale={box.dimensions}
      onClick={() => {
        if (meshRef.current) {
          onSelect(meshRef.current);
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.1}
        color={isSelected ? "red" : "green"}
      />
      <lineSegments raycast={() => null}>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color={isSelected ? "red" : "green"} />
      </lineSegments>
    </mesh>
  );
};
