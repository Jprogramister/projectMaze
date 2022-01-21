
class Factory {
    constructor (maze) {
        this.itemsCounter = 0;

        this.maze = maze;

        const loadImage = file => {
            const img = new Image();
            img.src = file;
            return img;
        }

        this.forestPng = loadImage("forest.png");
        this.banditPng = loadImage("bandit.png");
        this.dwarfPng = loadImage("hero.png");
    }

    newFloorItem (i, j) {
        return new ItemWithSprite(this.itemsCounter++, i, j, true, this.forestPng, 20, 20, 680, 680, Config.BG_SIZE, Config.BG_SIZE);
    }

    newTreeItem (i, j) {
        return new ItemWithSprite(this.itemsCounter++, i, j, false, this.forestPng, 65, 65, 924, 159, 60, 60);
    }

    newBanditItem (i, j) {
        return new ItemWithSprite(this.itemsCounter++, i, j, false, this.banditPng, 80, 120, 23, 10, Config.PERSON_SIZE, Config.PERSON_SIZE);
    }

    newDwarfItem (i, j) {
        return new ItemWithControl(this.itemsCounter++, i, j, this.maze, this.dwarfPng, 70, 70, 0, 0, Config.PERSON_SIZE, Config.PERSON_SIZE);
    }
}