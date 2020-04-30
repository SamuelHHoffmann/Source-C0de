/** @type {import("../../typings/phaser")} */

class LevelScene extends Phaser.Scene {

    levelNumber = 0;

    reDrawLayer = false;

    player;
    playerInAir;

    map;

    collision_layer;
    decoration_layer;
    ground_decorations_layer;

    // level properties from json
    levelData;

    // sound effects
    jumpSound;
    walkSound;

    constructor(handle, parent) {
        super(handle);

        this.parent = parent;
    }

    setLevelNumber(number) {
        this.levelNumber = number;

    }


    endLevel(sprite, tile) {
        var currentScenes = this.scene.manager.getScenes(true, false);
        this.scene.manager.switch(currentScenes[0], 'LevelSelect');
        return false;
    }

    preload() {

        // console.log(this.levelNumber);

        this.load.image("tiles", "resources/spriteSheets/nort_platform_tiles-Sheet.png");
        this.load.text('levelData', "resources/data/levelData.json");

        // parse json text
        this.levelData = JSON.parse(this.cache.text.get('levelData'));

        for (var x = 0; x < this.levelData.levelCount; x++) {
            try {
                this.load.tilemapTiledJSON("level_" + (x + 1), this.levelData.levels[x].tileMapPath);
            } catch{ console.error('Path in json file invalid for level ' + (x + 1)) }
        }

        // load json file with level properties
        this.load.text('levelProperties', 'resources/data/levelData.json');

        // this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 64, frameHeight: 64, endFrame: 4 });

        // graphics = this.make.graphics({ x: 0, y: 0, add: true });


        // this.load.image('logo', 'resources/images/source-c0de-logo.png');
        // this.load.image("tiles", "tilemapTest/tiles/Rectangle_64x64.png");

        // this.load.image('item', 'resources/images/temp-item.png');

        this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 32, frameHeight: 64 });

        this.load.audio('jumpSound', 'resources/audio/soundEffects/jump.wav');
        this.load.audio('walkSound', 'resources/audio/soundEffects/walk.wav');

    }

    setUpMap() {


        this.map = this.make.tilemap({ key: "level_" + this.levelNumber });

        const tileset = this.map.addTilesetImage("nort_platform_tiles-Sheet", "tiles");


        try {
            this.collision_layer.destroy();
            this.player.destroy();
        } catch{ }

        this.collision_layer = this.map.createStaticLayer("Tile Layer 1", tileset, 0, 0).setDepth(2);
        // this.decoration_layer = map.createStaticLayer("decorations", tileset, 0, 0).setDepth(2);
        // this.ground_decorations_layer = map.createStaticLayer("ground_decorations", tileset, 0, 0).setDepth(2);

        this.collision_layer.setCollisionBetween(0, 5);

        this.collision_layer.setTileIndexCallback(34, this.endLevel, this);

        // this.matter.world.convertTilemapLayer(this.collision_layer);

        console.log(this.levelData.levels[this.levelNumber - 1].startPositionX);
        console.log(this.levelData.levels[this.levelNumber - 1].startPositionY);

        var xPos = this.levelData.levels[this.levelNumber - 1].startPositionX;
        var yPos = this.levelData.levels[this.levelNumber - 1].startPositionY;

        this.player = this.physics.add.sprite(parseInt(xPos), parseInt(yPos), 'nort');
        // console.log(this.cameras.main.centerX - 200, this.cameras.main.centerY - 50);

        this.player.anims.play('IDLE')
            .setDepth(1)
            .setCollideWorldBounds(true);



        this.physics.add.collider(this.player, this.collision_layer);

        this.reDrawLayer = false;

    }




    create() {
        // get json levelData


        // this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);

        this.cameras.main.setBackgroundColor('#595959');

        // add sound effects
        this.jumpSound = this.sound.add('jumpSound');
        this.walkSound = this.sound.add('walkSound', { rate: 1.4 });

        var config = {
            key: 'WALK_RIGHT',
            frames: this.anims.generateFrameNumbers('nort', { start: 0, end: 4, first: 0 }),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'WALK_LEFT',
            frames: this.anims.generateFrameNumbers('nort', { start: 5, end: 9, first: 5 }),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'IDLE',
            frames: this.anims.generateFrameNumbers('nort', { start: 10, end: 11, first: 10 }),
            frameRate: 2,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'JUMP',
            frames: this.anims.generateFrameNumbers('nort', { start: 12, end: 13, first: 12 }),
            frameRate: 5
        };

        this.anims.create(config);


        this.setUpMap();
    }

    update() {
        if (this.reDrawLayer) {
            this.setUpMap();
        }

        var cursors = this.input.keyboard.createCursorKeys();

        // if (this.input.keyboard.addKey('ENTER').isDown) {
        //     this.scene.restart(this);
        // }
        if (this.player.body.onFloor()) {
            this.playerInAir = false;
        }

        if (cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.anims.play('WALK_RIGHT', true);

            // play walk sound
            if (!this.walkSound.isPlaying && !this.playerInAir)
                this.walkSound.play();

            // check if jumping
            if (cursors.up.isDown)
                this.jump();
        }
        else if (cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play('WALK_LEFT', true);

            // play walk sound
            if (!this.walkSound.isPlaying && !this.playerInAir)
                this.walkSound.play();

            // check if jumping
            if (cursors.up.isDown)
                this.jump();
        }
        else if (cursors.up.isDown)
            this.jump();
        else {
            if (!this.playerInAir) {
                this.player.anims.play('IDLE', true);
                this.player.setVelocity(0, 0);
            }
        }
    }

    jump() {
        if (this.player.body.touching.down || this.player.body.onFloor()) {
            this.player.setVelocityY(-250);
            this.playerInAir = true;
            this.player.anims.play('JUMP', true);

            // play jump sound
            this.jumpSound.play();
        }
    }
}
