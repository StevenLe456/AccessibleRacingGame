import { Game } from "./game"
import { faceMesh, initVideo, load } from "./cv"
import * as face from '@tensorflow-models/face-landmarks-detection'

// sleep function
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// initialize UI stuff
let game_div = document.getElementById("game")
if (game_div != undefined) {
    game_div.style.display = "none"
}

// initialize webcam feed and face detector
let video: HTMLVideoElement = initVideo()
let detector: face.FaceLandmarksDetector | undefined = undefined
load().then(x => {detector = x})

// head calibration
let image: HTMLImageElement = <HTMLImageElement> document.getElementById("cue")
let instruct = document.getElementById("instruct"); // semicolon needed
(async () => {
    await delay(3000)
})()
if (instruct != undefined) {
    instruct.innerHTML = "Hold still."
}
let still = []
for (let i = 0; i < 6; i++) {
    (async () => {
        if (detector != undefined) {
            let dummy: Object[] = await faceMesh(detector, video)
            still.push(dummy[0]["keypoint" as keyof Object])
        }
    })()
}
if (instruct != undefined && image != undefined) {
    instruct.innerHTML = "Now turn your head to the right."
    image.src = "img/head_right"
}
(async () => {
    await delay(3000)
})()
if (instruct != undefined) {
    instruct.innerHTML = "Hold still."
}

// initialize game
var game = new Game()
game.update()