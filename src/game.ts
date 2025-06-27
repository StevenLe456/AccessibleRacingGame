import { Engine, Scene, Vector3, HemisphericLight, Mesh, MeshBuilder, ShaderMaterial, ImportMeshAsync, Color4, ISceneLoaderAsyncResult, AbstractMesh, HavokPlugin, PhysicsAggregate, PhysicsShapeType} from "@babylonjs/core"
import 'babylonjs-loaders'
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic"
import { Car } from "./car"
import { InputHandler } from "./input"
import { Head } from "./head"
import * as faceDetection from '@tensorflow-models/face-detection';
import { havokModule } from "./havok"

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
    const plugin = new HavokPlugin(true, await havokModule)
    scene.enablePhysics(new Vector3(0, 0, 0), plugin)

    // add stuff to scene
    registerBuiltInLoaders()
    let mesh1 = await ImportMeshAsync("models/rainbow_car.obj", scene).then(function(s) {return <Mesh> s.meshes[0]})
    let mesh2 = await ImportMeshAsync("models/bland_car.obj", scene).then(function(s) {return <Mesh> s.meshes[0]})
    let car1 = new Car(mesh1, -20, 0, 0, scene, 0, "1")
    let car2 = new Car(mesh2, 20, 0, 0, scene, 0.5, "2")
    
    var track: Mesh = MeshBuilder.CreateBox("racetrack", {width: 80, height: 0.01, depth: 10000})
    track.position = new Vector3(0, -0.005, 4050)
    var rail1: Mesh = MeshBuilder.CreateBox("rail1", {width: 1, height: 4, depth: 10000})
    rail1.position = new Vector3(-40.5, 2, 4050)
    var rail2: Mesh = MeshBuilder.CreateBox("rail2", {width: 1, height: 4, depth: 10000})
    rail2.position = new Vector3(40.5, 2, 4050)
    let track_physics = new PhysicsAggregate(track, PhysicsShapeType.BOX, {mass: 0}, scene)
    let rail1_physics = new PhysicsAggregate(rail1, PhysicsShapeType.BOX, {mass: 1000}, scene)
    let rail2_physics = new PhysicsAggregate(rail2, PhysicsShapeType.BOX, {mass: 100}, scene)

    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene)

    // physics and collision stuff
    const observable = plugin.onCollisionObservable;
    const observer = observable.add((collisionEvent) => {
        if ((collisionEvent.collider == car1.phys_aggr.body) && (collisionEvent.collidedAgainst == rail1_physics.body || collisionEvent.collidedAgainst == rail2_physics.body)) {
            car1.impulse(0, 0, 100, 0, -0.5)
        }
        if ((collisionEvent.collider == car2.phys_aggr.body) && (collisionEvent.collidedAgainst == rail1_physics.body || collisionEvent.collidedAgainst == rail2_physics.body)) {
            car2.impulse(0, 0, 100, 0, -0.5)
        }
        if (collisionEvent.collider == car1.phys_aggr.body && collisionEvent.collidedAgainst == car2.phys_aggr.body) {
            car1.impulse(car2.velocity, -car2.velocity * Math.random(), car2.mass, car2.rotation, Math.random())
        }
        if (collisionEvent.collider == car2.phys_aggr.body && collisionEvent.collidedAgainst == car1.phys_aggr.body) {
            car2.impulse(car1.velocity, -car1.velocity * Math.random(), car1.mass, car1.rotation, Math.random())
        }
    });

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
            // update game state
            car1.update()
            // render game
            scene.render()
        })
    })
}