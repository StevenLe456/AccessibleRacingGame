import { Car } from "./car"
import { getFace } from "./comp_vision"
import { Head } from "./head"
import * as faceDetection from '@tensorflow-models/face-detection';

export class InputHandler {
    private car1_state_x: number
    private car1_state_y: number
    private model
    private video: HTMLVideoElement
    private ctx

    constructor(model: Promise<faceDetection.FaceDetector>, video: HTMLVideoElement, ctx: CanvasRenderingContext2D) {
        this.car1_state_x = 0
        this.car1_state_y = 0
        this.model = model
        this.video = video
        this.ctx = ctx
    }

    async update(canvas: HTMLCanvasElement, head1: Head) {
        this.ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
        let car1_state = await this.model.then(function(m) {
            return getFace(m, canvas).then(function(d) {
                let k = d[0]["keypoints"]
                let data = [k[0]["x"], k[0]["y"], k[1]["x"], k[1]["y"], k[2]["x"], k[2]["y"], k[3]["x"], k[3]["y"]]
                // return prediction
                return head1.predict(data)
            }).catch(function(error) {
                return [0, 0]
            })
        })
        this.car1_state_x = car1_state[0]
        this.car1_state_y = car1_state[1]
    }

    handle_input(car1: Car) {
        if (this.car1_state_x == 1) {
            car1.turn_left()
            console.log("left")
        }
        else if (this.car1_state_x == 2) {
            car1.turn_right
            console.log("right")
        }
        else {
            // pass
            console.log("no turn")
        }
        if (this.car1_state_y == 1) {
            car1.accelerate()
            console.log("go fast")
        }
        else if (this.car1_state_y == 2) {
            car1.decelerate()
            console.log("go slow")
        }
        else {
            // pass
            console.log("no speed change")
        }
    }
}