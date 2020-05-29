/** @type {import("../../typings/phaser")} */

class LevelSelect extends Phaser.Scene {
    // variables for buttons
    backButton;
    backgroundShowing = false;

    unlockNext = false;

    // level selection information
    levels;
    numLevels;
    levelName;
    levelDesc;
    clickedLevel;
    LockedLevelData; //array of 0's and 1 and each index is if it locked or not

    pageNumber = 0;
    nextPageButton;
    prevPageButton;

    // background logo
    logoIMG;
    descBackground;

    // level data
    levelData;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;
    levelsPerPage = 12;

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

    riftAnimation() {
        this.riftPoints = [];
        this.riftParticles = this.add.particles('riftParticles');
        this.riftParticles.visible = false;
        this.riftParticles.setDepth(0);

        this.riftBackground = this.add.image(400, 300, "maskedImg");
        this.riftBackground.setAlpha(0.85)

        this.riftBackground.setMask(new Phaser.Display.Masks.BitmapMask(this, this.riftParticles));

        for(var i = 0, x = 125; i < 20; i++, x += 30) {
            this.riftPoints[i] = new Phaser.Geom.Point(x, 230+Phaser.Math.Between(-50, 50));
        }

        var that = this;
        this.riftPoints.getRandomPoint = function (vec) {
            var pt = that.riftPoints[Phaser.Math.Between(0, that.riftPoints.length - 1)];
            vec.x = pt.x;
            vec.y = pt.y;
            return vec;
        }
        
        this.riftEmitter = this.riftParticles.createEmitter({
            lifespan: 2000,
            speedY: { min: -50, max: 50 },
            speedX: { min: -10, max: 10 },
            scaleX: { start: 0.5, end: 0 },
            scaleY: { start: 2.5, end: 0 },
            emitZone: {
                type: 'random',
                source: this.riftPoints,
            },
            rotate: {
                onEmit: function () {
                    var rots = [0, 45, 135];
                    return rots[Phaser.Math.Between(0, rots.length - 1)];
                }
            },
            quantity: 2
        });  
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

        // enable all buttons
        for (var i = 0; i < this.LockedLevelData.length; i++)
            if (this.LockedLevelData[i] == 1)
                this.unlockLevel(i + 1);

        // make all buttons visible
        this.levels.forEach(element => {
            element.setVisible(true);
        });
    }


    backClickHandler() {
        // transition back to MainMenu
        if (this.backgroundShowing == false) {
            this.scene.switch('MainMenu');
        } else {
            this.setShowBackground(false);

            // enable all buttons
            for (var i = 0; i < this.LockedLevelData.length; i++)
                if (this.LockedLevelData[i] == 1)
                    this.unlockLevel(i + 1);

            // make all buttons visible
            this.levels.forEach(element => {
                element.setVisible(true);
            });
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

        // disable all level buttons and make invisible
        this.levels.forEach(element => {
            element.disableInteractive();
            element.setVisible(false);
        });

        // play sound
        this.sound.play('clickSound');
    }

    buttonHovered(button) {
        // handles any button being hovered
        if(!button.setColor) {
            button.setTintFill(Phaser.Display.Color.HSVColorWheel()[210].color);
        } else {
            button.setColor('#37A8DF');
        }
        button.setScale(1.2);

        // play sound
        this.sound.play('hoverSound');
    }

    buttonHoverExit(button) {
        // handles any button no longer being hovered
        button.setScale(1);
        if(!button.setColor) {
            button.clearTint();
        } else {
            button.setColor('#ffffff');
        }
        

    }

    makeHandler(val, callback) {
        // make into function using callback function
        return function () { // outer function
            callback(val); // inner function
        }
    }

    unlockLevel(levelNumber) {
        if (levelNumber <= this.numLevels) {
            if (levelNumber == 1 || this.LockedLevelData[levelNumber - 2] == 1) { //can only unlock level if previous is unlocked or level 1 selected
                this.levels[levelNumber - 1].setInteractive({ 'useHandCursor': true }).setColor('#ffffff');
                this.LockedLevelData[levelNumber - 1] = 1;
            }
        }
    }

    unlock() {
        for (var i = 0; i < this.LockedLevelData.length; i++)
            if (this.LockedLevelData[i] == 1)
                this.unlockLevel(i + 1);
    }

    nextPageClickedHandler() {
        this.levels.forEach(level => {
            if (level.levelNumber > (this.pageNumber * this.levelsPerPage) && level.levelNumber <= ((this.pageNumber + 1) * this.levelsPerPage)) {
                level.setAlpha(0);
                level.disableInteractive();
            } else if (level.levelNumber > ((this.pageNumber + 1) * this.levelsPerPage) && level.levelNumber <= ((this.pageNumber + 2) * this.levelsPerPage)) {
                //check if need to unlock level 
                level.setAlpha(1);
                if (this.LockedLevelData[level.levelNumber - 1] == 1) {
                    level.setInteractive({ 'useHandCursor': true }).setColor('#ffffff');
                } else {

                }
            }
        });
        this.prevPageButton.setAlpha(1);
        this.prevPageButton.setInteractive({ 'useHandCursor': true });
        this.pageNumber++;
        if (this.numLevels <= ((this.pageNumber + 1) * this.levelsPerPage)) {
            this.nextPageButton.disableInteractive();
            this.nextPageButton.setAlpha(0);
        }
    }

    prevPageClickedHandler() {
        this.levels.forEach(level => {
            if (level.levelNumber > (this.pageNumber * this.levelsPerPage) && level.levelNumber <= ((this.pageNumber + 1) * this.levelsPerPage)) {
                level.setAlpha(0);
                level.disableInteractive();
            } else if (level.levelNumber > ((this.pageNumber - 1) * this.levelsPerPage) && level.levelNumber <= (this.pageNumber * this.levelsPerPage)) {
                //check if need to unlock level 
                level.setAlpha(1);
                if (this.LockedLevelData[level.levelNumber - 1] == 1) {
                    level.setInteractive({ 'useHandCursor': true }).setColor('#ffffff');
                } else {

                }
            }
        });
        this.nextPageButton.setAlpha(1);
        this.nextPageButton.setInteractive({ 'useHandCursor': true });
        this.pageNumber--;
        if (this.pageNumber == 0) {
            this.prevPageButton.disableInteractive();
            this.prevPageButton.setAlpha(0);
        }
    }



    preload() {
        // load level data
        this.load.text('levelData', 'resources/data/levelData.json');
        this.load.image('levelDescBackground', 'resources/images/levelSelectBackground.png');
        this.load.image('nextButtonImg', 'resources/images/nextArrow.png');
        this.load.image('prevButtonImg', 'resources/images/prevArrow.png');
    }

    create() {
        // parse level data
        this.levelData = JSON.parse(this.cache.text.get('levelData'));
        console.log(this.levelData);

        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup About title
        this.title = this.add.text(cameraCenterX, cameraCenterY + 190, "start", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(48)
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.startClickHandler());

        this.title.on('pointerover', this.makeHandler(this.title, (x) => this.buttonHovered(x)))
            .on('pointerout', this.makeHandler(this.title, (x) => this.buttonHoverExit(x)))
            .setAlpha(0);

        this.riftAnimation();

        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);

        this.descBackground = this.add.image(cameraCenterX, cameraCenterY - this.spaceOff, 'levelDescBackground')
            .setScale(0.2)
            .setDepth(1)
            .setAlpha(0);

        this.levelName = this.add.text(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8) - (this.cameras.main.height / 17) - this.spaceOff, "Name", { fill: '#000000', boundsAlignV: 'middle' })
            .setFontSize(26)
            .setOrigin(this.centerOriginOff)
            .setAlign("center")
            .setDepth(2)
            .setAlpha(0);

        this.levelDesc = this.add.text(cameraCenterX, cameraCenterY - this.spaceOff, "Desc", { fill: '#000000', boundsAlignV: 'middle' })
            .setFontSize(18)
            .setOrigin(this.centerOriginOff)
            .setAlign("left")
            .setWordWrapWidth(400)
            .setDepth(2)
            .setAlpha(0);


        this.levels = [];
        this.numLevels = this.levelData.levelCount;



        var initX = cameraCenterX - this.cameras.main.width / 5.5;
        var initY = cameraCenterY;
        var deltaX = this.cameras.main.width / 8;
        var deltaY = this.cameras.main.height / 8;
        var x = initX;
        var y = initY;

        var amountPerPage = 12;
        var amountPerRow = 4;


        var numberOfPages = Math.ceil((this.numLevels / amountPerPage));
        // console.log("Number of Pages: ", numberOfPages);
        for (var pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
            // console.log("Page Index: ", pageIndex);

            x = initX;
            y = initY;

            var numberOfRows = Math.min(Math.ceil(((this.numLevels - (pageIndex * amountPerPage)) / amountPerRow)), 3);

            // console.log("Number of Rows: ", numberOfRows);
            for (var rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
                // console.log("Row Index: ", rowIndex);

                var numberOfColumns = Math.min(((this.numLevels - (pageIndex * amountPerPage)) - (rowIndex * amountPerRow)), 4);
                for (var columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {

                    var tempLevelNumber = ((pageIndex * amountPerPage) + (rowIndex * amountPerRow) + columnIndex + 1);
                    // (0 * 12) + (0 * 4) + 0 + 1
                    // (0 * 12) + (0 * 4) + 1 + 1
                    // ...
                    // (0 * 12) + (1 * 4) + 0 + 1


                    var levelButton = this.add.text(x, y, "Level " + (tempLevelNumber), { fill: '#808080' });
                    levelButton.setOrigin(this.centerOriginOff)
                        .on('pointerdown', this.makeHandler(tempLevelNumber, (x) => this.levelClickedHandler(x)))
                        .on('pointerover', this.makeHandler(levelButton, (x) => this.buttonHovered(x)))
                        .on('pointerout', this.makeHandler(levelButton, (x) => this.buttonHoverExit(x)));
                    levelButton.levelNumber = (tempLevelNumber);
                    if (pageIndex != 0) {
                        // Hide levels not on the first page
                        levelButton.setAlpha(0);
                    }

                    this.levels.push(levelButton);
                    x += deltaX;
                }

                // rowIndex--;
                x = initX;
                y += deltaY;

            }
        }


        this.nextPageButton = this.add.image(initX + (deltaX * 4) - (deltaX / 4), initY + deltaY, 'nextButtonImg');
        this.nextPageButton.setDepth(1)
            .on('pointerdown', () => this.nextPageClickedHandler())
            .on('pointerover', this.makeHandler(this.nextPageButton, (x) => this.buttonHovered(x)))
            .on('pointerout', this.makeHandler(this.nextPageButton, (x) => this.buttonHoverExit(x)));

        this.prevPageButton = this.add.image(initX - deltaY, initY + deltaY, 'prevButtonImg');
        this.prevPageButton.setDepth(1)
            .on('pointerdown', () => this.prevPageClickedHandler())
            .on('pointerover', this.makeHandler(this.prevPageButton, (x) => this.buttonHovered(x)))
            .on('pointerout', this.makeHandler(this.prevPageButton, (x) => this.buttonHoverExit(x)));

        if (this.numLevels <= 12) {
            this.nextPageButton.setAlpha(0);
            this.prevPageButton.setAlpha(0);
        } else {
            this.nextPageButton.setInteractive({ 'useHandCursor': true });
            this.prevPageButton.setAlpha(0);
        }



        if (this.LockedLevelData == undefined) {
            this.LockedLevelData = [];

            for (var x = 0; x < this.numLevels; x++) {
                this.LockedLevelData.push(0);
            }

            this.LockedLevelData[0] = 1;
            this.unlockLevel(1);
        }

        else
            this.unlock();

        // setup back button
        this.backButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 2) + this.topOff - (this.spaceOff * 2), "BACK", { fill: '#ffffff' });
        this.backButton.setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler())
            .on('pointerover', this.makeHandler(this.backButton, (x) => this.buttonHovered(x)))
            .on('pointerout', this.makeHandler(this.backButton, (x) => this.buttonHoverExit(x)));
    }

    update() {
        if (this.unlockNext) {
            console.log(this.LockedLevelData);
            console.log(this.clickedLevel + 1);
            this.unlockLevel(this.clickedLevel + 1);
            this.unlockNext = false;
        }
    }
} 