/** @type {import("../../typings/phaser")} */

class LevelSelect extends Phaser.Scene {
    // variables for buttons
    backButton;

    levels;
    numLevels;

    // background logo
    logoIMG;

    levelDatatxt;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;


    levelClickedHandler(levelNumber) {
        // transition back to MainMenu
        console.log(levelNumber);
    }


    backClickHandler() {
        // transition back to MainMenu
        this.scene.switch('MainMenu');
    }

    buttonHovered(button) {
        // handles any button being hovered
        button.setColor('#37A8DF');
        button.setScale(1.2);
        // Maybe play a sound here

    }

    buttonHoverExit(button) {
        // handles any button no longer being hovered
        button.setColor('#ffffff');
        button.setScale(1);

    }

    preload() {

        this.levelDatatxt = this.load.text('levelData', 'resources/data/levelData.txt');





    }

    create() {
        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup About title
        this.title = this.add.text(cameraCenterX, this.topOff, "Level", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36).setOrigin(this.centerOriginOff);



        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);
        // TODO put options here

        this.levels = [];
        var levelDataText = this.cache.text.get('levelData');
        this.numLevels = parseInt(levelDataText.substring(levelDataText.search('level_count:') + 12, levelDataText.indexOf(',', levelDataText.search('level_count:') + 12)));

        var x = cameraCenterX - this.cameras.main.width / 5.5;
        var y = cameraCenterY;
        var amountPerRow = 4;

        for (var i = 0; i < this.numLevels; i++) {
            for (var j = 0; j < amountPerRow; j++) {
                var levelButton = this.add.text(x, y, "Level " + (i + 1), { fill: '#ffffff' });
                levelButton.setOrigin(this.centerOriginOff)
                    .setInteractive({ 'useHandCursor': true })
                    .on('pointerdown', this.mkLevelClickedHandler(i))
                    .on('pointerover', this.mkButtonHoveredHandler(levelButton))
                    .on('pointerout', this.mkBottonHoverExitHandler(levelButton));
                this.levels.push(levelButton);
                x += this.cameras.main.width / 8;
                i++;
            }
            i--;
            x -= (amountPerRow) * (this.cameras.main.width / 8);
            y += (this.cameras.main.height / 8);
        }


        // setup back button
        this.backButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 2) + this.topOff - (this.spaceOff * 2), "BACK", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler())
            .on('pointerover', () => this.buttonHovered(this.backButton))
            .on('pointerout', () => this.buttonHoverExit(this.backButton));

    }

    mkLevelClickedHandler(level) {
        return () => this.levelClickedHandler(level);
    }

    mkButtonHoveredHandler(button) {
        return () => this.buttonHovered(button);
    }

    mkBottonHoverExitHandler(button) {
        return () => this.buttonHoverExit(button);
    }

    update() {
    }
} 