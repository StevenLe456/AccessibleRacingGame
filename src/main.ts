import { Game } from "./game"
import { faceMesh, initVideo, load } from "./cv"
import { Head } from "./head"
import * as face from '@tensorflow-models/face-landmarks-detection'

// average keypointss function
function avgKeyPointss(arr: Object[][]): Object[] {
    let result: Object[] = []
    for (let i = 0; i < 478; i++) {
        let x = 0
        let y = 0
        for (let j = 0; j < 6; j++) {
            x += <number> <unknown> arr[j][i]["x" as keyof Object]
            y += <number> <unknown> arr[j][i]["y" as keyof Object]
        }
        result.push({"x": x / 6.0, "y": y / 6.0})
    }
    return result
}

// sleep function
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// initialize UI stuff
let game_div = document.getElementById("game")
if (game_div != undefined) {
    game_div.style.display = "none"
}

// initialize webcam feed and face detector
let video: HTMLVideoElement = initVideo();
let detector: face.FaceLandmarksDetector | undefined = undefined
load().then(x => {detector = x});

// head calibration
let image: HTMLImageElement = <HTMLImageElement> document.getElementById("cue")
let instruct = document.getElementById("instruct"); // semicolon needed
(async () => {
    await delay(3000)
})()
if (instruct != undefined) {
    instruct.innerHTML = "Hold still."
}
let still: Object[][] = []
for (let i = 0; i < 3; i++) {
    (async () => {
        if (detector != undefined && video != undefined) {
            let dummy: face.Face[] = await faceMesh(detector, video)
            still.push(<Object[]> <unknown> dummy[0]["keypoints" as keyof Object])
        }
    })()
}
console.log(still)
let f = avgKeyPointss(still);
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
let right: Object[][] = []
for (let i = 0; i < 6; i++) {
    (async () => {
        if (detector != undefined && video != undefined) {
            let dummy: face.Face[] = await faceMesh(detector, video)
            right.push(<Object[]> <unknown> dummy[0]["keypoints" as keyof Object])
        }
    })()
}
let r = avgKeyPointss(right);
if (instruct != undefined && image != undefined) {
    instruct.innerHTML = "Now turn your head to the left."
    image.src = "img/head_left"
}
(async () => {
    await delay(3000)
})()
if (instruct != undefined) {
    instruct.innerHTML = "Hold still."
}
let left: Object[][] = []
for (let i = 0; i < 6; i++) {
    (async () => {
        if (detector != undefined && video != undefined) {
            let dummy: face.Face[] = await faceMesh(detector, video)
            left.push(<Object[]> <unknown> dummy[0]["keypoints" as keyof Object])
        }
    })()
}
let l = avgKeyPointss(left);
if (instruct != undefined && image != undefined) {
    instruct.innerHTML = "Now tilt your head up."
    image.src = "img/head_up"
}
(async () => {
    await delay(3000)
})()
if (instruct != undefined) {
    instruct.innerHTML = "Hold still."
}
let up: Object[][] = []
for (let i = 0; i < 6; i++) {
    (async () => {
        if (detector != undefined && video != undefined) {
            let dummy: face.Face[] = await faceMesh(detector, video)
            up.push(<Object[]> <unknown> dummy[0]["keypoints" as keyof Object])
        }
    })()
}
let u = avgKeyPointss(up);
if (instruct != undefined && image != undefined) {
    instruct.innerHTML = "Now tilt your head down."
    image.src = "img/head_down"
}
(async () => {
    await delay(3000)
})()
if (instruct != undefined) {
    instruct.innerHTML = "Hold still."
}
let down: Object[][] = []
for (let i = 0; i < 6; i++) {
    (async () => {
        if (detector != undefined && video != undefined) {
            let dummy: face.Face[] = await faceMesh(detector, video)
            down.push(<Object[]> <unknown> dummy[0]["keypoints" as keyof Object])
        }
    })()
}
let d = avgKeyPointss(down);

let player1 = new Head(f, r, l, u, d);

// initialize game
var game = new Game()
game.update()