import { Engine, Scene, Vector3, HemisphericLight } from "@babylonjs/core"

import { Car } from "./car"

export class Game {
    private canvas
    private engine
    private scene
    private car1: Car

    constructor() {
        // get canvas
        this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas")

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)

        // add car and light to scene
        this.car1 = new Car(0, 0, 0, 1, 0, 0, this.scene, "1")
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene)
    }

    update() {
        // run the main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render()
        })
    }
}