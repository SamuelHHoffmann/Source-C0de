/** @type {import("../../typings/phaser")} */

class LevelSelect extends Phaser.Scene {
    // variables for buttons
    backButton;
    backgroundShowing = false;

    levels;
    numLevels;
    levelName;
    levelDesc;
    clickedLevel;

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

    startClickHandler() {
        console.log("Start clicked");

        this.game.scene.getScene('LevelScene').reDrawLayer = true;
        this.game.scene.getScene('LevelScene').setLevelNumber(this.clickedLevel);

        this.backgroundShowing = false;
        this.levelName.setAlpha(0);
        this.levelDesc.setAlpha(0);
        this.descBackground.setAlpha(0);
        this.title.setAlpha(0);

        this.scene.switch('LevelScene');

        // play sound
        this.sound.play('clickSound');
    }


    backClickHandler() {
        // transition back to MainMenu
        if (this.backgroundShowing == false) {
            this.scene.switch('MainMenu');
        } else {
            this.backgroundShowing = false;
            this.levelName.setAlpha(0);
            this.levelDesc.setAlpha(0);
            this.descBackground.setAlpha(0);
            this.title.setAlpha(0);
        }

        // play sound
        this.sound.play('clickSound');
    }

    levelClickedHandler(levelNumber) {

        if (this.backgroundShowing) {
            return;
        }

        this.clickedLevel = levelNumber;

        console.log(this.levelData);

        // transition back to MainMenu
        // this.levelName.setText("");
        // var searchName = "level_" + levelNumber + "_name: \"";
        // console.log(searchName);
        // this.levelName.setText(this.levelDataText.substring(this.levelDataText.search(searchName) + searchName.length,
        //     this.levelDataText.indexOf("\",", this.levelDataText.search(searchName))));
        this.levelName.setText(this.levelData.levels[levelNumber - 1].name);

        // searchName = "level_" + levelNumber + "_desc: \"";
        // this.levelDesc.setText(this.levelDataText.substring(this.levelDataText.search(searchName) + searchName.length,
        //     this.levelDataText.indexOf("\",", this.levelDataText.search(searchName))));
        this.levelDesc.setText(this.levelData.levels[levelNumber - 1].desc);

        // console.log(this.levelName.text);
        // console.log(this.levelDesc.text);

        if (this.levelName.text == "") {
            //if empty don't show anything
            return;
        }

        this.backgroundShowing = true;

        this.descBackground.setAlpha(1);
        this.levelName.setAlpha(1);
        this.levelDesc.setAlpha(1);
        this.title.setAlpha(1);
        // console.log(levelNumber);
        
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

    preload() {
        //this.load.text('levelData', 'resources/data/levelData.txt');

        // load level data
        this.load.text('levelData', 'resources/data/levelData.json');
        this.load.image('levelDescBackground', 'resources/images/levelSelectBackground.png');
    }

    create() {
        // parse level data
        this.levelData = JSON.parse(this.cache.text.get('levelData'));
        console.log(this.levelData);

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
        // this.levelDataText = this.cache.text.get('levelData');
        // this.numLevels = parseInt(this.levelDataText.substring(this.levelDataText.search('level_count:') + 12, this.levelDataText.indexOf(',', this.levelDataText.search('level_count:') + 12)));
        this.numLevels = this.levelData.levelCount;

        var x = cameraCenterX - this.cameras.main.width / 5.5;
        var y = cameraCenterY;
        var amountPerRow = 4;

        for (var i = 0; i < this.numLevels; i++) {
            var minRowAmount = Math.min(Math.max(0, this.numLevels - (i * amountPerRow)), amountPerRow);

            for (var j = 0; j < minRowAmount; j++) {
                var levelButton = this.add.text(x, y, "Level " + (i + 1), { fill: '#ffffff' });
                levelButton.setOrigin(this.centerOriginOff)
                    .setInteractive({ 'useHandCursor': true })
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

        // setup back button
        this.backButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 2) + this.topOff - (this.spaceOff * 2), "BACK", { fill: '#ffffff' });
        this.backButton.setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler())
            .on('pointerover', this.makeHandler(this.backButton, (x) => this.buttonHovered(x)))
            .on('pointerout', this.makeHandler(this.backButton, (x) => this.buttonHoverExit(x)));
    }

    update() {
    }
} 