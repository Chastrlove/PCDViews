import { useState } from "react";
import type * as THREE from "three";
import { FileUpload } from "./components/FileUpload";
import {
  PointCloudViewer,
  type SelectedBoxInfo,
} from "./components/PointCloudViewer";
import { ViewType } from "./components/ViewConfig";

interface Box3D {
  id: string;
  position: THREE.Vector3;
  dimensions: THREE.Vector3;
  rotation: THREE.Euler;
}

function useBoxState() {
  const [boxes, setBoxes] = useState<Box3D[]>([]);
  const [selectedBoxInfo, setSelectedBoxInfo] = useState<
    SelectedBoxInfo | undefined
  >(undefined);
  const [isCreatingBox, setIsCreatingBox] = useState(false);

  const handleBoxCreated = (box: Box3D) => {
    setBoxes((prev) => [...prev, box]);
    setIsCreatingBox(false);
  };

  const handleBoxUpdate = (box: Box3D) => {
    const updatedBoxes = boxes.map((b) => (b.id === box.id ? box : b));
    setBoxes(updatedBoxes);
  };

  return {
    boxes,
    selectedBoxInfo,
    isCreatingBox,
    handleBoxCreated,
    handleBoxUpdate,
    setSelectedBoxInfo,
    setIsCreatingBox,
  };
}

function App() {
  const [pcdFile, setPcdFile] = useState<File | null>(null);
  const {
    boxes,
    selectedBoxInfo,
    isCreatingBox,
    handleBoxCreated,
    handleBoxUpdate,
    setSelectedBoxInfo,
    setIsCreatingBox,
  } = useBoxState();

  const handleFileUpload = (file: File) => {
    setPcdFile(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Global Toolbar */}
      <div className="fixed left-0 top-1/2 z-10 p-2 bg-white rounded-r shadow-lg transform -translate-y-1/2">
        <button
          className={`p-2 mb-2 rounded ${
            isCreatingBox ? "text-white bg-blue-500" : "bg-gray-200"
          }`}
          onClick={() => setIsCreatingBox(!isCreatingBox)}
          title="Create Box"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </button>
      </div>

      <div className="container flex flex-col p-4 mx-auto h-screen">
        <div className="flex-none">
          <h1 className="mb-2 text-2xl font-bold">PCD Viewer</h1>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        <div className="flex flex-1 gap-4 mb-4">
          {/* Large Perspective View */}
          <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md">
            <h2 className="flex-none p-2 text-lg font-semibold">
              Perspective View
            </h2>
            <div className="flex-1">
              <PointCloudViewer
                file={pcdFile}
                cameraPosition={[0, 0, 100]}
                lookAt={[0, 0, 0]}
                onBoxCreated={handleBoxCreated}
                handleBoxUpdate={handleBoxUpdate}
                boxes={boxes}
                selectedBoxInfo={selectedBoxInfo}
                onBoxSelect={setSelectedBoxInfo}
                isCreatingBox={isCreatingBox}
                canCreateBox={true}
                viewType={ViewType.PERSPECTIVE}
              />
            </div>
          </div>

          {/* Side Views */}
          <div className="flex flex-col gap-4 w-1/3">
            {/* Top View */}
            <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md">
              <h2 className="flex-none p-2 text-lg font-semibold">Top View</h2>
              <div className="flex-1">
                <PointCloudViewer
                  file={pcdFile}
                  cameraPosition={[0, 0, 100]}
                  lookAt={[0, 0, 0]}
                  controlsEnabled={false}
                  boxes={boxes}
                  handleBoxUpdate={handleBoxUpdate}
                  selectedBoxInfo={selectedBoxInfo}
                  onBoxSelect={setSelectedBoxInfo}
                  isCreatingBox={false}
                  canCreateBox={false}
                  viewType={ViewType.TOP}
                />
              </div>
            </div>

            {/* Side View */}
            <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md">
              <h2 className="flex-none p-2 text-lg font-semibold">Side View</h2>
              <div className="flex-1">
                <PointCloudViewer
                  file={pcdFile}
                  cameraPosition={[0, -100, 0]}
                  lookAt={[0, 0, 0]}
                  controlsEnabled={false}
                  boxes={boxes}
                  handleBoxUpdate={handleBoxUpdate}
                  selectedBoxInfo={selectedBoxInfo}
                  onBoxSelect={setSelectedBoxInfo}
                  isCreatingBox={false}
                  canCreateBox={false}
                  viewType={ViewType.SIDE}
                />
              </div>
            </div>

            {/* Front View */}
            <div className="flex flex-col flex-1 bg-white rounded-lg shadow-md">
              <h2 className="flex-none p-2 text-lg font-semibold">
                Front View
              </h2>
              <div className="flex-1">
                <PointCloudViewer
                  file={pcdFile}
                  cameraPosition={[-100, 0, 0]}
                  lookAt={[0, 0, 0]}
                  controlsEnabled={false}
                  boxes={boxes}
                  handleBoxUpdate={handleBoxUpdate}
                  selectedBoxInfo={selectedBoxInfo}
                  onBoxSelect={setSelectedBoxInfo}
                  isCreatingBox={false}
                  canCreateBox={false}
                  viewType={ViewType.FRONT}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
