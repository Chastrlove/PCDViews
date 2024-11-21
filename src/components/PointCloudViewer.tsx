import {OrbitControls, OrthographicCamera, PerspectiveCamera, TransformControls,} from "@react-three/drei";

import {Canvas} from "@react-three/fiber";
import type React from "react";
import {useEffect, useRef, useState} from "react";
import type * as THREE from "three";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader.js";
import type {Box3DType} from "./Box3D";
import {Boxes} from "./Boxes";
import {PointsInteraction} from "./PointsInteraction";
import {ViewType} from "./ViewConfig";
import {BackgroundClickHandler} from "./BackgroundClickHandler";

export interface SelectedBoxInfo {
  id: string;
  mesh: THREE.Mesh;
}

interface PointCloudViewerProps {
  file: File | null;
  cameraPosition: [number, number, number];
  handleBoxUpdate: (box: Box3DType) => void;
  controlsEnabled?: boolean;
  lookAt?: [number, number, number];
  onBoxCreated?: (box: Box3DType) => void;
  boxes: Box3DType[];
  selectedBoxInfo?: SelectedBoxInfo;
  onBoxSelect: (box?: SelectedBoxInfo) => void;
  isCreatingBox: boolean;
  canCreateBox: boolean;
  viewType: ViewType;
}

const PointCloud: React.FC<{ points: THREE.Points | null }> = ({ points }) => {
  return points ? <primitive object={points} /> : null;
};

export const PointCloudViewer: React.FC<PointCloudViewerProps> = ({
  file,
  cameraPosition: initialCameraPosition,
  onBoxCreated,
  handleBoxUpdate,
  boxes,
  selectedBoxInfo,
  onBoxSelect,
  isCreatingBox,
  canCreateBox,
  viewType,
}) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [camera,setCamera] = useState<THREE.OrthographicCamera | THREE.PerspectiveCamera | null>(null)

  const isPerspectiveView = viewType === ViewType.PERSPECTIVE;

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      setError(null);
      const loader = new PCDLoader();
      const url = URL.createObjectURL(file);

      loader.load(
        url,
        (points) => {
          pointsRef.current = points;
          points.geometry.center();
          setIsLoading(false);
          URL.revokeObjectURL(url);
        },
        undefined,
        (error) => {
          setError("Error loading PCD file");
          setIsLoading(false);
          URL.revokeObjectURL(url);
          console.error("Error loading PCD:", error);
        }
      );
    }
  }, [file]);

  return (
    <div className="relative w-full h-full">
      <Canvas>
        <BackgroundClickHandler
          onBackgroundClick={() => onBoxSelect(undefined)}
          isCreatingBox={isCreatingBox}
        />
        {viewType === ViewType.PERSPECTIVE ? (
          <PerspectiveCamera
            ref={setCamera}
            makeDefault
            position={initialCameraPosition}
            fov={60}
            near={0.1}
            far={1000}
            up={[0, 0, 1]}
          />
        ) : (
          <OrthographicCamera
              ref={setCamera}
            makeDefault
            position={initialCameraPosition}
            zoom={1}
            near={0.1}
            far={1000}
            up={[0, 0, 1]}
            onUpdate={(camera) => camera.lookAt(0, 0, 0)}
          />
        )}
        {<OrbitControls makeDefault />}
        <PointCloud points={pointsRef.current} />
        {/*<gridHelper args={[100, 5]} rotation={[Math.PI / 2, 0, 0]} />*/}
        <axesHelper args={[100]} />
        {onBoxCreated && (
          <PointsInteraction
            onBoxPlaced={onBoxCreated}
            isPerspectiveView={isPerspectiveView}
            isCreatingBox={isCreatingBox}
            canCreateBox={canCreateBox}
          />
        )}
        {isPerspectiveView && selectedBoxInfo && (
          <TransformControls
            mode="translate"
            object={selectedBoxInfo.mesh}
            onObjectChange={(e) => {
              const object = (e?.target as { object: THREE.Object3D })?.object;
              if (!object) {
                return;
              }
              handleBoxUpdate({
                id: object.userData.id,
                position: object.position.clone(),
                rotation: object.rotation.clone(),
                dimensions: object.scale.clone(),
              });
            }}
          />
        )}
        <Boxes
            camera={camera}
          viewType={viewType}
          data={boxes}
          selectedBoxInfo={selectedBoxInfo}
          onBoxSelect={onBoxSelect}
        />
      </Canvas>
      {isLoading && (
        <div className="flex absolute inset-0 justify-center items-center text-white bg-black bg-opacity-50">
          Loading...
        </div>
      )}
      {error && (
        <div className="flex absolute inset-0 justify-center items-center text-white bg-red-500 bg-opacity-50">
          {error}
        </div>
      )}
    </div>
  );
};
