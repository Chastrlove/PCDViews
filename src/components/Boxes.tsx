import { useThree } from "@react-three/fiber";
import {useEffect, useRef} from "react";
import * as THREE from "three";
import AutoFitBox from "./viewport.ts";

import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/controls/OrbitControls.js";
import { Box3D, type Box3DType } from "./Box3D";
import {
  type SelectedBoxInfo,
} from "./PointCloudViewer";
import {AxisType, SideAxis, ViewType} from "./ViewConfig";



interface EditBoxProps {
  data?: Box3DType[];
  selectedBoxInfo?: SelectedBoxInfo;
  onBoxSelect: (box?: SelectedBoxInfo) => void;
  viewType: ViewType;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null
}


export function Boxes(props: EditBoxProps) {
  const { data, selectedBoxInfo, onBoxSelect, viewType,camera } = props;
  const isPerspectiveView = viewType === ViewType.PERSPECTIVE;
  const { gl, controls } = useThree();

  const autoFitBoxRef = useRef<AutoFitBox>()

  const axis = SideAxis.get(viewType) as AxisType;

  useEffect(() => {
    if(camera){
      autoFitBoxRef.current = new AutoFitBox(
          camera as THREE.OrthographicCamera,
          controls as OrbitControlsType,
          gl.domElement,
          {
            axis,
          }
      );
    }
  }, [camera,axis]);

  useEffect(() => {
    if (selectedBoxInfo) {
      if (!isPerspectiveView) {
        autoFitBoxRef.current?.fitObject(selectedBoxInfo.mesh);
      }
    }
  }, [selectedBoxInfo, isPerspectiveView]);

  return data?.map((box) => (
    <Box3D
      key={box.id}
      box={box}
      isSelected={box.id === selectedBoxInfo?.id}
      onSelect={(mesh) => onBoxSelect({ id: box.id, mesh })}
    />
  ));
}
