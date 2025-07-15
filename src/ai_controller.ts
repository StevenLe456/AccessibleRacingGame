import { Car } from "./car";
import { Entity } from "./entity";

enum CarState {CRUISE, COLLIDED, OBSTRUCTED_1, OBSTRUCTED_2, OBSTRUCTED_3}

export class AIController {
    private car: Car
    private opp: Car
    private obstacles: Entity[]
    private v_time = 0
    private min_velocity = 0.5
    private max_velocity = 3
    private state: CarState = CarState.CRUISE
    private goal_x = 0
    private goal_z = 0
    private flag = false

    constructor(c: Car, opp: Car, obs: Entity[]) {
        this.car = c
        this.opp = opp
        this.obstacles = obs
    }

    drive() {
        console.log(this.state)
        if (this.state == CarState.CRUISE) {
            if (this.opp.z - this.car.z >= 100 && this.car.velocity < this.max_velocity) {
                this.v_time++
                if (this.v_time % 6 == 0) {
                    this.car.accelerate()
                }
            }
            else if ((this.opp.z - this.car.z >= 75 || this.car.z - this.opp.z >= 300) && this.car.velocity > this.min_velocity) {
                this.v_time++
                if (this.v_time % 6 == 0) {
                    this.car.decelerate()
                }
            }
            else {
                this.v_time = 0
            }
            if (this.car.rotation > 0) {
                this.car.turn_left()
            }
            else if (this.car.rotation < 0) {
                this.car.turn_right
            }
            else {
                this.car.rotation = 0
            }
            if (this.car.velocity < 0) {
                this.state = CarState.COLLIDED
            }
            if (this.car.z % 200 > 100) {
                this.state = CarState.OBSTRUCTED_1
            }
        }
        else if (this.state == CarState.OBSTRUCTED_1) {
            let idx = Math.floor(this.car.z / 200.0)
            this.goal_x = this.obstacles[idx].mesh.position.x
            if (this.goal_x > 60) {
                this.goal_x = this.obstacles[idx].mesh.position.x
                this.goal_z = this.obstacles[idx].mesh.position.z
            }
            this.car.decelerate()
            if (this.car.velocity <= 0) {
                this.car.velocity = 0
                this.state = CarState.OBSTRUCTED_3
            }
        }
        // else if (this.state == CarState.OBSTRUCTED_2) {
        //     let theta = Math.atan2(this.goal_x - this.car.x, this.goal_z - this.car.z)
        //     this.car.rotation = theta
        //     this.state = CarState.OBSTRUCTED_3
        // }
        else if (this.state == CarState.OBSTRUCTED_3) {
            if (this.goal_x > 0) {
                this.car.turn_left()
            }
            else {
                this.car.turn_right()
            }
            this.car.accelerate()
            if (this.car.velocity >= 0.75) {
                this.state = CarState.CRUISE
            }
            else if (this.car.velocity < 0) {
                this.state = CarState.COLLIDED
            }
        }
        else {
            if (this.car.x < 0) {
                this.car.turn_right()
            }
            else {
                this.car.turn_left()
            }
            this.car.accelerate()
            if (this.car.velocity >= 0.5) {
                this.state = CarState.CRUISE
            }
        }
    }
}