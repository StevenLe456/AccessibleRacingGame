import '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { initFaceModel, getFace } from "./comp_vision"
import { Game } from "./game"
import { Head } from './head';

// init stuff
let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("videoElement")
let other_video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("webby")
const canvas = <HTMLCanvasElement> document.getElementById('stream')
const lefty = <HTMLCanvasElement> document.getElementById("left")
const righty = <HTMLCanvasElement> document.getElementById("right")
const l_ctx = <CanvasRenderingContext2D> lefty.getContext('2d')
const r_ctx = <CanvasRenderingContext2D> righty.getContext('2d')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
let arr: Promise<number[]> = navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {other_video.srcObject = stream; let {width, height} = stream.getVideoTracks()[0].getSettings(); return <number[]> [width, height];})
let model = initFaceModel()

function head_calibration() {
    arr.then(function(a) {
        l_ctx.drawImage(other_video, 0, 0, a[0] / 2, a[1], 0, 0, lefty.width, lefty.height)
        r_ctx.drawImage(other_video, a[0] / 2, 0, a[0] / 2, a[1], 0, 0, righty.width, righty.height)
    })
    setTimeout(head_calibration, 1000 / 30);
}

head_calibration()

/*
// head calibration (instead of hard-coding values for head, do a calibration check)
let head1 = new Head(200, 185, 215, 90, 110)

// prepare for game
let ui: HTMLElement = <HTMLElement> document.getElementById("head-calibration")
ui.style.display = "none"
let gamey: HTMLElement = <HTMLElement> document.getElementById("game")
gamey.style.display = "block"
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {video.srcObject = stream})

// initialize game
var game = new Game(head1, model, video, canvas, ctx)
game.update()
*/ // uncomment later