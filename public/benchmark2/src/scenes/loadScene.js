/** @type {import("../../typings/phaser")} */

class LoadingScene extends Phaser.Scene {

    constructor(handle, parent) {
        super(handle);

        this.parent = parent;
    }

    preload() {
        this.load.image('logo', 'resources/images/source-c0de-logo.png');

    }

    create() {
        var logoIMG = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logo');
        logoIMG.setScale(0.25);

        
        
    }

    update() {

    }

}