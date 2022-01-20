class MazeToCanvasPrinter {
    constructor (canvas, widthPx, heightPx) {
        this.canvas = canvas;
        this.widthPx = widthPx;
        this.heightPx = heightPx;
    }

    print (maze) {
        const mazeCellWidth = this.widthPx / maze.columns();
        const mazeCellHeight = this.heightPx / maze.rows();
        for (let x = mazeCellWidth, i = 0; x < this.widthPx; x += mazeCellWidth, i++) {
            for (let y = mazeCellHeight, j = 0; y < this.heightPx; y += mazeCellHeight, j++) {
                const mazeItem = maze.itemAt(i, j);
                this.__printItem(mazeItem, x, y);
            }
        }
    }

    __printItem (item, x, y) {
        if (item.constructor.name === "ItemSymbol") {
            this.canvas.fillText(item.symbol, x, y);
            return;
        } else if (item.constructor.name === "ItemWithControl") {
            this.canvas.fillText("X", x, y);
            return;
        }
        throw new Error(`Unknown item type ${item.constructor.name}.`);
    }
}