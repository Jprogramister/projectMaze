

class ControllersRegistry {
    constructor (actionIntervalMs) {
        this.controllersWithAction = [];
        this.actionInterval = setInterval(this.__tick.bind(this), actionIntervalMs);
    }

    register (controller) {
        this.controllersWithAction.push(controller);
    }

    __tick () {
        this.controllersWithAction.forEach(controller => controller.onActionTick());
    }
}

class AbstractController {
    constructor (maze, canvas, canvasWidth, canvasHeight) {
        this.maze = maze;
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
            const itemI = Math.ceil(x / mazeItemHeightPx) - 2 - GlobalState.offsetY;
            const itemJ = Math.ceil(y / mazeItemWidthPx) - 2 - GlobalState.offsetX;
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
    constructor (maze, canvas, canvasWidth, canvasHeight, managedItem) {
        super(maze, canvas, canvasWidth, canvasHeight);
        this.managedItem = managedItem;
        this.currentTrack = [];
    }

    onMazeItemClicked (clickedItem) {
        Log.debug(`Going from [${this.managedItem.x + "," + this.managedItem.y}] to [${clickedItem.x + "," + clickedItem.y}].`);
        this.currentTrack = Algorithms.findShortestStraightTrack(this.managedItem.y, this.managedItem.x, clickedItem.y, clickedItem.x);
    }

    onActionTick () {
        if (this.currentTrack.length > 0) {
            const step = this.currentTrack.shift();
            step.apply(this.managedItem, this.maze);
        }
    }
}

class EnemyController extends AbstractController {
    constructor (maze, canvas, canvasWidth, canvasHeight, managedItem, mainHeroItem) {
        super(maze, canvas, canvasWidth, canvasHeight);
        this.managedItem = managedItem;
        this.currentTrack = [];
        this.mainHeroItem = mainHeroItem;
    }

    onActionTick () {
        const distanceForHero = Algorithms.manhattanLength(this.managedItem.x, this.managedItem.y, this.mainHeroItem.x, this.mainHeroItem.y);
        if (distanceForHero <= 1) {
            return;
        }

        this.currentTrack = Algorithms.findShortestStraightTrack(this.managedItem.x, this.managedItem.y, this.mainHeroItem.x, this.mainHeroItem.y);
        if (this.currentTrack.length === 0) {
            throw new Error(`Cannot find a track from ${this.mainHeroItem.x + " " + this.mainHeroItem.y} to ${this.managedItem.x + " " + this.managedItem.y}`)
        }
        const step = this.currentTrack.shift();
        step.apply(this.managedItem, this.maze);
    }
}

class MapOffsetsController extends AbstractController {
    constructor (maze, canvas, canvasWidth, canvasHeight) {
        super(maze, canvas, canvasWidth, canvasHeight);
    }

    onButtonUpClicked() {
        GlobalState.addOffset(-1, 0);
    }

    onButtonDownClicked() {
        GlobalState.addOffset(1, 0);
    }

    onButtonLeftClicked() {
        GlobalState.addOffset(0, -1);
    }

    onButtonRightClicked() {
        GlobalState.addOffset(0, 1);
    }
}