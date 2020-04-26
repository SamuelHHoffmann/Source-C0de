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
    }

    create() {
        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup About title
        this.title = this.add.text(cameraCenterX, this.topOff, "About", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36).setOrigin(this.centerOriginOff);

        // setup info
        const infoText = "Here is where info will go.";
        this.info = this.add.text(cameraCenterX, cameraCenterY - this.topOff, infoText, { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36).setOrigin(this.centerOriginOff);

        // setup back button
        this.backButton = this.add.text(cameraCenterX, cameraCenterY - this.topOff + (this.spaceOff * 2), "BACK", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler())
            .on('pointerover', () => this.buttonHovered(this.backButton))
            .on('pointerout', () => this.buttonHoverExit(this.backButton));
    }

    update() {
    }
}