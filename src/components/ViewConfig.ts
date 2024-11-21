import * as THREE from "three";

export enum ViewType {
    PERSPECTIVE = "perspective",
    SIDE = "side",
    FRONT = "front",
    TOP = "top",
}

export const SideAxis = new Map([
    [ViewType.TOP, "z"],
    [ViewType.SIDE, "-y"],
    [ViewType.FRONT, "-x"],
]);

export const axisUpInfo = {
    x: {
        yAxis: { axis: "z", dir: new THREE.Vector3(0, 0, 1) },
        xAxis: { axis: "y", dir: new THREE.Vector3(0, 1, 0) },
    },
    "-x": {
        yAxis: { axis: "z", dir: new THREE.Vector3(0, 0, 1) },
        xAxis: { axis: "y", dir: new THREE.Vector3(0, -1, 0) },
    },
    z: {
        yAxis: { axis: "x", dir: new THREE.Vector3(1, 0, 0) },
        xAxis: { axis: "y", dir: new THREE.Vector3(0, -1, 0) },
    },
    // '-z': {
    //     yAxis: { axis: 'y', dir: new THREE.Vector3(0, 1, 0) },
    //     xAxis: { axis: 'x', dir: new THREE.Vector3(-1, 0, 0) },
    // },
    y: {
        yAxis: { axis: "z", dir: new THREE.Vector3(0, 0, 1) },
        xAxis: { axis: "x", dir: new THREE.Vector3(-1, 0, 0) },
    },
    "-y": {
        yAxis: { axis: "z", dir: new THREE.Vector3(0, 0, 1) },
        xAxis: { axis: "x", dir: new THREE.Vector3(1, 0, 0) },
    },
};

export type AxisType = keyof typeof axisUpInfo;
