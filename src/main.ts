import * as tf from '@tensorflow/tfjs';
import { initModel, getPred } from "./comp_vision"
import { Game } from "./game"

let model = initModel()

let y: HTMLElement = <HTMLElement> document.getElementById("yaw")
let p: HTMLElement = <HTMLElement> document.getElementById("pitch")
let r: HTMLElement = <HTMLElement> document.getElementById("roll")
let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("stream")
const canvas = <HTMLCanvasElement> document.getElementById('canvas');
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {video.srcObject = stream})

let idxs = []
for (let i = 0; i < 66; i++) {
    idxs.push(i)
}
let idx_tensor = tf.tensor(idxs)

async function main() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    model.then(function(m) {
        let x: tf.Tensor[] = <tf.Tensor[]> getPred(m, canvas);
        let yaw = x[0]
        let pitch = x[1]
        let roll = x[2]
        tf.sum(yaw.softmax().mul(idx_tensor)).data().then(function(x){return x[0] * 3 - 99}).then(function(n){y.innerHTML = "Yaw: " + n})
        tf.sum(pitch.softmax().mul(idx_tensor)).data().then(function(x){return x[0] * 3 - 99}).then(function(n){p.innerHTML = "Pitch: " + n})
        tf.sum(roll.softmax().mul(idx_tensor)).data().then(function(x){return x[0] * 3 - 99}).then(function(n){r.innerHTML = "Roll: " + n})
    })
    requestAnimationFrame(main) 
}

main()

// initialize game
// var game = new Game()
// game.update()