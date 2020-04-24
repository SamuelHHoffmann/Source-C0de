/** @type {import("../typings/phaser)} */

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image("tiles", "tilemapTest/tiles/Rectangle_64x64.png");
    this.load.tilemapTiledJSON("map", "tilemapTest/tilemaps/test_map.json");

    this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 64, frameHeight: 64, endFrame: 4 });

    graphics = this.make.graphics({ x: 0, y: 0, add: true });
}

function create() {


    var config = {
        key: 'WALK',
        frames: this.anims.generateFrameNumbers('nort', { start: 0, end: 4, first: 0 }),
        frameRate: 20
    };

    this.anims.create(config);

    var player = this.add.sprite(250, 250, 'nort');

    player.anims.play('WALK');


    var camera = this.cameras.add(0, 0, screen.width, screen.height);
    camera.setBackgroundColor('rgba(0, 0, 0, 1)');

    const map = this.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage("box", "tiles");

    const layer = map.createStaticLayer("layer", tileset, 0, 0);





}