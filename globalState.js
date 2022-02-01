
const GlobalState = new class {
    constructor () {
        this.offsetX = 0;
        this.offsetY = 0;
    }

    addOffset (x, y) {
        this.offsetX += x;
        this.offsetY += y;
    }
}