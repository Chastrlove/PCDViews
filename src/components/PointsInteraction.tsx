import { useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { useSceneClickHandler } from "../hooks/useSceneClickHandler";
import { getTransformFrom3Point } from "../utils";
import type { Box3DType } from "./Box3D";

const calculateBoxFromPoints = (
  points: [THREE.Vector3, THREE.Vector3, THREE.Vector3]
): Box3DType => {
  // 计算边界框
  const {
    position,
    rotation,
    scale: dimensions,
  } = getTransformFrom3Point(points);
  return {
    id: Math.random().toString(36).substr(2, 9),
    position,
    dimensions,
    rotation,
  };
};

/**
 * A material that interprets the input mesh coordinates in pixel space, regardless of the camera
 * perspective/zoom level.
 */
export class FixedSizeMeshMaterial extends THREE.ShaderMaterial {
  public constructor({
    color,
    ...params
  }: { color: THREE.ColorRepresentation } & THREE.MaterialParameters) {
    super({
      ...params,
      vertexShader: /* glsl */ `
          #include <common>
          uniform vec2 canvasSize;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(0., 0., 0., 1.);
  
            // Adapted from THREE.ShaderLib.sprite
            vec2 scale;
            scale.x = length(vec3(modelMatrix[0].xyz));
            scale.y = length(vec3(modelMatrix[1].xyz));
  
            gl_Position = projectionMatrix * mvPosition;
  
            // Add position after projection to maintain constant pixel size
            gl_Position.xy += position.xy / canvasSize * scale * gl_Position.w;
          }
        `,
      fragmentShader: /* glsl */ `
          uniform vec3 color;
          void main() {
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      uniforms: {
        canvasSize: { value: [0, 0] },
        color: { value: new THREE.Color(color).convertSRGBToLinear() },
      },
    });
  }
}

export const PointsInteraction: React.FC<{
  onBoxPlaced?: (box: Box3DType) => void;
  isPerspectiveView: boolean;
  isCreatingBox: boolean;
  canCreateBox: boolean;
}> = ({ onBoxPlaced, isPerspectiveView, isCreatingBox, canCreateBox }) => {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  const material = useMemo(() => {
    return new FixedSizeMeshMaterial({
      color: 0xff0000,
      depthTest: false,
      depthWrite: false,
    });
  }, []);

  // 动态更新每个点的屏幕尺寸
  useFrame(({ size: canvasSize }) => {
    material.uniforms.canvasSize.value = [canvasSize.width, canvasSize.height];
  });

  useSceneClickHandler((intersectionPoint) => {
    if (!(intersectionPoint instanceof THREE.Vector3)) {
      return;
    }
    if (!isPerspectiveView || !isCreatingBox || !canCreateBox) return;
    setPoints((prev) => {
      const newPoints = [...prev, intersectionPoint];
      if (newPoints.length === 3) {
        //注意点的顺序影响朝向,默认应该是TopLeft,TopRight,BottomRight,
        const box = calculateBoxFromPoints(
          newPoints as [THREE.Vector3, THREE.Vector3, THREE.Vector3]
        );
        onBoxPlaced?.(box);
        return []; // Reset points
      }
      return newPoints;
    });
  }, "plane");

  return (
    <>
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <circleGeometry args={[5, 16]} />
          <primitive object={material} />
        </mesh>
      ))}
    </>
  );
};
