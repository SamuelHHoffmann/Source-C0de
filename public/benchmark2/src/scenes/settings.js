/** @type {import("../../typings/phaser")} */

class SettingsMenu extends Phaser.Scene { 
        // variables for buttons
        backButton

        // offsets
        spaceOff = 50;
        topOff = this.spaceOff;
        centerOriginOff = .5;
    
        // static text
        title;
    
        backClickHandler() {
            // transition back to MainMenu
            this.scene.switch('MainMenu');
        }
    
        preload() {
        }
    
        create() {
            // get camera center x and y
            var cameraCenterX = this.cameras.main.centerX;
            var cameraCenterY = this.cameras.main.centerY;
    
            // setup About title
            this.title = this.add.text(cameraCenterX, this.topOff, "Settings", { fill: '#ffffff', boundsAlignV: 'middle' })
            .setFontSize(36).setOrigin(this.centerOriginOff);
    
            // TODO put options here

            // setup back button
            this.aboutButton = this.add.text(cameraCenterX, cameraCenterY-this.topOff+(this.spaceOff*2), "BACK", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.backClickHandler());
        }
    
        update() {
        }
} 