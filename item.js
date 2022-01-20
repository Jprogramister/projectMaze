
class AbstractItem {
    constructor (id, i, j, isBackground = true) {
        this.id = id;
        this.i = i;
        this.j = j;
        this.isBackground = isBackground;
    }
}

class ItemWithSprite extends AbstractItem {
    constructor (id, i, j, isBackground, image, sWidth, sHeight, dx, dy, dw, dh) {
        super(id, i, j, isBackground);
        this.drawer = (ctx, x, y) => ctx.drawImage(image, dx, dy, sWidth, sHeight, x, y, dw, dh);
    }
}

class ItemWithControl extends ItemWithSprite {
    constructor (id, i, j, maze, image, sWidth, sHeight, dx, dy, dw, dh) {
        super(id, i, j, false, image, sWidth, sHeight, dx, dy, dw, dh);
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