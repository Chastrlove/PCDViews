import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type ClickHandler = (
  intersection: THREE.Vector3 | Array<THREE.Intersection>
) => void;

export function useSceneClickHandler(
  onClick: ClickHandler,
  type: "plane" | "object"
) {
  const { camera, raycaster, gl, scene } = useThree();
  const onClickRef = useRef<ClickHandler>(onClick);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    const XY_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handleClick = (event: MouseEvent) => {
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      const y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      if (type === "plane") {
        const intersectionPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(XY_PLANE, intersectionPoint);
        onClickRef.current(intersectionPoint);
      } else {
        const intersects = raycaster.intersectObjects(scene.children, true);
        onClickRef.current(intersects);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [camera, raycaster, gl.domElement, type, scene]);
}
