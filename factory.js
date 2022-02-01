
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

    newFloorItem (i, j, x, y) {
        if (Config.isDebug) {
            return new ItemSymbol(this.itemsCounter++, i, j, x, y, '0', true)
        }
        return new ItemWithSprite(this.itemsCounter++, i, j, x, y, true, this.forestPng, 20, 20, 680, 680, Config.BG_SIZE, Config.BG_SIZE);
    }

    newTreeItem (i, j, x, y) {
        if (Config.isDebug) {
            return new ItemSymbol(this.itemsCounter++, i, j, x, y, 'T', false)
        }
        return new ItemWithSprite(this.itemsCounter++, i, j, x, y, false, this.forestPng, 65, 65, 924, 159, 60, 60);
    }

    newBanditItem (i, j, x, y) {
        if (Config.isDebug) {
            return new ItemSymbol(this.itemsCounter++, i, j, x, y, 'B', false)
        }
        return new ItemWithSprite(this.itemsCounter++, i, j, x, y, false, this.banditPng, 80, 120, 23, 10, Config.PERSON_SIZE, Config.PERSON_SIZE);
    }

    newDwarfItem (i, j, x, y) {
        if (Config.isDebug) {
            return new ItemSymbol(this.itemsCounter++, i, j, x, y, 'X', false)
        }
        return new ItemWithControl(this.itemsCounter++, i, j, x, y, this.maze, this.dwarfPng, 70, 70, 0, 0, Config.PERSON_SIZE, Config.PERSON_SIZE);
    }
}