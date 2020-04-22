var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
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

    graphics = this.make.graphics({x: 0, y: 0, add: true});
  }
  
  function create() {
    var camera = this.cameras.add(0,0,screen.width,screen.height);
    camera.setBackgroundColor('rgba(255, 255, 255, 1)');

    const map = this.make.tilemap({ key: "map" });
  
    const tileset = map.addTilesetImage("box", "tiles");
  
    const layer = map.createStaticLayer("layer", tileset, 0, 0);
  }