export function mean_var(a: number[][]) {
    let res: number[][] = [[], []]
    for (let i = 0; i < a[0].length; i++) {
        let m = 0
        let sd = 0
        let n = 0
        for (let j = 0; j < a.length; j++) {
            m += a[j][i]
            n++
        }
        m /= n
        for (let j = 0; j < a.length; j++) {
            sd += Math.pow(a[j][i] - m, 2)
        }
        sd /= n
        res[0].push(m)
        res[1].push(sd)
    }
    return res
}

export function gaussian_dist(x: number, mean: number, variance: number) {
    return (1.0 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-(Math.pow((x - mean), 2)) / (2 * variance))
}

export function argMax(array: number[]) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
  