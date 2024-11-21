import * as THREE from "three";

export function getTransformFrom3Point(
  points: [THREE.Vector3, THREE.Vector3, THREE.Vector3]
): {
  scale: THREE.Vector3;
  position: THREE.Vector3;
  rotation: THREE.Euler;
} {
  const xDir = new THREE.Vector3().copy(points[1]).sub(points[0]);
  const yDir = new THREE.Vector3().copy(points[2]).sub(points[1]);
  const center = new THREE.Vector3()
    .copy(points[0])
    .add(points[1])
    .multiplyScalar(0.5)
    .addScaledVector(yDir, 0.5);

  let angle = xDir.angleTo(new THREE.Vector3(1, 0, 0));

  angle = xDir.y < 0 ? angle : -angle;

  return {
    scale: new THREE.Vector3(xDir.length(), yDir.length(), 6),
    position: new THREE.Vector3(center.x, center.y, 0),
    rotation: new THREE.Euler(0, 0, angle),
  };
}
