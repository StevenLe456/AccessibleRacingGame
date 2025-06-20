export class Head {
    private forward
    private right
    private left
    private up
    private down

    constructor(f: Object[], r: Object[], l: Object[], u: Object[], d: Object[]) {
        this.forward = f
        this.right = r
        this.left = l
        this.up = u
        this.down = d
    }
}