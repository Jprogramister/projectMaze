
class Algorithms {
    static initializeWalls (maze, mazeDensity, staticObjectsSupplier) {
        const amountOfWalls = maze.rows() * maze.columns() * mazeDensity;
        for (let i = 1; i < amountOfWalls; ++i) {
            const y =  Math.floor(Math.random() * maze.rows());
            const x =  Math.floor(Math.random() * maze.columns());
            // TODO generate walls for every maze not only for central
            maze.place(staticObjectsSupplier(x, y, x, y));
        }
    }

    static findShortestStraightTrack (startI, startJ, toI, toJ) {
        const track = [];
        while (Algorithms.manhattanLength(startI, startJ, toI, toJ) > 0) {
            const diffX = (toI - startI) > 0 ? 1 : (toI - startI) !== 0 ? -1 : 0;
            const diffY = (toJ - startJ) > 0 ? 1 : (toJ - startJ) !== 0 ? -1 : 0;
            track.push(new Vector(diffX, diffY));
            startI += diffX;
            startJ += diffY;
        }
        return track;
    }

    static manhattanLength(x1, y1, x2, y2) {
        return Math.abs(x2 - x1) + Math.abs(y2 - y1);
    }
}