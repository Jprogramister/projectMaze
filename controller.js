
class AbstractController {
    constructor (maze, canvas, canvasWidth, canvasHeight, actionIntervalMs) {
        this.maze = maze;
        this.actionIntervalMs = actionIntervalMs;
        this.actionInterval = setInterval(this.onActionTick.bind(this), actionIntervalMs);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.canvas = canvas;

        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 37) {
                this.onButtonLeftClicked();
            }
            else if (event.keyCode == 39) {
                this.onButtonRightClicked();
            }
            if (event.keyCode == 38) {
                this.onButtonUpClicked();
            }
            else if (event.keyCode == 40) {
                this.onButtonDownClicked();
            }
        }.bind(this));

        this.canvas.addEventListener('click', function (event) {
            const {x, y} = event;
            const mazeItemWidthPx = this.canvasWidth / this.maze.rows();
            const mazeItemHeightPx = this.canvasHeight / this.maze.columns();
            const itemI = Math.ceil(x / mazeItemHeightPx) - 2;
            const itemJ = Math.ceil(y / mazeItemWidthPx) - 2;
            const item = this.maze.itemAt(itemI, itemJ);
            this.onMazeItemClicked(item);
        }.bind(this));
    }

    onButtonUpClicked() {
    }

    onButtonDownClicked() {
    }

    onButtonLeftClicked() {
    }

    onButtonRightClicked() {
    }

    onActionTick () {
    }

    onMazeItemClicked (clickedItem) {
    }
}

class MangedItemController extends AbstractController {
    constructor (maze, canvas, canvasWidth, canvasHeight, actionIntervalMs, managedItem) {
        super(maze, canvas, canvasWidth, canvasHeight, actionIntervalMs);
        this.managedItem = managedItem;
        this.currentTrack = [];
    }

    onButtonUpClicked () {
        this.managedItem.moveUp();
    }

    onButtonDownClicked () {
        this.managedItem.moveDown();
    }

    onButtonLeftClicked () {
        this.managedItem.moveLeft();
    }

    onButtonRightClicked () {
        this.managedItem.moveRight();
    }

    onMazeItemClicked (clickedItem) {
        this.currentTrack = Algorithms.findShortestStraightTrack(this.managedItem.i, this.managedItem.j, clickedItem.i, clickedItem.j);
    }

    onActionTick () {
        if (this.currentTrack.length > 0) {
            const step = this.currentTrack.shift();
            step.apply(this.managedItem, this.maze);
        }
    }
}

class EnemyController extends AbstractController {
    constructor (maze, canvas, canvasWidth, canvasHeight, actionIntervalMs, managedItem, mainHeroItem) {
        super(maze, canvas, canvasWidth, canvasHeight, actionIntervalMs);
        this.managedItem = managedItem;
        this.currentTrack = [];
        this.mainHeroItem = mainHeroItem;
    }

    onActionTick () {
        this.currentTrack = Algorithms.findShortestStraightTrack(this.managedItem.i, this.managedItem.j, this.mainHeroItem.i, this.mainHeroItem.j);
        const step = this.currentTrack.shift();
        step.apply(this.managedItem, this.maze);
    }
}