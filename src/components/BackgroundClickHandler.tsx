import type React from "react";
import * as THREE from "three";
import { useSceneClickHandler } from "../hooks/useSceneClickHandler";

export const BackgroundClickHandler: React.FC<{
  onBackgroundClick: () => void;
  isCreatingBox: boolean;
}> = ({ onBackgroundClick, isCreatingBox }) => {
  useSceneClickHandler((intersects) => {
    if (intersects instanceof THREE.Vector3) {
      return;
    }
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.userData.isBox3D || isCreatingBox) {
        return;
      }
    }
    onBackgroundClick();
  }, "object");

  return null;
};
