import '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { initFaceModel, getFace } from "./comp_vision"
import { Game } from "./game"
import { Head } from './head';

// init stuff
let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("videoElement")
const canvas = <HTMLCanvasElement> document.getElementById('stream')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {video.srcObject = stream})
let model = initFaceModel()

// do head calibration


// head calibration (instead of hard-coding values for head, do a calibration check)
let head1 = new Head(200, 185, 215, 90, 110)

// initialize game
var game = new Game(head1, model, video, canvas, ctx)
game.update()