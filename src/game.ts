import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core"

export class Game {
    private canvas
    private engine
    private scene

    constructor() {
        // get canvas
        this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas")

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)

        var camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene)
        camera.attachControl(this.canvas, true)
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene)
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this.scene)
    }

    update() {
        // run the main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render()
        })
    }
}