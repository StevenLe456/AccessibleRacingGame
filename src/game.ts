import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, ShaderMaterial, ImportMeshAsync, BoundingBox} from "@babylonjs/core"
import 'babylonjs-loaders'
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic"
import { Car } from "./car"
import { InputHandler } from "./input"
import { Head } from "./head"
import * as faceDetection from '@tensorflow-models/face-detection';

class GameObj {
    public camvas: HTMLCanvasElement
    public engine: Engine
    public scene: Scene
    public car1: Car
    public car2: Car
    public head1: Head
    public inputty: InputHandler

    constructor(cam: HTMLCanvasElement, e: Engine, s: Scene, c1: Car, c2: Car, h1: Head, i: InputHandler) {
        this.camvas = cam
        this.engine = e
        this.scene = s
        this.car1 = c1
        this.car2 = c2
        this.head1 = h1
        this.inputty = i
    }
}

async function initGame(h1: Head, model: Promise<faceDetection.FaceDetector> , webcam: HTMLVideoElement, cam: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // get canvas
    let canvas = <HTMLCanvasElement> document.getElementById("gameCanvas")
    let camvas = cam

    // initialize babylon scene and engine
    let engine = new Engine(canvas, true)
    let scene = new Scene(engine)

    // add stuff to scene
    registerBuiltInLoaders()
    let mesh1 = <Mesh> (await ImportMeshAsync("models/car1.obj", scene)).meshes[0]
    let mesh2 = <Mesh> (await ImportMeshAsync("models/car2.obj", scene)).meshes[0]
    mesh1.rotate(new Vector3(0, 1, 0), -Math.PI)
    mesh1.refreshBoundingInfo()
    mesh1.computeWorldMatrix(true)
    mesh2.rotate(new Vector3(0, 1, 0), Math.PI)
    mesh2.refreshBoundingInfo()
    mesh2.computeWorldMatrix(true)
    let car1 = new Car(mesh1, -20, 0, 0, scene, 0, "1")
    let car2 = new Car(mesh2, 20, 0, 0, scene, 0.5, "2")
    
    var track: Mesh = MeshBuilder.CreateBox("racetrack", {width: 120, height: 0.01, depth: 10000})
    track.position = new Vector3(0, -0.005, 4900)

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene)

    // initialize input handler
    let inputty = new InputHandler(model, webcam, ctx)
    let head1 = h1

    // add shader and attach it to road
    var rainbowMaterial = new ShaderMaterial("rainbow_road", scene, "./rainbow",
    {
        attributes: ["position"],
        uniforms: ["worldViewProjection"]
    })
    track.material = rainbowMaterial

    return new GameObj(cam, engine, scene, car1, car2, head1, inputty)
}

export function game(h1: Head, model: Promise<faceDetection.FaceDetector> , webcam: HTMLVideoElement, cam: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    initGame(h1, model, webcam, cam, ctx).then((g) => {
        let camvas = g.camvas
        let engine = g.engine
        let scene = g.scene
        let car1 = g.car1
        let car2 = g.car2
        let head1 = g.head1
        let inputty = g.inputty

        // run the main render loop
        engine.runRenderLoop(() => {
            // handle input
            inputty.update(camvas, head1)
            inputty.handle_input(car1)
            // collision detection
            function intersect(a: BoundingBox, b: BoundingBox) {
                let a_min = a.minimumWorld
                let a_max = a.maximumWorld
                let b_min = b.minimumWorld
                let b_max = b.maximumWorld
                return (
                    a_min.x <= b_max.x &&
                    a_max.x >= b_min.x &&
                    a_min.y <= b_max.y &&
                    a_max.y >= b_min.y &&
                    a_min.z <= b_max.z &&
                    a_max.z >= b_min.z
                )
            }
            // update game state
            car1.update()
            // render game
            scene.render()
        })
    })
}