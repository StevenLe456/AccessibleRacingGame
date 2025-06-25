import '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
import { initFaceModel, getFace } from "./comp_vision"
import { Game } from "./game"
import { Head } from './head';
import { mean_var } from './stats_util';

// init stuff
let video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("videoElement")
let other_video: HTMLVideoElement = <HTMLVideoElement> document.getElementById("webby")
let canvas = <HTMLCanvasElement> document.getElementById('stream')
let lefty = <HTMLCanvasElement> document.getElementById("feed")
//let righty = <HTMLCanvasElement> document.getElementById("right")
const l_ctx = <CanvasRenderingContext2D> lefty.getContext('2d')
//const r_ctx = <CanvasRenderingContext2D> righty.getContext('2d')
const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
let arr: Promise<number[]> = navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {other_video.srcObject = stream; let {width, height} = stream.getVideoTracks()[0].getSettings(); return <number[]> [width, height];})
let model = initFaceModel()
let hc_state = 0
let tim = 0
let instruction = <HTMLElement> document.getElementById("instructions")
let pic = <HTMLImageElement> document.getElementById("clue")
let data_0: number[][] = []
let data_1: number[][] = []
let data_2: number[][] = []
let data_3: number[][] = []
let data_4: number[][] = []
let head1: Head

function main() {
    console.log(hc_state)
    arr.then(function(a) {
        //l_ctx.drawImage(other_video, 0, 0, a[0] / 2, a[1], 0, 0, lefty.width, lefty.height)
        //r_ctx.drawImage(other_video, a[0] / 2, 0, a[0] / 2, a[1], 0, 0, righty.width, righty.height)
        l_ctx.drawImage(other_video, 0, 0, lefty.width, lefty.height)
    })
    if (hc_state == 0) {
        instruction.innerHTML = "Look towards the camera with your head held upright."
        pic.src = "img/head_still.png"
        tim++
    }
    else if (hc_state == 1) {
        instruction.innerHTML = "Hold still."
        model.then(function(m) {
            getFace(m, lefty).then(function(f) {
                console.log(f)
                if (f[0] != undefined) {
                    let k = f[0]["keypoints"]
                    data_0.push([k[0]["x"], k[0]["y"], k[1]["x"], k[1]["y"], k[2]["x"], k[2]["y"], k[3]["x"], k[3]["y"]])
                    tim++
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    }
    else if (hc_state == 2) {
        instruction.innerHTML = "Turn your head slightly to the left."
        pic.src = "img/head_left.png"
        tim++
    }
    else if (hc_state == 3) {
        instruction.innerHTML = "Hold still."
        model.then(function(m) {
            getFace(m, lefty).then(function(f) {
                if (f[0] != undefined) {
                    let k = f[0]["keypoints"]
                    data_1.push([k[0]["x"], k[0]["y"], k[1]["x"], k[1]["y"], k[2]["x"], k[2]["y"], k[3]["x"], k[3]["y"]])
                    tim++
                }
            })
        })
    }
    else if (hc_state == 4) {
        instruction.innerHTML = "Turn your head slightly to the right."
        pic.src = "img/head_right.png"
        tim++
    }
    else if (hc_state == 5) {
        instruction.innerHTML = "Hold still."
        model.then(function(m) {
            getFace(m, lefty).then(function(f) {
                if (f[0] != undefined) {
                    let k = f[0]["keypoints"]
                    data_2.push([k[0]["x"], k[0]["y"], k[1]["x"], k[1]["y"], k[2]["x"], k[2]["y"], k[3]["x"], k[3]["y"]])
                    tim++
                }
            })
        })
    }
    else if (hc_state == 6) {
        instruction.innerHTML = "Tilt your head slightly up."
        pic.src = "img/head_up.png"
        tim++
    }
    else if (hc_state == 7) {
        instruction.innerHTML = "Hold still."
        model.then(function(m) {
            getFace(m, lefty).then(function(f) {
                if (f[0] != undefined) {
                    let k = f[0]["keypoints"]
                    data_3.push([k[0]["x"], k[0]["y"], k[1]["x"], k[1]["y"], k[2]["x"], k[2]["y"], k[3]["x"], k[3]["y"]])
                    tim++
                }
            })
        })
    }
    else if (hc_state == 8) {
        instruction.innerHTML = "Tilt your head slightly down."
        pic.src = "img/head_down.png"
        tim++
    }
    else if (hc_state == 9) {
        instruction.innerHTML = "Hold still."
        model.then(function(m) {
            getFace(m, lefty).then(function(f) {
                if (f[0] != undefined) {
                    let k = f[0]["keypoints"]
                    data_4.push([k[0]["x"], k[0]["y"], k[1]["x"], k[1]["y"], k[2]["x"], k[2]["y"], k[3]["x"], k[3]["y"]])
                    tim++
                }
            })
        })
    }
    else if (hc_state == 10) {
        instruction.innerHTML = "Relax your head. Currently calibrating controls. Will redirect afterwards."
        pic.src = "img/head_still.png"
        tim += 45
    }
    else if (hc_state == 11) {
        // Do Gaussian Naive Bayes to calculate head stuff
        let d0_stat = mean_var(data_0)
        let d1_stat = mean_var(data_1)
        let d2_stat = mean_var(data_2)
        let d3_stat = mean_var(data_3)
        let d4_stat = mean_var(data_4)
        let means = [d0_stat[0], d1_stat[0], d2_stat[0], d3_stat[0], d4_stat[0]]
        let vars = [d0_stat[1], d1_stat[1], d2_stat[1], d3_stat[1], d4_stat[1]]

        // head
        head1 = new Head(means, vars)

        // prepare for game
        let ui: HTMLElement = <HTMLElement> document.getElementById("head-calibration")
        ui.style.display = "none"
        let gamey: HTMLElement = <HTMLElement> document.getElementById("game")
        gamey.style.display = "block"
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {video.srcObject = stream})
        tim = 45 * 5
    }
    if (tim >= 45 * 5) {
        tim = 0
        hc_state++
    }
    if (hc_state < 12) {
        setTimeout(main, 1000 / 45)
    }
    else {
        // initialize game
        var game = new Game(head1, model, video, canvas, ctx)
        game.update()
    }
}

main()