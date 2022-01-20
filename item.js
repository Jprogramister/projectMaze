class AbstractItem {
    constructor (id, i, j, isBackground = true) {
        this.id = id;
        this.i = i;
        this.j = j;
        this.isBackground = isBackground;
    }
}

class ItemWithControl extends AbstractItem {
    constructor (id, i, j, maze) {
        super(id, i, j, false);
        this.maze = maze;
    }

    moveUp () {
        return this.maze.shiftItem(this.i, this.j, Direction.up);
    }

    moveDown () {
        return this.maze.shiftItem(this.i, this.j, Direction.down);
    }

    moveRight () {
        return this.maze.shiftItem(this.i, this.j, Direction.right);
    }

    moveLeft () {
        return this.maze.shiftItem(this.i, this.j, Direction.left);
    }
}

class ItemSymbol extends AbstractItem {
    constructor (id, i, j, symbol, isBackground = true) {
        super(id, i, j, isBackground);
        this.symbol = symbol;
    }
}