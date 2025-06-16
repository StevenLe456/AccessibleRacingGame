import {Car} from "./car"

export class InputHandler {
    private car1_state: number

    constructor() {
        this.car1_state = 0
        
        // bind keys to game (delete this functionality after computer vision module is coded)
        document.addEventListener("keydown", (e) => {
            if ((e as KeyboardEvent).key === "a") {
                this.car1_state = 1
            }
            else if ((e as KeyboardEvent).key === "d") {
                this.car1_state = 2
            }
            else if ((e as KeyboardEvent).key === "w") {
                this.car1_state = 3
            }
            else if ((e as KeyboardEvent).key === "s") {
                this.car1_state = 4
            }
            else {
                // pass
            }
        })

        document.addEventListener("keyup", (e) => {
            this.car1_state = 0
        })
    }

    handle_input(car1: Car) {
        if (this.car1_state == 1) {
            // turn car to the left
            car1.turn_left()
        }
        else if (this.car1_state == 2) {
            // turn car to the right
            car1.turn_right()
        }
        else if (this.car1_state == 3) {
            car1.accelerate()
        }
        else if (this.car1_state == 4) {
            car1.decelerate()
        }
        else {
            // pass
        }
    }
}