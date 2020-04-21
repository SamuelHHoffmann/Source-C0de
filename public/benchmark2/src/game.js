/** @type {import("../typings/phaser)} */


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: LoadingScene
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update
    // }
};

var game = new Phaser.Game(config);


function preload() {
    this.load.image('logo', './src/resources/images/source-c0de-logo.png');
}

function create() {
    var logoIMG = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logo');
    logoIMG.setScale(0.25)


}

function update() {

}