import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder} from "@babylonjs/core"

import { Car } from "./car"
import {InputHandler} from "./input"

export class Game {
    private canvas
    private engine
    private scene
    private car1: Car
    private car2: Car
    private inputty: InputHandler

    constructor() {
        // get canvas
        this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas")
        
        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)

        // add stuff to scene
        this.car1 = new Car(-10, 0, 0, 1, 0, 0, this.scene, 0, "1")
        this.car2 = new Car(10, 0, 0, 0, 1, 0, this.scene, 0.5, "2")
        var track: Mesh = MeshBuilder.CreateBox("racetrack", {width: 40, height: 0.01, depth: 1000})
        track.position = new Vector3(0, -0.005, 450)
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene)

        // initialize input handler
        this.inputty = new InputHandler()
    }

    update() {
        // run the main render loop
        this.engine.runRenderLoop(() => {
            // handle input
            this.inputty.handle_input(this.car1)
            // update game state
            this.car1.update()
            // render game
            this.scene.render()
        })
    }
}