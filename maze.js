
var Direction = {
    none: 0,
    up: 1,
    right: 2, 
    down: 3, 
    left: 4,
};

class Vector {
    constructor (diffX, diffY) {
        this.diffX = diffX;
        this.diffY = diffY;
    }

    apply (item, maze) {
        const steps = this.toDirection();
        if (steps.length < 2) {
            return maze.shiftItem(item.i, item.j, steps[0]);
        } else {
            const firstStep = steps[0];
            const secondStep = steps[1];
            let isSomeStepDone;
            if (!(isSomeStepDone = maze.shiftItem(item.i, item.j, firstStep))) {
                // tries to do steps in opposite order if first step is impossible
                isSomeStepDone |= maze.shiftItem(item.i, item.j, secondStep);
                isSomeStepDone |= maze.shiftItem(item.i, item.j, firstStep);
            } else {
                isSomeStepDone |= maze.shiftItem(item.i, item.j, secondStep);
            }
            return isSomeStepDone;
        }
    }

    toDirection () {
        const steps = [];
        if (this.diffX !== 0) {
            steps.push(this.diffX > 0 ? Direction.right : Direction.left);
        }
        if (this.diffY !== 0) {
            steps.push(this.diffY > 0 ? Direction.down : Direction.up);
        }
        return steps;
    }
}

class Maze {
    constructor () {
        this.grid = [];
        this.n = 0;
        this.m = 0;
        this.backgroundObjectsSupplier = undefined;
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
        if (direction === Direction.left || direction === Direction.up) {
            shift = -shift;
        }
        const neighbour = this.neighbourOf(i, j, direction, shift);
        if (!neighbour || !neighbour.isBackground) {
            return false;
        }
        const item = this.itemAt(i, j);
        switch (direction) {
            case Direction.none:
                return false;
            case Direction.down: 
            case Direction.up: 
                item.j = item.j + shift;
                this.place(item);
                this.fill(i, j);
                return true;
            case Direction.left: 
            case Direction.right: 
                item.i = item.i + shift;
                this.place(item);
                this.fill(i, j);
                return true;
        }
    }

    neighbourOf(i, j, direction, shift = 1) {
        let isNeighbourExists = false;
        switch (direction) {
            case Direction.none: break;
            case Direction.down:
            case Direction.up:
                isNeighbourExists = j + shift < this.rows() -1 && j + shift >= 0;
                if (isNeighbourExists) {
                    j = j + shift;
                }
                break;
            case Direction.left:
            case Direction.right:
                isNeighbourExists = i + shift < this.columns() -1 && i + shift >= 0;
                if (isNeighbourExists) {
                    i = i + shift;
                }
                break;
        }
        return isNeighbourExists ? this.itemAt(i, j) : undefined;
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

    async init (n, m, backgroundObjectsSupplier) {
        this.resize(n, m);
        this.backgroundObjectsSupplier = backgroundObjectsSupplier;
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < m; ++j) {
                this.fill(i, j);
            }
        }
    }

    fill (i, j) {
        this.grid[i][j] = this.backgroundObjectsSupplier(i, j);
    }
}