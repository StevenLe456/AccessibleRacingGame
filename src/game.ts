import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, ShaderMaterial, ImportMeshAsync, Color4, ISceneLoaderAsyncResult, AbstractMesh} from "@babylonjs/core"
import 'babylonjs-loaders'
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic"
import { Car } from "./car"
import { InputHandler } from "./input"
import { Head } from "./head"
import * as faceDetection from '@tensorflow-models/face-detection';

export class Game {
    private canvas
    private camvas
    private engine
    private scene
    private car1: Car
    private car2: Car
    private head1: Head
    private inputty: InputHandler

    constructor(head1: Head, model: Promise<faceDetection.FaceDetector> , webcam: HTMLVideoElement, camvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        // get canvas
        this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas")
        this.camvas = camvas

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)

        // add stuff to scene
        registerBuiltInLoaders()
        let mesh1: Promise<Mesh> = ImportMeshAsync("models/rainbow_car.obj", this.scene).then(function(s) {return <Mesh> s.meshes[0]})
        let mesh2: Mesh = MeshBuilder.CreateBox("boxen", {size: 1}, this.scene)
        let dummy_mesh: Mesh = MeshBuilder.CreateBox("dummy", {size: 1}, this.scene)
        this.scene.meshes.pop()
        this.car1 = new Car(dummy_mesh, -20, 0, 0, this.scene, 0, "1")
        mesh1.then((m) => {
            this.car1 = new Car(m, -20, 0, 0, this.scene, 0, "1")
        })
        this.car2 = new Car(mesh2, 20, 0, 0, this.scene, 0.5, "2")
        var track: Mesh = MeshBuilder.CreateBox("racetrack", {width: 80, height: 0.01, depth: 10000})
        track.position = new Vector3(0, -0.005, 4050)
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene)

        // initialize input handler
        this.inputty = new InputHandler(model, webcam, ctx)
        this.head1 = head1

        // add shader and attach it to road
        var rainbowMaterial = new ShaderMaterial("rainbow_road", this.scene, "./rainbow",
        {
            attributes: ["position"],
            uniforms: ["worldViewProjection"]
        })
        track.material = rainbowMaterial
    }

    update() {
        // run the main render loop
        this.engine.runRenderLoop(() => {
            // handle input
            this.inputty.update(this.camvas, this.head1)
            this.inputty.handle_input(this.car1)
            // update game state
            this.car1.update()
            // render game
            this.scene.render()
        })
    }
}