/** @type {import("../../typings/phaser")} */



class LoadingScene extends Phaser.Scene {

    constructor(handle, parent) {
        super(handle);

        this.parent = parent;
        this.player;
        this.isJumpping = false;
    }

    preload() {
        this.load.image('logo', 'resources/images/source-c0de-logo.png');
        this.load.image("tiles", "tilemapTest/tiles/Rectangle_64x64.png");

        this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 64, frameHeight: 64 });

    }

    create() {


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


        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 60 + this.cameras.main.height / 2, 'nort');

        this.player.anims.play('IDLE');
        this.player.setDepth(1);
        this.player.setCollideWorldBounds(true);



        var logoIMG = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logo');
        logoIMG.setScale(0.2);
        logoIMG.setDepth(0);


        // var platform = this.physics.add.staticGroup();
        // platform.create(this.cameras.main.centerX - 320, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 320 + 64, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 320 + 128, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 320 + 64 + 128, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 320 + 128 + 128, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 64, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 128, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 64 - 128, this.cameras.main.centerY + 320, 'tiles');
        // platform.create(this.cameras.main.centerX - 128 - 128, this.cameras.main.centerY + 320, 'tiles');







    }

    update() {
        var cursors = this.input.keyboard.createCursorKeys();

        if (this.input.keyboard.addKey('ENTER').isDown) {
            this.scene.restart(this);
        }


        if (cursors.right.isDown) {
            this.player.setVelocity(100, 0);
            this.player.anims.play('WALK_RIGHT', true);
        } else if (cursors.left.isDown) {
            this.player.setVelocity(-100, 0);
            this.player.anims.play('WALK_LEFT', true);
        } else if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocity(0, -250);
            this.player.anims.play('JUMP', true);
        } else {
            this.player.anims.play('IDLE', true);
            this.player.setVelocity(0, 0);
        }


    }

}