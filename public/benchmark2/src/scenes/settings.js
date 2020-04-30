/** @type {import("../../typings/phaser")} */

class SettingsMenu extends Phaser.Scene {
    // variables for buttons
    backButton;
    volumeButton;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;

    // current volume frame
    frame = 2;

    backClickHandler() {
        // transition back to MainMenu
        this.scene.switch('MainMenu');
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
        if(this.frame != 3)
            this.sound.volume = (this.frame+1) * (1/3);
        else
            this.sound.volume = 0;
    }

    preload() {
        this.load.spritesheet('volumeSprite', 'resources/spriteSheets/volume.png', { frameWidth: 64, frameHeight: 64 })
    }

    create() {
        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        // setup About title
        this.title = this.add.text(cameraCenterX, this.topOff, "Settings", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36).setOrigin(this.centerOriginOff);

        // volume option
        this.volumeButton = this.add.sprite(cameraCenterX, cameraCenterY, 'volumeSprite', this.frame);
        this.volumeButton.setInteractive({ 'useHandCursor': true })
            .setOrigin(this.centerOriginOff)
            .on('pointerup', () => this.volumeClickHandler());

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