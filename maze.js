
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

class MazeAssembly {
    constructor (startMaze) {
        this.mazes = [];
        this.mazes.push(startMaze);
        this.startMaze = startMaze;
        this.startMaze.isVisible = true;
    }

    rows () {
        return this.startMaze.rows();
    }

    columns () {
        return this.startMaze.columns();
    }

    itemAt (i, j) {
        return this.__getMaze(i, j).itemAt(i, j);
    }

    place (item) {
        return this.__getMaze(item.i, item.j).place(item);
    }

    shiftItem (i, j, direction, shift = 1) {
        return this.__getMaze(i, j).shiftItem(i, j, direction, shift);
    }

    __getMaze (i, j) {
        const targetMaze = this.mazes.find(m => m.containsPoint(i, j));
        if (targetMaze) {
            return targetMaze;
        } else {
            this.__extendNeighbour(i, j);
            const createdMaze = this.mazes.find(m => m.containsPoint(i, j));
            if (!createdMaze) {
                throw new Error(`Can't extend maze for coordinates ${i + " " + j}.`)
            }
            return createdMaze;
        }
    }

    __extendNeighbour (i, j) {
        let nearestMaze = null;
        let minDistance = Number.MAX_SAFE_INTEGER;
        for (let it = this.mazes.values(), m= null; m = it.next().value; ) {
            if (m.__distance(i, j) < minDistance) {
                nearestMaze = m;
                minDistance = m.__distance(i, j);
            }
        }
        const newMazes = nearestMaze.createNeighbours();
        for (let i = 0; i < newMazes.length; ++i) {
            this.__registerNew(newMazes[i]);
        }
    }

    __registerNew (maze) {
        this.mazes.push(maze);
    }
}

class Maze {
    constructor (leftUpperPoint, rightDownPoint) {
        this.grid = [];
        this.n = Math.abs(rightDownPoint[0] - leftUpperPoint[0]);
        this.m = Math.abs(rightDownPoint[1] - leftUpperPoint[1]);
        this.backgroundObjectsSupplier = undefined;
        this.leftUpperPoint = leftUpperPoint;
        this.rightDownPoint = rightDownPoint;
        this.isVisible = false;
    }

    createNeighbours () {
        const res = [];

        let newLeftUpperPoint = [this.leftUpperPoint[0] - this.n, this.leftUpperPoint[1] - this.m];
        let newRightDownPoint = [this.rightDownPoint[0] - this.n, this.rightDownPoint[1] - this.m];
        res.push(new Maze(newLeftUpperPoint, newRightDownPoint).init(this.backgroundObjectsSupplier));

        newLeftUpperPoint = [this.leftUpperPoint[0], this.leftUpperPoint[1] - this.m];
        newRightDownPoint = [this.rightDownPoint[0], this.rightDownPoint[1] - this.m];
        res.push(new Maze(newLeftUpperPoint, newRightDownPoint).init(this.backgroundObjectsSupplier));

        newLeftUpperPoint = [this.leftUpperPoint[0] - this.n, this.leftUpperPoint[1]];
        newRightDownPoint = [this.rightDownPoint[0] - this.n, this.rightDownPoint[1]];
        res.push(new Maze(newLeftUpperPoint, newRightDownPoint).init(this.backgroundObjectsSupplier));

        return res;
    }

    containsPoint (x, y) {
        return x >= this.leftUpperPoint[0] && x < this.rightDownPoint[0]
            && y >= this.leftUpperPoint[1] && y < this.rightDownPoint[1];
    }

    __distance (x, y) {
        return Math.sqrt(Math.pow(x - this.leftUpperPoint[0], 2) + Math.pow(y - this.leftUpperPoint[1], 2));
    }

    itemAt (i0, j0) {
        const [i, j] = this.__mapToLocalXY(i0, j0);
        if (i > this.n || j > this.m || i < 0 || j < 0) {
            throw new Error(`Cannot give a item at ${i} ${j} position. The current grid size is ${this.n} x ${this.m}.`)
        }
        return this.grid[i][j];
    }

    // itemAt with local coordinates of item (without mapping)
    __itemAt (i, j) {
        return this.grid[i][j];
    }

    __mapToLocalXY(x, y) {
        return [x - this.leftUpperPoint[0], y - this.leftUpperPoint[1]];
    }

    place (item) {
        const [i, j] = this.__mapToLocalXY(item.i, item.j);
        this.grid[i][j] = item;
    }

    shiftItem (i, j, direction, shift = 1) {
        if (direction === Direction.left || direction === Direction.up) {
            shift = -shift;
        }
        const neighbour = this.__neighbourOf(i, j, direction, shift);
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
                this.__fill(i, j);
                return true;
            case Direction.left: 
            case Direction.right: 
                item.i = item.i + shift;
                this.place(item);
                this.__fill(i, j);
                return true;
        }
    }

    __neighbourOf(i0, j0, direction, shift = 1) {
        let isNeighbourExists = false;
        let [i, j] = this.__mapToLocalXY(i0, j0);
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
        return isNeighbourExists ? this.__itemAt(i, j) : undefined;
    }

    rows () {
        return this.n; 
    }

    columns () {
        return this.m;
    }

    __resize (n, m) {
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

    init (backgroundObjectsSupplier) {
        this.__resize(this.n, this.m);
        this.backgroundObjectsSupplier = backgroundObjectsSupplier;
        for (let i = 0; i < this.n; ++i) {
            for (let j = 0; j < this.m; ++j) {
                this.grid[i][j] = this.backgroundObjectsSupplier(i, j);
            }
        }
        return this;
    }

    __fill (i0, j0) {
        let [i, j] = this.__mapToLocalXY(i0, j0);
        this.grid[i][j] = this.backgroundObjectsSupplier(i, j);
    }
}