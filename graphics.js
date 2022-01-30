
class MazeToCanvasPrinter {
    constructor (canvas2DCtx, widthPx, heightPx, gridWidth, gridHeight) {
        this.canvas2DCtx = canvas2DCtx;
        this.widthPx = widthPx;
        this.heightPx = heightPx;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
    }

    print (maze) {
        const mazeCellWidth = this.widthPx / maze.columns();
        const mazeCellHeight = this.heightPx / maze.rows();
        const delayedDrawing = [];
        for (let x = mazeCellWidth, i = 0; x < this.widthPx; x += mazeCellWidth, i++) {
            for (let y = mazeCellHeight, j = 0; y < this.heightPx; y += mazeCellHeight, j++) {
                const mazeItem = maze.itemAt(i, j);
                if (!mazeItem) {
                    continue;
                }
                if (mazeItem.isBackground) {
                    this.__printItem(mazeItem, x, y);
                } else {
                    delayedDrawing.push({
                        mazeItem, x, y
                    });
                }
            }
        }
        delayedDrawing.forEach(item => this.__printItem(item.mazeItem, item.x, item.y));
    }

    __printItem (item, x, y) {
        if (item.constructor.name === "ItemSymbol") {
            this.canvas2DCtx.fillText(item.symbol, x, y);
        }
        if (item.drawer) {
            const spriteX = item.i * (this.widthPx / this.gridWidth);
            const spriteY = item.j * (this.heightPx / this.gridHeight);
            item.drawer(this.canvas2DCtx, spriteX, spriteY);
        }
    }
}