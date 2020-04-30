/** @type {import("../../typings/phaser")} */

class AboutMenu extends Phaser.Scene {
    // variables for buttons
    backButton;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;
    info;

    backClickHandler() {
        // transition back to MainMenu
        this.scene.switch('MainMenu');

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
        this.load.text('infoText', 'resources/data/about.txt');
    }

    create() {
        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup About title
        this.title = this.add.text(cameraCenterX, this.topOff, "About", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36)
            .setOrigin(this.centerOriginOff);

        // setup info
        this.info = this.add.text(cameraCenterX, cameraCenterY - this.topOff, this.cache.text.get('infoText'), { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36)
            .setOrigin(this.centerOriginOff)
            .setWordWrapWidth(this.cameras.main.width);

        // setup back button
        this.backButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 2) + this.topOff - (this.spaceOff * 2), "BACK", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler())
            .on('pointerover', () => this.buttonHovered(this.backButton))
            .on('pointerout', () => this.buttonHoverExit(this.backButton));
    }

    update() {
    }
}