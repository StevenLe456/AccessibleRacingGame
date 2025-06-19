import { Game } from "./game"
import { initVideo } from "./cv"

let video: HTMLVideoElement = initVideo()
var game = new Game()
game.update()