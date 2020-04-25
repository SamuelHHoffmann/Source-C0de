/** @type {import("../../typings/phaser")} */

class MainMenu extends Phaser.Scene {
    // variables for buttons
    playButton;
    settingsButton;
    aboutButton;

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

    preload() {
    }

    create() {
        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup MainMenu title
        this.title = this.add.text(cameraCenterX, this.topOff, "Main Menu", { fill: '#ffffff', boundsAlignV: 'middle' })
        .setFontSize(36).setOrigin(this.centerOriginOff);

        // set up play button
        this.playButton = this.add.text(cameraCenterX, cameraCenterY-this.topOff, "PLAY", { fill: '#ffffff' })
        .setOrigin(this.centerOriginOff)
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.playClickHandler());

        // set up settings button
        this.settingsButton = this.add.text(cameraCenterX, cameraCenterY-this.topOff+this.spaceOff, "SETTINGS", { fill: '#ffffff' })
        .setOrigin(this.centerOriginOff)
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.settingsClickHandler());

        // set up about button
        this.aboutButton = this.add.text(cameraCenterX, cameraCenterY-this.topOff+(this.spaceOff*2), "ABOUT", { fill: '#ffffff' })
        .setOrigin(this.centerOriginOff)
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.aboutClickHandler());
    }

    update() {
    }
}