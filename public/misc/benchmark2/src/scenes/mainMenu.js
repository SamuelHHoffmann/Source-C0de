/** @type {import("../../typings/phaser")} */

class MainMenu extends Phaser.Scene {
    // variables for buttons
    playButton;
    settingsButton;
    aboutButton;

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

    constructor(handle, parent) {
        super(handle);
    }

    playClickHandler() {
        // transition to level select
        this.scene.switch('LevelSelect');

        // play sound
        this.sound.play('clickSound');
    }

    settingsClickHandler() {
        // transition to settings menu
        this.scene.switch('SettingsMenu');

        // play sound
        this.sound.play('clickSound');
    }

    aboutClickHandler() {
        // transition to about menu
        this.scene.switch('AboutMenu');

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

    preload() {
        this.load.image('logo', 'resources/images/source-c0de-logo.png');
    }

    create() {
        // start playing music
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.backgroundMusic.play({loop: true});

        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // add title image
        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);

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