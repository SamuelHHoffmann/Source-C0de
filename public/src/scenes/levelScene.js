/** @type {import("../../typings/phaser")} */

class LevelScene extends Phaser.Scene {
    // manager for rift component of levels
    riftManager;

    levelNumber = 0;

    reDrawLayer = false;

    glitchPipe;

    // player info
    player;
    playerInAir;

    // boss info
    boss;

    // map and tileset info
    map;
    collision_layer;
    decoration_layer;
    ground_decorations_layer;
    invRift1Layer;
    invRift1Colider;
    invRift2Layer;
    invRift2Colider;
    riftLayer;

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

        this.input.keyboard.removeKey(this.levelData.input.rightKey);
        this.input.keyboard.removeKey(this.levelData.input.leftKey);
        this.input.keyboard.removeKey(this.levelData.input.jumpKey);
        this.game.scene.getScene('LevelSelect').unlockNext = true;
        this.scene.switch('LevelSelect');
        return true;
    }

    quitLevel() {
        this.input.keyboard.removeKey(this.levelData.input.rightKey);
        this.input.keyboard.removeKey(this.levelData.input.leftKey);
        this.input.keyboard.removeKey(this.levelData.input.jumpKey);
        RiftActionManager.reverseToLevel(this.levelNumber);
    }

    preload() {
        this.load.image('pauseImg', 'resources/images/menuButton.png');

        this.load.image("tiles", "resources/spriteSheets/nort_platform_tiles-Sheet.png");
        this.load.text('levelData', "resources/data/levelData.json");

        this.load.image("riftParticles", "resources/images/riftParticle.png");
        this.load.image("maskedImg", "resources/images/maskedEffect.png");

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

        this.load.spritesheet('boss', 'resources/spriteSheets/BossSprite-Sheet.png', { frameWidth: 32, frameHeight: 32 });

        this.load.audio('jumpSound', 'resources/audio/soundEffects/jump.mp3');
        this.load.audio('walkSound', 'resources/audio/soundEffects/walk.mp3');
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

        this.tileset = tileset;

        // check if we need to destoy old values
        try {
            this.collision_layer.destroy();
            this.decoration_layer.destroy();
            this.ground_decorations_layer.destroy();
            this.player.destroy();
        } catch{ }

        try {
            this.riftLayer.destroy();
        } catch{ }
        try {
            this.invRift1Layer.destroy();
        } catch{ }
        try {
            this.invRift2Layer.destroy();
        } catch{ }


        // setup collision for tilemap
        this.collision_layer = this.map.createStaticLayer("collision", tileset, 0, 0).setDepth(20);
        this.decoration_layer = this.map.createStaticLayer("decorations", tileset, 0, 0).setDepth(20);
        this.ground_decorations_layer = this.map.createStaticLayer("ground_decorations", tileset, 0, 0).setDepth(20);

        this.collision_layer.setCollisionBetween(0, 5);
        this.decoration_layer.setCollisionBetween(0, 5);
        this.ground_decorations_layer.setCollisionBetween(0, 5);

        this.collision_layer.setTileIndexCallback(34, this.endLevel, this);
        this.collision_layer.setTileIndexCallback(35, this.endLevel, this);

        var xPos = this.levelData.levels[this.levelNumber - 1].startPositionX;
        var yPos = this.levelData.levels[this.levelNumber - 1].startPositionY;

        // initialize player position and add drag to player's physics body
        this.player = this.physics.add.sprite(xPos, yPos, 'nort').setDragX(this.levelData.input.drag).setDamping(true);

        // set player animation to IDLE upon loading into level
        this.player.anims.play('IDLE');

        this.player.setDepth(1);
        this.player.setCollideWorldBounds(true);

        this.player.carrying = false;
        this.player.throwStrength = this.levelData.input.throwStrength;
        this.player.gravity = this.physics.world.gravity.y;

        this.physics.add.collider(this.player, this.collision_layer);
        this.physics.add.collider(this.player, this.ground_decorations_layer);
        this.physics.add.collider(this.player, this.decoration_layer);

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


        // setup boss

        if(this.boss != undefined || this.boss != null) {
            this.boss.bossTearDown();
            this.boss = null;
        }


        //this.boss = new Boss(this, this.riftManager.riftParticles);
        //this.boss.bossSpawnBody(0, 0, 20);
        //this.boss.behavior = BossBehaviors.GOES_NOWHERE_DOES_NOTHING;
        

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
            frames: this.anims.generateFrameNumbers('nort', { start: 25, end: 25, first: 25 }),
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

        // boss anims

        config = {
            key: 'BOSS_HEAD_ARMOR_IDLE',
            frames: this.anims.generateFrameNumbers('boss', { start: 1, end: 10, first:  1}),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'BOSS_HEAD_ARMOR_SHATTER',
            frames: this.anims.generateFrameNumbers('boss', { start: 11, end: 17, first:  11}),
            frameRate: 10
            //nextAnim: 'BOSS_HEAD_BARE_IDLE'
        };

        this.anims.create(config);

        config = {
            key: 'BOSS_HEAD_BARE_IDLE',
            frames: this.anims.generateFrameNumbers('boss', { start: 18, end: 30, first:  18}),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'BOSS_BODY_ARMOR_IDLE',
            frames: this.anims.generateFrameNumbers('boss', { start: 31, end: 31, first:  31}),
            frameRate: 1,
            repeat: -1
        };

        this.anims.create(config);

        config = {
            key: 'BOSS_BODY_ARMOR_SHATTER',
            frames: this.anims.generateFrameNumbers('boss', { start: 32, end: 37, first:  32}),
            frameRate: 10
            //nextAnim: 'BOSS_BODY_BARE_IDLE'
        };

        this.anims.create(config);

        config = {
            key: 'BOSS_BODY_BARE_IDLE',
            frames: this.anims.generateFrameNumbers('boss', { start: 38, end: 48, first:  38}),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);

    }

    create() {
        this.cameras.main.setBackgroundColor('#595959');

        // add sound effects
        this.jumpSound = this.sound.add('jumpSound');
        this.walkSound = this.sound.add('walkSound', { rate: 1.4 });

        this.puaseButton = this.add.image(25, 25, 'pauseImg')
            .setDepth(30)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => { this.scene.switch('PauseScene'); });

        WorldGlitchPipe.create(this);

        // setup necessary info for level
        this.setUpAnimations();
        this.setUpMap();
    }

    update() {
        if (this.reDrawLayer) { this.setUpMap(); }
        if ((this.player.body.onFloor() && this.physics.world.gravity.y > 0) || 
            (this.player.body.onCeiling() && this.physics.world.gravity.y < 0))
            this.playerInAir = false;

        if (this.input.keyboard.addKey('P').isDown) {
            // this.levelData.input.jumpHeight = -300;
            console.log(this.player.x, this.player.y);
        }

        var rightKey = this.input.keyboard.addKey(this.levelData.input.rightKey);
        var leftKey = this.input.keyboard.addKey(this.levelData.input.leftKey);
        var jumpKey = this.input.keyboard.addKey(this.levelData.input.jumpKey);
        var crouchKey = this.input.keyboard.addKey(this.levelData.input.downKey);

        // make sure drag is updated
        this.player.setDragX(this.levelData.input.drag);

        // check to see if throw strength has changed
        if (this.player.throwStrength != this.levelData.input.throwStrength)
            this.player.throwStrength = this.levelData.input.throwStrength;

        // check to see if gravity changed
        if (this.physics.world.gravity.y != this.levelData.input.gravity) {
            this.physics.world.gravity.y = this.levelData.input.gravity;
            this.player.gravity = this.levelData.input.gravity;
        }

        // check if gravity was reversed
        if (this.physics.world.gravity.y < 0)
            this.player.flipY = true;
        else
            this.player.flipY = false;

        if (rightKey.isDown) {
            this.walkRight();
        }
        else if (leftKey.isDown) {
            this.walkLeft();
        }
        else if (jumpKey.isDown)
            this.jump();
        else if (crouchKey.isDown)
            this.crouch();
        else {
            this.idle();
        }

        // check if we need to reset hit box
        if (this.player.state != 'crouch')
            this.player.body.setSize(this.player.frameWidth, this.player.frameHeight).setOffset(0, 0);

        this.riftManager.riftManagerUpdate(this.player);


        if(this.boss != undefined && this.boss != null) {
            this.boss.bossUpdate();
        }

        WorldGlitchPipe.update(this);
    }

    idle() {
        this.player.state = "idle";

        // if not in air
        if (!this.playerInAir) {
            if (this.player.carrying) {
                this.player.anims.play('IDLE_CARRY', true);
            } else {
                this.player.anims.play('IDLE', true);
            }
        }
        // if in air
        else {
            if (this.player.carrying) {
                this.player.anims.play('JUMP_CARRY', true);

            } else {
                this.player.anims.play('JUMP', true);
            }
        }
    }

    crouch() {
        this.player.state = "crouch";

        this.player.anims.play('HIDDEN', false);
        this.player.body.setSize(this.player.frameWidth, 25).setOffset(0, 40);
    }

    jump() {
        this.player.state = "jump"
        if ((this.player.body.onFloor() && this.physics.world.gravity.y > 0) || (this.player.body.onCeiling() && this.physics.world.gravity.y < 0)) {
            // check which direction gravity is going
            if (this.physics.world.gravity.y > 0)
                this.player.setVelocityY(this.levelData.input.jumpHeight);
            else
                this.player.setVelocityY(-this.levelData.input.jumpHeight);
            this.playerInAir = true;
            if (this.player.carrying) {
                this.player.anims.play('JUMP_CARRY', true);

            } else {
                this.player.anims.play('JUMP', true);
            }

            // play jump sound
            this.jumpSound.play();
        }
    }

    walkLeft() {
        // check if jumping
        if (this.input.keyboard.addKey(this.levelData.input.jumpKey).isDown)
            this.jump();

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
    }

    walkRight() {
        // check if jumping
        if (this.input.keyboard.addKey(this.levelData.input.jumpKey).isDown)
            this.jump();

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
    }

}
