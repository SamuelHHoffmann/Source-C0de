/** @type {import("../../typings/phaser")} */

class PauseScene extends Phaser.Scene {
    // variables for buttons
    resumeButton;
    levelSelectButton;
    volumeButton;
    restartButton;

    // background logo
    logoIMG;

    // audio
    backgroundMusic;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;

    // current volume frame
    frame = 2;

    constructor(handle, parent) {
        super(handle);
    }

    resumeClickHandler() {
        // transition to level select
        this.scene.switch('LevelScene');

        // play sound
        this.sound.play('clickSound');
    }

    levelSelectClickHandler() {
        // transition to settings menu
        this.scene.manager.getScene('LevelScene').quitLevel();
        this.scene.switch('LevelSelect');

        // play sound
        this.sound.play('clickSound');
    }

    restartClickedHandler(){
        this.game.scene.getScene('LevelScene').reDrawLayer = true;
        // transition to level select
        this.scene.switch('LevelScene');

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


    
    volumeClickHandler() {
        // update frame
        this.frame++;
        if (this.frame > 3)
            this.frame = 0;
        this.volumeButton.setFrame(this.frame);

        // update volume
        if (this.frame != 3)
            this.sound.volume = (this.frame + 1) * (1 / 3);
        else
            this.sound.volume = 0;

        // play sound
        this.sound.play('clickSound');
    }

    preload() {
        this.load.image('logo', 'resources/images/source-c0de-logo.png');
        this.load.spritesheet('volumeSprite', 'resources/spriteSheets/volume.png', { frameWidth: 64, frameHeight: 64 })
    }

    create() {

        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // add title image
        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);

        // set up resume button
        this.resumeButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff, "RESUME", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.resumeClickHandler())
            .on('pointerover', () => this.buttonHovered(this.resumeButton))
            .on('pointerout', () => this.buttonHoverExit(this.resumeButton))
            .setDepth(1);

        // set up main menu button
        this.levelSelectButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + this.spaceOff, "LEVEL SELECT", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.levelSelectClickHandler())
            .on('pointerover', () => this.buttonHovered(this.levelSelectButton))
            .on('pointerout', () => this.buttonHoverExit(this.levelSelectButton))
            .setDepth(1);

        // set up main menu button
        this.restartButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + (this.spaceOff * 2), "RESTART", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.restartClickedHandler())
            .on('pointerover', () => this.buttonHovered(this.restartButton))
            .on('pointerout', () => this.buttonHoverExit(this.restartButton))
            .setDepth(1);


        // set up volume label
        this.volumeButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + (this.spaceOff * 3.5), "VOLUME:", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setDepth(1);

        // volume option
        this.volumeButton = this.add.sprite(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + (this.spaceOff * 4.5), 'volumeSprite', this.frame);
        this.volumeButton.setInteractive({ 'useHandCursor': true })
            .setOrigin(this.centerOriginOff)
            .on('pointerup', () => this.volumeClickHandler());
    }

    update() {
    }
}