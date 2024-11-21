import * as THREE from "three";

import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {AxisType, axisUpInfo} from "./ViewConfig";


export default class AutoFitBox {
  container: HTMLCanvasElement;
  width: number;
  height: number;
  camera: THREE.OrthographicCamera;
  object: THREE.Mesh | null;
  projectRect: THREE.Box3;
  axis: AxisType;
  alignAxis: THREE.Vector3;
  paddingPercent: number;
  zoom = 1;
  cameraOffset: THREE.Vector3 = new THREE.Vector3();
  controls: OrbitControls;

  constructor(
    camera: THREE.OrthographicCamera,
    controls: OrbitControls,
    container: HTMLCanvasElement,
    config = {} as {
      axis?: AxisType;
      paddingPercent?: number;
    }
  ) {
    this.controls = controls;
    this.container = container;
    const { axis = "z", paddingPercent = 1 } = config;

    this.object = null;
    this.projectRect = new THREE.Box3();
    this.axis = axis;
    this.alignAxis = new THREE.Vector3();
    this.setAxis(axis);

    this.paddingPercent = paddingPercent;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.camera = camera;
  }

  setAxis(axis: AxisType) {
    this.axis = axis;
    this.alignAxis.set(0, 0, 0);

    const axisValue = this.axis.length === 2 ? this.axis[1] : this.axis[0];
    const isInverse = this.axis.length === 2;
    this.alignAxis[axisValue as "x" | "y" | "z"] = isInverse ? -0.5 : 0.5;

    if (this.object) this.fitObject();
  }

  updateProjectRect() {
    if (!this.object) return;

    const { object, camera } = this;

    camera.updateMatrixWorld();
    object.updateMatrixWorld();

    if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
    const bbox = object.geometry.boundingBox as THREE.Box3;

    const minProject = new THREE.Vector3().copy(bbox.min);
    const maxProject = new THREE.Vector3().copy(bbox.max);

    minProject
      .applyMatrix4(object.matrixWorld)
      .applyMatrix4(camera.matrixWorldInverse);
    maxProject
      .applyMatrix4(object.matrixWorld)
      .applyMatrix4(camera.matrixWorldInverse);

    const min = new THREE.Vector3();
    const max = new THREE.Vector3();

    const xMin = Math.min(minProject.x, maxProject.x);
    const xMax = Math.max(minProject.x, maxProject.x);
    const yMin = Math.min(minProject.y, maxProject.y);
    const yMax = Math.max(minProject.y, maxProject.y);
    const zMin = Math.min(minProject.z, maxProject.z);
    const zMax = Math.max(minProject.z, maxProject.z);

    min.set(xMin, yMin, zMin);
    max.set(xMax, yMax, zMax);

    this.projectRect.min.copy(min);
    this.projectRect.max.copy(max);
    //  = { min, max };
    // return ;
  }

  fitObject(selectedObject?: THREE.Mesh) {
    if (selectedObject) this.object = selectedObject;

    const object = this.object as THREE.Mesh;
    if (!object) return;

    object.updateMatrixWorld();

    const temp = new THREE.Vector3();
    temp.copy(this.alignAxis);
    //将相机放到物体坐标系下相对的位置，如果是俯视图，放在其Z上方0.5,如果是正视图，放在其x方向-0.5
    temp.applyMatrix4(object.matrixWorld);

    this.camera.position.copy(temp);

    //举个例子，如果是俯视图，需要将相机的up与物体本身的X轴对齐
    // 如果是正视图，需要将相机的up与物体本身的z轴对齐
    temp
      .copy(axisUpInfo[this.axis].yAxis.dir)
      .applyMatrix4(object.matrixWorld)
      .sub(new THREE.Vector3().applyMatrix4(object.matrixWorld));
    this.camera.up.copy(temp);

    temp.set(0, 0, 0);
    temp.applyMatrix4(object.matrixWorld);
    this.camera.lookAt(temp);
    this.controls.target.copy(temp);

    this.updateProjectRect();
    this.updateCameraProject();
    // this._render();
    // this.updateDom();
    // this.render();
  }

  updateCameraProject() {
    const { projectRect } = this;
    const rectWidth = projectRect.max.x - projectRect.min.x;
    const rectHeight = projectRect.max.y - projectRect.min.y;
    const aspect = this.width / this.height;

    // debugger
    let cameraW = 0;
    let cameraH = 0;
    const padding = Math.min(rectWidth, rectHeight) * this.paddingPercent;
    // let padding = (200 * rectWidth) / this.width;
    cameraW = Math.max(rectWidth + padding, (rectHeight + padding) * aspect);
    cameraH = Math.max(rectHeight + padding, (rectWidth + padding) / aspect);

    this.camera.left = (-cameraW / 2) * this.zoom;
    this.camera.right = (cameraW / 2) * this.zoom;
    this.camera.top = (cameraH / 2) * this.zoom;
    this.camera.bottom = (-cameraH / 2) * this.zoom;
    // debugger
    this.camera.near = -80;
    this.camera.far = projectRect.max.z - projectRect.min.z;
    this.camera.updateProjectionMatrix();

    // this.camera.position.add(this.cameraOffset);
    // this.camera.updateMatrixWorld();
    // this.camera.far = 0;
  }
}
