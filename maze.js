

class AbstractItem {
    constructor (id, i, j) {
        this.id = id;
        this.i = i;
        this.j = j;
    }
}

class ItemWithControl extends AbstractItem {
    constructor (id, i, j, maze) {
        super(id, i, j);
        this.maze = maze;
    }

    moveUp () {
        return this.maze.shiftItem(this.i, this.j, Direction.up, -1);
    }

    moveDown () {
        return this.maze.shiftItem(this.i, this.j, Direction.down);
    }

    moveRight () {
        return this.maze.shiftItem(this.i, this.j, Direction.right);
    }

    moveLeft () {
        return this.maze.shiftItem(this.i, this.j, Direction.left, -1);
    }
}

class ItemSymbol extends AbstractItem {
    constructor (id, i, j, symbol) {
        super(id, i, j);
        this.symbol = symbol;
    }
}

var Direction = {
    none: 0,
    up: 1,
    right: 2, 
    down: 3, 
    left: 4,
};

class Maze {
    constructor () {
        this.grid = [];
        this.n = 0;
        this.m = 0;
        this.fillerSupplier = undefined;
    }

    itemAt (i, j) {
        if (i > this.n || j > this.m) {
            throw new Error(`Cannot give a item at ${i} ${j} position. The current grid size is ${this.n} x ${this.m}.`)
        }
        return this.grid[i][j];
    }

    place (item) {
        this.grid[item.i][item.j] = item;
    }

    shiftItem (i, j, direction, shift = 1) {
        const item = this.itemAt(i, j);
        let isAbleShift = false;
        switch (direction) {
            case Direction.none: break;
            case Direction.down: 
            case Direction.up: 
                isAbleShift = item.j + shift < this.rows() -1 && item.j + shift >= 0;
                if (isAbleShift) {
                    item.j = item.j + shift;
                    this.place(item);
                    this.fill(i, j);
                }
                return isAbleShift;
            case Direction.left: 
            case Direction.right: 
                isAbleShift = item.i + shift < this.columns() -1 && item.i + shift >= 0;
                if (isAbleShift) {
                    item.i = item.i + shift;
                    this.place(item);
                    this.fill(i, j);
                }
                return isAbleShift;
        }
    }

    neighbourAt(i, j, direction, shift = 1) {
        let isAbleShift = false;
        switch (direction) {
            case Direction.none: break;
            case Direction.down:
            case Direction.up:
                isAbleShift = j + shift < this.rows() -1 && j + shift >= 0;
                if (isAbleShift) {
                    j = j + shift;
                    return this.itemAt(i, j);
                } else {
                    return undefined;
                }
            case Direction.left:
            case Direction.right:
                isAbleShift = i + shift < this.columns() -1 && i + shift >= 0;
                if (isAbleShift) {
                    i = item.i + shift;
                    return this.itemAt(i, j);
                }
                return undefined;
        }
    }

    rows () {
        return this.n; 
    }

    columns () {
        return this.m;
    }

    resize (n, m) {
        this.n = n;
        this.m = m;
        this.grid = [];
        for (let i = 1; i <= n; ++i) {
            let row = [];
            for (let j = 1; j <= m; ++j) {
                row.push(null);
            }
            this.grid.push(row);
        }
    }

    init (n, m, fillerSupplier) {
        this.resize(n, m);
        this.fillerSupplier = fillerSupplier
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < m; ++j) {
                this.fill(i, j);
            }
        }
    }

    fill (i, j) {
        this.grid[i][j] = this.fillerSupplier(i, j);
    }
}

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
        }
        if (item.constructor.name === "ItemWithControl") {
            this.canvas.fillText("X", x, y);
            return;
        }
        throw new Error(`Unknown item type ${item.constructor.name}.`);
    }
}