import { BoundingBox, Mesh } from "@babylonjs/core";

export class Entity {
    public mesh: Mesh
    public bounding_box: BoundingBox

    constructor(mesh: Mesh) {
        this.mesh = mesh
        this.bounding_box = this.mesh.getBoundingInfo().boundingBox
    }

    update() {
        this.mesh.refreshBoundingInfo()
        this.mesh.computeWorldMatrix(true)
    }
}