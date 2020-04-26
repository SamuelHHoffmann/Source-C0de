/** @type {import("../../typings/phaser")} */

class MainMenu extends Phaser.Scene {
    // variables for buttons
    playButton;
    settingsButton;
    aboutButton;

    // background logo
    logoIMG;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;

    constructor(handle, parent) {
        super(handle);
    }

    playClickHandler() {
        // transition to level select
        // TODO change to level select scene
        this.scene.switch('LoadingScene');
    }

    settingsClickHandler() {
        // transition to settings menu
        this.scene.switch('SettingsMenu');
    }

    aboutClickHandler() {
        // transition to about menu
        this.scene.switch('AboutMenu');
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
        this.load.image('logo', 'resources/images/source-c0de-logo.png');


    }

    create() {



        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);

        // setup MainMenu title
        // this.title = this.add.text(cameraCenterX, this.topOff, "Main Menu", { fill: '#ffffff', boundsAlignV: 'middle' })
        //     .setFontSize(36)
        //     .setOrigin(this.centerOriginOff)
        //     .setDepth(1);

        // set up play button
        this.playButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff, "PLAY", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.playClickHandler())
            .on('pointerover', () => this.buttonHovered(this.playButton))
            .on('pointerout', () => this.buttonHoverExit(this.playButton))
            .setDepth(1);

        // set up settings button
        this.settingsButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + this.spaceOff, "SETTINGS", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.settingsClickHandler())
            .on('pointerover', () => this.buttonHovered(this.settingsButton))
            .on('pointerout', () => this.buttonHoverExit(this.settingsButton))
            .setDepth(1);

        // set up about button
        this.aboutButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + (this.spaceOff * 2), "ABOUT", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.aboutClickHandler())
            .on('pointerover', () => this.buttonHovered(this.aboutButton))
            .on('pointerout', () => this.buttonHoverExit(this.aboutButton))
            .setDepth(1);
    }

    update() {
    }
}