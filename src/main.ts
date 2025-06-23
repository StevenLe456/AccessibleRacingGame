import '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { initFaceModel, getFace } from "./comp_vision"
import { Game } from "./game"

let model = initFaceModel()

let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("stream")
const canvas = <HTMLCanvasElement> document.getElementById('canvas')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {video.srcObject = stream})

let x = <HTMLElement> document.getElementById("x")
let y = <HTMLElement> document.getElementById("y")

async function main() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    model.then(function(m) {
        getFace(m, canvas).then(function(d) {
            console.log(d[0]["keypoints"][2])
        })
    })
    requestAnimationFrame(main)
}

main()

// initialize game
// var game = new Game()
// game.update()