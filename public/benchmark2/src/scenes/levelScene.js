/** @type {import("../../typings/phaser")} */

class LevelScene extends Phaser.Scene {
    // manager for rift component of levels
    riftManager;

    levelNumber = 0;

    reDrawLayer = false;

    // player info
    player;
    playerInAir;

    // map and tileset info
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
        if (this.reDrawLayer) { return; }
        this.input.keyboard.enabled = false;
        RiftActionManager.restoreStack(false);
        this.scene.switch('LevelSelect');
        return true;
    }

    preload() {
        RiftActionManager.scene = this;

        this.load.image("tiles", "resources/spriteSheets/nort_platform_tiles-Sheet.png");
        this.load.text('levelData', "resources/data/levelData.json");

        // parse json text
        this.levelData = JSON.parse(this.cache.text.get('levelData'));

        // load tilemaps for all current levels
        for (var x = 0; x < this.levelData.levelCount; x++) {
            try {
                this.load.tilemapTiledJSON("level_" + (x + 1), this.levelData.levels[x].tileMapPath);
            } catch{ console.error('Path in json file invalid for level ' + (x + 1)) }
        }

        // load json file with level properties
        this.load.text('levelProperties', 'resources/data/levelData.json');

        this.load.spritesheet('nort', "resources/spriteSheets/nort.png", { frameWidth: 32, frameHeight: 64 });

        this.load.audio('jumpSound', 'resources/audio/soundEffects/jump.wav');
        this.load.audio('walkSound', 'resources/audio/soundEffects/walk.wav');
    }

    setUpMap() {
        this.input.keyboard.clearCaptures();
        this.input.keyboard.enabled = true;


        if (this.riftManager != undefined) {
            this.riftManager.riftManagerTeardown(this);
        }

        // setup tilemap for level
        this.map = this.make.tilemap({ key: "level_" + this.levelNumber });

        const tileset = this.map.addTilesetImage("nort_platform_tiles-Sheet", "tiles");

        // check if we need to destoy old values
        try {
            this.collision_layer.destroy();
            this.decoration_layer.destroy();
            this.ground_decorations_layer.destroy();
            this.player.destroy();
        } catch{ }

        // setup collision for tilemap
        this.collision_layer = this.map.createStaticLayer("collision", tileset, 0, 0).setDepth(2);
        this.decoration_layer = this.map.createStaticLayer("decorations", tileset, 0, 0).setDepth(2);
        this.ground_decorations_layer = this.map.createStaticLayer("ground_decorations", tileset, 0, 0).setDepth(2);

        this.collision_layer.setCollisionBetween(0, 5);

        this.collision_layer.setTileIndexCallback(34, this.endLevel, this);

        var xPos = this.levelData.levels[this.levelNumber - 1].startPositionX;
        var yPos = this.levelData.levels[this.levelNumber - 1].startPositionY;

        // initialize player position and add drag to player's physics body
        this.player = this.physics.add.sprite(xPos, yPos, 'nort').setDragX(0.85).setDamping(true);

        // set player animation to IDLE upon loading into level
        this.player.anims.play('IDLE')
            .setDepth(1)
            .setCollideWorldBounds(true);

        this.player.carrying = false;

        this.physics.add.collider(this.player, this.collision_layer);

        this.input.keyboard.clearCaptures();

        this.reDrawLayer = false;

        // setup riftmanager info
        if (this.riftManager == undefined) {
            this.riftManager = new RiftManager(this);
        }
        if (this.riftManager != undefined) {
            this.riftManager.riftManagerLevelLoad(this);
            this.setupRifts();
        }
    }


    setupRifts() {
        var numRifts = this.levelData.levels[this.levelNumber - 1].numRifts;

        for (var i = 0; i < numRifts; i++) {
            var riftX = this.levelData.levels[this.levelNumber - 1].rifts[i].xPos;
            var riftY = this.levelData.levels[this.levelNumber - 1].rifts[i].yPos;
            var riftBody = this.levelData.levels[this.levelNumber - 1].rifts[i].text;
            var riftType = this.levelData.levels[this.levelNumber - 1].rifts[i].inputType;
            var riftID = "" + (this.levelNumber) + "" + (i + 1);
            this.riftManager.createNewRift(this, riftX, riftY, riftBody, riftType, riftID);
        }

        var numRiftElements = this.levelData.levels[this.levelNumber - 1].numRiftElements;
        for (var i = 0; i < numRiftElements; i++) {
            var riftX = this.levelData.levels[this.levelNumber - 1].riftElements[i].xPos;
            var riftY = this.levelData.levels[this.levelNumber - 1].riftElements[i].yPos;
            var riftDrop = this.levelData.levels[this.levelNumber - 1].riftElements[i].text;
            var riftType = this.levelData.levels[this.levelNumber - 1].riftElements[i].inputType;
            var riftInputID = "" + (this.levelNumber) + "" + (i + 1);
            this.riftManager.createNewRiftInput(this, riftX, riftY, riftDrop, riftType, riftInputID);

        }
        RiftActionManager.reverseToLevel(this.levelNumber);
    }

    setUpAnimations() {
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

        var config = {
            key: 'WALK_LEFT_CARRY',
            frames: this.anims.generateFrameNumbers('nort', { start: 15, end: 19, first: 15 }),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'WALK_RIGHT_CARRY',
            frames: this.anims.generateFrameNumbers('nort', { start: 20, end: 24, first: 20 }),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'IDLE_CARRY',
            frames: this.anims.generateFrameNumbers('nort', { start: 25, end: 26, first: 25 }),
            frameRate: 2,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'JUMP_CARRY',
            frames: this.anims.generateFrameNumbers('nort', { start: 27, end: 28, first: 27 }),
            frameRate: 5
        };

        this.anims.create(config);

        config = {
            key: 'WAVE',
            frames: this.anims.generateFrameNumbers('nort', { start: 30, end: 34, first: 30 }),
            frameRate: 10
        };

        this.anims.create(config);

        config = {
            key: 'HIDE',
            frames: this.anims.generateFrameNumbers('nort', { start: 35, end: 39, first: 35 }),
            frameRate: 10
        };

        this.anims.create(config);

        config = {
            key: 'UNHIDE',
            frames: this.anims.generateFrameNumbers('nort', { start: 40, end: 44, first: 40 }),
            frameRate: 10
        };

        this.anims.create(config);

        config = {
            key: 'HIDDEN',
            frames: this.anims.generateFrameNumbers('nort', { start: 40, end: 40, first: 40 }),
            frameRate: 1,
            repeat: -1
        };

        this.anims.create(config);
    }

    create() {
        this.cameras.main.setBackgroundColor('#595959');

        // add sound effects
        this.jumpSound = this.sound.add('jumpSound');
        this.walkSound = this.sound.add('walkSound', { rate: 1.4 });

        // setup necessary info for level
        this.setUpAnimations();
        this.setUpMap();
    }

    update() {
        if (this.reDrawLayer) { this.setUpMap(); }
        if (this.player.body.onFloor()) { this.playerInAir = false; }

        if (this.input.keyboard.addKey('P').isDown) {
            // this.levelData.input.jumpHeight = -300;
            console.log(this.player.x, this.player.y);
        }

        if (this.input.keyboard.addKey(this.levelData.input.rightKey).isDown) {
            this.walkRight();
        }
        else if (this.input.keyboard.addKey(this.levelData.input.leftKey).isDown) {
            this.walkLeft();
        }
        else if (this.input.keyboard.addKey(this.levelData.input.jumpKey).isDown)
            this.jump();
        else {
            this.idle();
        }

        this.riftManager.riftManagerUpdate(this.player);
    }

    idle() {
        this.player.state = "idle"
        if (!this.playerInAir) {
            if (this.player.carrying) {
                this.player.anims.play('IDLE_CARRY', true);
            } else {
                this.player.anims.play('IDLE', true);
            }
        }
    }

    jump() {
        this.player.state = "jump"
        if (this.player.body.onFloor()) {
            this.player.setVelocityY(this.levelData.input.jumpHeight);
            this.playerInAir = true;
            if (this.player.carrying) {
                this.player.anims.play('JfUMP_CARRY', true);

            } else {
                this.player.anims.play('JUMP', true);
            }

            // play jump sound
            this.jumpSound.play();
        }
    }

    walkLeft() {
        this.player.state = "left"
        this.player.setVelocityX(-1 * this.levelData.input.speed);
        if (this.player.carrying) {
            this.player.anims.play('WALK_LEFT_CARRY', true);

        } else {
            this.player.anims.play('WALK_LEFT', true);
        }

        // play walk sound
        if (!this.walkSound.isPlaying && !this.playerInAir)
            this.walkSound.play();

        // check if jumping
        if (this.input.keyboard.addKey(this.levelData.input.jumpKey).isDown)
            this.jump();
    }

    walkRight() {
        this.player.state = "right"
        this.player.setVelocityX(this.levelData.input.speed);
        if (this.player.carrying) {
            this.player.anims.play('WALK_RIGHT_CARRY', true);

        } else {
            this.player.anims.play('WALK_RIGHT', true);
        }

        // play walk sound
        if (!this.walkSound.isPlaying && !this.playerInAir)
            this.walkSound.play();

        // check if jumping
        if (this.input.keyboard.addKey(this.levelData.input.jumpKey).isDown)
            this.jump();
    }
}
