import { Game } from "./game"
import { initVideo, load } from "./cv"

let video: HTMLVideoElement = initVideo(); // needs a semicolon for some reason
(async () => {
    let detector = await load()
})()
var game = new Game()
game.update()