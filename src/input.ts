import { Car } from "./car"
import { getFace, initFaceModel } from "./comp_vision"
import { Head } from "./head"
import * as faceDetection from '@tensorflow-models/face-detection';

export class InputHandler {
    private car1_state: number
    private model
    private video: HTMLVideoElement
    private ctx

    constructor(model: Promise<faceDetection.FaceDetector>, video: HTMLVideoElement, ctx: CanvasRenderingContext2D) {
        this.car1_state = 0
        this.model = model
        this.video = video
        this.ctx = ctx
    }

    async update(canvas: HTMLCanvasElement, head1: Head) {
        this.ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
        this.car1_state = await this.model.then(function(m) {
            return getFace(m, canvas).then(function(d) {
                let x = d[0]["keypoints"][2]["x"]
                let y = d[0]["keypoints"][2]["y"]
                if (x < head1.left) {
                    return 1
                }
                else if (x > head1.right) {
                    return 2
                }
                else if (y < head1.up) {
                    return 3
                }
                else if (y > head1.down) {
                    return 4
                }
                else {
                    return 0
                }
            }).catch(function(error) {
                return 0
            })
        })
    }

    handle_input(car1: Car) {
        console.log(this.car1_state)
        if (this.car1_state == 1) {
            // turn car to the left
            car1.turn_left()
        }
        else if (this.car1_state == 2) {
            // turn car to the right
            car1.turn_right()
        }
        else if (this.car1_state == 3) {
            car1.accelerate()
        }
        else if (this.car1_state == 4) {
            car1.decelerate()
        }
        else {
            // pass
        }
    }
}