import '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { initFaceModel, getFace } from "./comp_vision"
import { Game } from "./game"
import { Head } from './head';

let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("videoElement")
const canvas = <HTMLCanvasElement> document.getElementById('stream')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {video.srcObject = stream})

// async function main() {
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
//     model.then(function(m) {
//         getFace(m, canvas).then(function(d) {
//             x.innerHTML = d[0]["keypoints"][2]["x"].toString()
//             y.innerHTML = d[0]["keypoints"][2]["y"].toString()
//         }).catch(function(error) {
//             x.innerHTML = "undefined"
//             y.innerHTML = "undefined"
//         })
//     })
//     requestAnimationFrame(main)
// }

// main()

// head calibration (instead of hard-coding values for head, do a calibration check)
let head1 = new Head(185, 215, 90, 110)

// initialize game
var game = new Game(head1, video, canvas, ctx)
game.update()