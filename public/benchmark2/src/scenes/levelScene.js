/** @type {import("../../typings/phaser")} */



class LevelScene extends Phaser.Scene {


    player;
    playerInAir;

    collision_layer;
    decoration_layer;
    ground_decorations_layer;

    constructor(handle, parent) {
        super(handle);

        this.parent = parent;
    }

    preload() {

        this.load.image("tiles", "resources/spriteSheets/nort_platform_tiles-Sheet.png");
        this.load.tilemapTiledJSON("map", "resources/tilemaps/untitled.json");

        // this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 64, frameHeight: 64, endFrame: 4 });

        // graphics = this.make.graphics({ x: 0, y: 0, add: true });


        // this.load.image('logo', 'resources/images/source-c0de-logo.png');
        // this.load.image("tiles", "tilemapTest/tiles/Rectangle_64x64.png");

        // this.load.image('item', 'resources/images/temp-item.png');

        this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 64, frameHeight: 64 });

    }

    create() {

        this.cameras.main.setBackgroundColor('#595959');

        const map = this.make.tilemap({ key: "map" });

        const tileset = map.addTilesetImage("nort_platform_tiles-Sheet", "tiles");

        this.collision_layer = map.createStaticLayer("collide", tileset, 0, 0).setDepth(2);
        this.decoration_layer = map.createStaticLayer("decorations", tileset, 0, 0).setDepth(2);
        this.ground_decorations_layer = map.createStaticLayer("ground_decorations", tileset, 0, 0).setDepth(2);

        this.collision_layer.setCollisionBetween(0, 5);

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


        this.player = this.physics.add.sprite(this.cameras.main.centerX - 200, this.cameras.main.centerY - 50, 'nort');

        this.player.anims.play('IDLE')
            .setDepth(1)
            .setCollideWorldBounds(true);


        this.physics.add.collider(this.player, this.collision_layer);
        // this.physics.add.overlap(this.player, this.ground_decorations_layer);
        // this.physics.add.overlap(this.player, this.ground_decorations_layer);


    }

    update() {
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
            if (cursors.up.isDown && (this.player.body.touching.down || this.player.body.onFloor())) {
                this.player.setVelocityY(-250);
                this.playerInAir = true;
                this.player.anims.play('JUMP', true);
            }
        } else if (cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.anims.play('WALK_LEFT', true);
            if (cursors.up.isDown && (this.player.body.touching.down || this.player.body.onFloor())) {
                this.player.setVelocityY(-250);
                this.playerInAir = true;
                this.player.anims.play('JUMP', true);
            }
        } else if (cursors.up.isDown && (this.player.body.touching.down || this.player.body.onFloor())) {
            this.player.setVelocityY(-250);
            this.playerInAir = true;
            this.player.anims.play('JUMP', true);
        } else {
            if (!this.playerInAir) {
                this.player.anims.play('IDLE', true);
                this.player.setVelocity(0, 0);
            }
        }


    }

}