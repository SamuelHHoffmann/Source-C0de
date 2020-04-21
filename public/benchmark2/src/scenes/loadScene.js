/** @type {import("../../typings/phaser")} */

class LoadingScene extends Phaser.Scene {

    constructor(handle, parent) {
        super(handle);

        this.parent = parent;
    }

    preload() {
        this.load.image('logo', '../src/resources/images/source-c0de-logo.png');
    }

    create() {

        this.logoIMG = this.add.image(0, 0, 'logo');

    }

}