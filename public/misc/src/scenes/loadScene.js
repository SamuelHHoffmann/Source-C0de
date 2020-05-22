/** @type {import("../../typings/phaser")} */



class LoadingScene extends Phaser.Scene {

    constructor(handle, parent) {
        super(handle);

        this.parent = parent;
        this.player;
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
            frameRate: 20,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'WALK_LEFT',
            frames: this.anims.generateFrameNumbers('nort', { start: 5, end: 9, first: 5 }),
            frameRate: 20,
            repeat: -1
        };

        this.anims.create(config);

        this.player = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 60 + this.cameras.main.height / 2, 'nort');

        this.player.anims.play('WALK_RIGHT');
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

        if (cursors.right.isDown) {
            this.player.setVelocity(160, 0);
            this.player.anims.play('WALK_RIGHT', true);
        } else if (cursors.left.isDown) {
            this.player.setVelocity(-160, 0);
            this.player.anims.play('WALK_LEFT', true);
        } else {
            this.player.setVelocity(0, 0);
        }


    }

}