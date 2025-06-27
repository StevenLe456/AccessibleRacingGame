import { argMax, gaussian_dist } from "./stats_util"

export class Head {
    private means
    private vars

    constructor(m: number[][], v: number[][]) {
        this.means = m
        this.vars = v
    }

    predict(x: number[]) {
        let class_probs: number[] = []
        for (let j = 0; j < this.means.length; j++) {
            let a = this.means[j]
            let b = this.vars[j]
            let posterior = j == 0 ? 0.4 : 0.3
            for (let i = 0; i < this.means.length; i++) {
                posterior *= gaussian_dist(x[i], a[i], b[i])
            }
            class_probs.push(posterior)
        }
        let x_dir = [class_probs[0], class_probs[1], class_probs[2]]
        let y_dir = [class_probs[0], class_probs[3], class_probs[4]]
        return [argMax(x_dir), argMax(y_dir)]
    }
}