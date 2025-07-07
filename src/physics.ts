import { BoundingBox, Vector3 } from "@babylonjs/core";

export function collisionAABB(bb1: BoundingBox, bb2: BoundingBox, dx: number, dy: number, dz: number) {
    function between(x: number, a: number, b: number) {
        return x >= a && x <= b
    }
    let mx = bb2.minimumWorld.x - (bb1.minimumWorld.x + (bb1.maximumWorld.x - bb1.minimumWorld.x))
    let my = bb2.minimumWorld.y - (bb1.minimumWorld.y + (bb1.maximumWorld.y - bb1.minimumWorld.y))
    let mz = bb2.minimumWorld.z - (bb1.minimumWorld.z + (bb1.maximumWorld.z - bb1.minimumWorld.z))
    let mhx = (bb1.maximumWorld.x - bb1.minimumWorld.x) + (bb2.maximumWorld.x - bb2.minimumWorld.x)
    let mhy = (bb1.maximumWorld.y - bb1.minimumWorld.y) + (bb2.maximumWorld.y - bb2.minimumWorld.y)
    let mhz = (bb1.maximumWorld.z - bb1.minimumWorld.z) + (bb2.maximumWorld.z - bb2.minimumWorld.z)
    let h = 1;
    let s = 0;
    let nx = 0;
    let ny = 0;
    let nz = 0;
    s = collisionLinePlane(0, 0, 0, dx, dy, dz, mx, my, mz, -1, 0, 0)
    if (s >= 0 && dx > 0 && s < h && between(s*dy,my,my+mhy) && between(s*dz,mz,mz+mhz)) {
        h = s
        nx = -1
        ny = 0
        nz = 0
    }
    s = collisionLinePlane(0, 0, 0, dx, dy, dz, mx+mhx, my, mz, 1, 0, 0)
    if (s >= 0 && dx < 0 && s < h && between(s*dy, my, my+mhy) && between(s*dz, mz, mz+mhz)) {
        h = s
        nx = 1
        ny = 0
        nz = 0
    }
    s = collisionLinePlane(0, 0, 0, dx, dy, dz, mx, my, mz, 0, -1, 0)
    if (s >= 0 && dy > 0 && s < h && between(s*dx, mx, mx+mhx) && between(s*dz, mz, mz+mhz)) {
        h = s
        nx = 0
        ny = -1
        nz = 0
    }
    s = collisionLinePlane(0, 0, 0, dx, dy, dz, mx, my+mhy, mz, 0, 1, 0)
    if (s >= 0 && dy < 0 && s < h && between(s*dx, mx, mx+mhx) && between(s*dz, mz, mz+mhz)) {
        h = s
        nx = 0
        ny = 1
        nz = 0
    }
    s = collisionLinePlane(0, 0, 0, dx, dy, dz, mx, my, mz, 0, 0, -1)
    if (s >= 0 && dz > 0 && s < h && between(s*dx, mx, mx+mhx) && between(s*dy, my, my+mhy)) {
        h = s
        nx = 0
        ny = 0
        nz = -1
    }
    s = collisionLinePlane(0, 0, 0, dx, dy, dz, mx, my, mz+mhz, 0, 0, 1)
    if (s >= 0 && dz < 0 && s < h && between(s*dx, mx, mx+mhx) && between(s*dy, my, my+mhy)) {
        h = s
        nx = 0
        ny = 0
        nz = 1
    }
    return {"h": h, "nx": nx, "ny": ny, "nz": nz}
}

export function collisionLinePlane(px: number, py: number, pz: number, ux: number, uy: number, uz: number, vx: number, vy: number, vz: number, nx: number, ny: number, nz: number) {
    let nDotU = nx * ux + ny * uy + nz * uz
    if (nDotU == 0) {
        return Infinity
    }
    return (nx*(vx-px) + ny*(vy-py) + nz*(vz-pz)) / nDotU
}