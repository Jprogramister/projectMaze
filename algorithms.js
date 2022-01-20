
class Algorithms {
    constructor (maze, staticObjectsSupplier) {
        this.maze = maze;
        this.staticObjectsSupplier = staticObjectsSupplier;
    }

    initializeWalls (mazeDensity) {
        const amountOfWalls = this.maze.rows() * this.maze.columns() * mazeDensity;
        for (let i = 1; i < amountOfWalls; ++i) {
            const y =  Math.floor(Math.random() * this.maze.rows());
            const x =  Math.floor(Math.random() * this.maze.columns());
            this.maze.place(this.staticObjectsSupplier(x, y));
        }
    }
}