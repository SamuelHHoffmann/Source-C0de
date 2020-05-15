/** @type {import("../../typings/phaser")} */

class LevelSelect extends Phaser.Scene {
    // variables for buttons
    backButton;
    backgroundShowing = false;

    // level selection information
    levels;
    numLevels;
    levelName;
    levelDesc;
    clickedLevel;
    LockedLevelData; //array of 0's and 1 and each index is if it locked or not

    // background logo
    logoIMG;
    descBackground;

    // level data
    levelData;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;

    setShowBackground(showing) {
        // set value for background showing
        this.backgroundShowing = showing;

        // get correct alpha for value of showing
        var alpha = showing ? 1.0 : 0.0
        console.log(alpha);

        // apply alpha
        this.levelName.setAlpha(alpha);
        this.levelDesc.setAlpha(alpha);
        this.descBackground.setAlpha(alpha);
        this.title.setAlpha(alpha);
    }

    startClickHandler() {
        // reset level before switching scenes
        this.game.scene.getScene('LevelScene').reDrawLayer = true;
        this.game.scene.getScene('LevelScene').setLevelNumber(this.clickedLevel);

        // stop showing background
        this.setShowBackground(false);

        // switch to level
        this.scene.switch('LevelScene');

        // play sound
        this.sound.play('clickSound');
    }


    backClickHandler() {
        // transition back to MainMenu
        if (this.backgroundShowing == false) {
            this.scene.switch('MainMenu');
        } else {
            this.setShowBackground(false);
        }

        // play sound
        this.sound.play('clickSound');
    }

    levelClickedHandler(levelNumber) {

        if (this.backgroundShowing) {
            return;
        }

        this.clickedLevel = levelNumber;

        // update level name and desc after clicking on level
        this.levelName.setText(this.levelData.levels[levelNumber - 1].name);
        this.levelDesc.setText(this.levelData.levels[levelNumber - 1].desc);

        if (this.levelName.text == "") {
            //if empty don't show anything
            return;
        }

        this.setShowBackground(true);

        // play sound
        this.sound.play('clickSound');
    }

    buttonHovered(button) {
        // handles any button being hovered
        button.setColor('#37A8DF');
        button.setScale(1.2);

        // play sound
        this.sound.play('hoverSound');
    }

    buttonHoverExit(button) {
        // handles any button no longer being hovered
        button.setColor('#ffffff');
        button.setScale(1);
    }

    makeHandler(val, callback) {
        // make into function using callback function
        return function () { // outer function
            callback(val); // inner function
        }
    }

    unlockLevel(levelNumber) {
        if (levelNumber <= this.numLevels) {
            if (this.LockedLevelData[levelNumber - 1] == 1) { //can only unlock level if previous is unlocked
                this.levels[levelNumber - 1].setInteractive({ 'useHandCursor': true }).setColor('#ffffff');
                this.LockedLevelData[levelNumber] = 1;
            }
        }

    }


    preload() {
        // load level data
        this.load.text('levelData', 'resources/data/levelData.json');
        this.load.image('levelDescBackground', 'resources/images/levelSelectBackground.png');
    }

    create() {
        // parse level data
        this.levelData = JSON.parse(this.cache.text.get('levelData'));
        console.log(this.levelData);


        this.LockedLevelData = [];


        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup About title
        this.title = this.add.text(cameraCenterX, this.topOff, "start", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36)
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.startClickHandler())
            .setAlpha(0);

        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);

        this.descBackground = this.add.image(cameraCenterX, cameraCenterY, 'levelDescBackground')
            .setScale(0.2)
            .setDepth(1)
            .setAlpha(0);

        this.levelName = this.add.text(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8) - (this.cameras.main.height / 17), "Name", { fill: '#000000', boundsAlignV: 'middle' })
            .setFontSize(26)
            .setOrigin(this.centerOriginOff)
            .setAlign("center")
            .setDepth(2)
            .setAlpha(0);

        this.levelDesc = this.add.text(cameraCenterX, cameraCenterY, "Desc", { fill: '#000000', boundsAlignV: 'middle' })
            .setFontSize(18)
            .setOrigin(this.centerOriginOff)
            .setAlign("left")
            .setWordWrapWidth(400)
            .setDepth(2)
            .setAlpha(0);

        this.levels = [];
        this.numLevels = this.levelData.levelCount;



        var x = cameraCenterX - this.cameras.main.width / 5.5;
        var y = cameraCenterY;
        var amountPerRow = 4;

        // get the min row amount
        for (var i = 0; i < this.numLevels; i++) {
            var minRowAmount = Math.min(Math.max(0, this.numLevels - (i * amountPerRow)), amountPerRow);

            // draw level button in correct spot and add to levels list
            for (var j = 0; j < minRowAmount; j++) {
                var levelButton = this.add.text(x, y, "Level " + (i + 1), { fill: '#808080' });
                levelButton.setOrigin(this.centerOriginOff)
                    .on('pointerdown', this.makeHandler(i + 1, (x) => this.levelClickedHandler(x)))
                    .on('pointerover', this.makeHandler(levelButton, (x) => this.buttonHovered(x)))
                    .on('pointerout', this.makeHandler(levelButton, (x) => this.buttonHoverExit(x)));
                this.levels.push(levelButton);
                x += this.cameras.main.width / 8;
                i++;
            }
            i--;
            x -= (amountPerRow) * (this.cameras.main.width / 8);
            y += (this.cameras.main.height / 8);
        }

        for (var x = 0; x <= this.numLevels; x++) {
            this.LockedLevelData.push(0);
        }
        this.LockedLevelData[0] = 1;
        this.unlockLevel(1);


        // setup back button
        this.backButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 2) + this.topOff - (this.spaceOff * 2), "BACK", { fill: '#ffffff' });
        this.backButton.setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler())
            .on('pointerover', this.makeHandler(this.backButton, (x) => this.buttonHovered(x)))
            .on('pointerout', this.makeHandler(this.backButton, (x) => this.buttonHoverExit(x)));
    }

    update() {
        var x = 0;
    }
} 