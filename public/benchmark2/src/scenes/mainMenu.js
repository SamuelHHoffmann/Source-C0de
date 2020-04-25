/** @type {import("../../typings/phaser")} */

class MainMenu extends Phaser.Scene {
    // variables for buttons
    playButton;
    settingsButton;
    aboutButton;

    // offsets for buttons
    topOff;
    spaceOff;

    constructor(handle, parent) {
        super(handle);
    }

    playClickHandler() {
        // transition to level select
        // TODO change to level select scene
        this.scene.start('LoadingScene');
    }

    settingsClickHandler() {
        // transition to settings menu
    }

    aboutClickHandler() {
        // transition to about menu
    }

    preload() {
        // set up offset values
        this.spaceOff = 50;
        this.topOff = -this.spaceOff;
    }

    create() {
        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // set up play button
        this.playButton = this.add.text(cameraCenterX, cameraCenterY+this.topOff, "PLAY", { fill: '#ffffff' })
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.playClickHandler());

        // set up settings button
        this.settingsButton = this.add.text(cameraCenterX, cameraCenterY+this.topOff+this.spaceOff, "SETTINGS", { fill: '#ffffff' })
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.settingsClickHandler());

        // set up about button
        this.aboutButton = this.add.text(cameraCenterX, cameraCenterY+this.topOff+(this.spaceOff*2), "ABOUT", { fill: '#ffffff' })
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.aboutClickHandler());
    }

    update() {

    }
}