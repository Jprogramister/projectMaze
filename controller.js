
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
            this.onMazeItemClicked(itemI, itemJ, item);
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

    onMazeItemClicked (i, j, clickedItem) {
        console.log(`A maze item clicked: ${i + " " + j}`);
    }
}