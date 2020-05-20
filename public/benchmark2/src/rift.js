/** @type {import("../../typings/phaser")} */

/*
    Home of the Rift class and its members, the RiftInputBlock class,
    and rift effect pipelines/shaders.
*/

class RiftManager {
    /*  Manages rifts and inputs,
        constructor for this should be called in create() 
    */
    constructor(scene) {
        /* group objects contain all rifts and all riftinputs, also manages effects */
        this.rifts = [];
        this.riftZones = scene.physics.add.group([]);
        this.riftInputBlocks = scene.physics.add.group([]);


        /* rift effects objects */
        this.riftParticles = scene.add.particles('riftParticles');
        this.riftGraphics = scene.add.graphics();
        this.riftGraphics.setDepth(this.riftParticles.depth + 1);

        this.riftBackground = scene.add.image(400, 300, "maskedImg");

        scene.player.setDepth(this.riftGraphics.depth + 5); // may not be necessary

        /* allows for the throwing of objects */
        scene.input.on('pointerdown', function () {
            if (scene.player.pickedUp != null) {
                var angle = Phaser.Math.Angle.BetweenPoints(scene.player, scene.input);
                scene.physics.velocityFromRotation(angle, scene.player.throwStrength, scene.player.pickedUp.body.velocity);
                scene.player.pickedUp.yeetCallback();

                scene.player.carrying = false;
                scene.player.pickedUp = null;
            }
        }, scene);
    }

    riftManagerTeardown(scene) {


        this.rifts.forEach(zone => {
            zone.codeText.destroy();
        });

        this.riftParticles.destroy();

        this.rifts = [];

        this.riftZones.clear(true, true);
        this.riftInputBlocks.clear(true, true);

        scene.physics.world.colliders.destroy();
        //scene.physics.world.overlaps.destroy();

    }

    riftManagerLevelLoad(scene) {

        /* allows for block-rift interaction */
        this.riftParticles = scene.add.particles('riftParticles');

        this.riftParticles.visible = false;

        this.riftBackground.setMask(new Phaser.Display.Masks.BitmapMask(scene, this.riftParticles));

        scene.physics.add.overlap(this.riftZones, this.riftInputBlocks, function (zone, input) {
            zone.overlapCallback(input);
            input.overlapCallback(zone);
        });

        /* allows for player-block interaction */
        scene.physics.add.overlap(scene.player, this.riftInputBlocks, function (player, input) {
            input.playerTouchCallback(player);
        });

        /* allows for block-world interaction */
        scene.physics.add.collider(scene.collision_layer, this.riftInputBlocks);

        /* variable for picked up blocks */
        scene.player.pickedUp = null;
    }

    createNewRift(scene, x, y, codeText, acceptedType, id) {
        var rift = new Rift(scene, x, y, codeText, acceptedType, id);

        // rift animations
        scene.tweens.add({
            targets: rift.riftPoly.geom.points.slice(rift.factor + 3, rift.riftPoly.geom.points.length),
            duration: function () {
                return Phaser.Math.Between(500, 5000);
            },
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            y: function () {
                return y + Phaser.Math.Between(rift.totalHeight, rift.totalHeight + 40);
            },
        });

        scene.tweens.add({
            targets: rift.riftPoly.geom.points.slice(1, rift.factor + 2),
            duration: function () {
                return Phaser.Math.Between(500, 5000);
            },
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            y: function () {
                return y + Phaser.Math.Between(0, -40);
            }
        });

        // rift particles
        rift.riftEmitter = this.riftParticles.createEmitter({
            lifespan: 2000,
            speedY: { min: -20, max: 20 },
            speedX: { min: -5, max: 5 },
            scaleX: { start: 0.2, end: 0 },
            scaleY: { start: 1, end: 0 },
            emitZone: {
                type: 'random',
                source: rift.riftPoly.geom,
            },
            rotate: {
                onEmit: function () {
                    var rots = [0, 45, 135];
                    return rots[Phaser.Math.Between(0, rots.length - 1)];
                }
            },
            quantity: 1
        });

        rift.codeText.setDepth(this.riftGraphics.depth + 1);
        rift.codeText.setColor('black');

        this.rifts.push(rift);
        console.log(this.rifts);
        this.riftZones.add(rift.riftZone);
    }

    createNewRiftInput(scene, x, y, inputText, inputType, id) {
        var riftInput = new RiftInputBlock(scene, x, y, inputText, inputType, id);
        riftInput.setDepth(this.riftGraphics.depth + 1);
        riftInput.setColor('white');

        this.riftInputBlocks.add(riftInput);
    }

    riftManagerUpdate(player) {
        this.riftGraphics.clear();
        this.riftGraphics.fillStyle(0xfafafa);

        for (var rift of this.rifts) {
            this.riftGraphics.fillPoints(rift.riftPoly.geom.points, true);
        }

        if (player != null) {
            if (player.pickedUp != null) {

                if (player.state == "crouch") {
                    //above little crouch box
                    player.pickedUp.x = player.x - (player.pickedUp.width / 2);
                    player.pickedUp.y = player.y + (player.pickedUp.height / 4);
                } else if (player.state == "idle" || player.state == "jump" || player.pickedUp.id == "113") {
                    // above head
                    player.pickedUp.x = player.x - (player.pickedUp.width / 2);
                    player.pickedUp.y = player.y - (player.height / 2) - (player.pickedUp.height / 4);
                } else if (player.state == "left") {
                    // left
                    player.pickedUp.x = player.x - (player.width / 2) - (player.pickedUp.width);
                    player.pickedUp.y = player.y - 10;
                } else if (player.state == "right") {
                    // right
                    player.pickedUp.x = player.x + (player.width / 2);
                    player.pickedUp.y = player.y - 10;

                }
            }
        }

    }

}

class RiftInputBlock extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, type, id) {
        super(scene, x, y, text);

        /* The type of this block, e.g. 'int', 'float', 'string', ... */
        this.blockType = type;
        this.id = id;
        this.scene = scene;
        this.pickupDelay = 0;
        this.rejectDelay = 0;

        this.caughtInRift = false;

        /* Factory functions */
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        this.body.setCollideWorldBounds(true);
        this.body.setDragX(0.95);
        this.body.useDamping = true;
    }

    overlapCallback(rift) {
        if (this.caughtInRift == false && this.rejectDelay < 0) {
            this.body.setAllowGravity(false);
            this.body.setVelocity(0, 0);

            this.x = rift.x - (rift.width / 2);
            this.y = rift.y - (rift.height / 2);

            this.caughtInRift = true;

            if (this.blockType == rift.acceptedType) { // rift accepts
                this.setColor('black');
                var callabckFn = RiftActionManager.getFunctionForID(rift.id, this.id);
                RiftActionManager.idStack.push((rift.id + this.id));
                callabckFn();
            } else { // rift rejects
                this.rejectDelay = 25;
                this.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
                this.body.setAllowGravity(true);
                this.caughtInRift = false;
            }
        } else {
            this.rejectDelay -= 1;
        }
    }

    playerTouchCallback(player) {
        this.pickupDelay -= 1;
        if ((player.pickedUp == null && this.caughtInRift == false) && this.pickupDelay <= 0) {
            player.pickedUp = this;
            player.carrying = true;

            this.body.setAllowGravity(false);
            this.body.setVelocity(0, 0);

            this.setColor('black');

            this.caughtInRift = true;
        }
    }

    yeetCallback() {
        this.setColor('white');
        this.pickupDelay = 20;
        this.body.setAllowGravity(true);
        this.caughtInRift = false;
    }

    preUpdate() { }
}

class Rift {
    /* 
        Rift class! Contains codeText, which is the code puzzle needing 
        to be solved, riftZone, which is there to help detect overlaps from
        riftinputblocks 
    */
    constructor(scene, x, y, codeText, acceptedType, id) {
        var zoneWidth = 100, zoneHeight = 20;

        /* The type of block this rift accepts, e.g. 'int', 'float', 'string', ... */
        this.acceptedType = acceptedType;

        /* rift objects */
        this.codeText = new RiftText(scene, x, y, codeText);

        this.riftZone = new RiftZone(scene,
            x + this.codeText.width + zoneWidth / 2,
            y + this.codeText.height / 2,
            zoneWidth,
            zoneHeight,
            acceptedType,
            id
        );

        this.totalHeight = zoneHeight;
        this.totalWidth = this.riftZone.width + this.codeText.width;

        this.factor = Math.ceil(this.totalWidth / 30);
        this.riftPoly = this.buildRiftPoly(scene, x, y, this.totalWidth, this.totalHeight, this.factor);

        //this.buildRiftEffects();

        /* currently unused
        this.zoneText = new RiftText(scene, 
            this.riftZone.x - this.riftZone.width,
            this.riftZone.y - this.height / 2,
            ""
        );*/
    }

    buildRiftPoly(scene, x, y, totalWidth, totalHeight, factor) {
        var moveBy = (totalWidth / factor);
        var startCoord = new Phaser.Geom.Point(x - moveBy, y + (totalHeight / 2));
        var endCoord = new Phaser.Geom.Point(x + totalWidth + moveBy, y + (totalHeight / 2));

        var coords = [startCoord];

        /* build coordinates around the rift */
        for (var i = x, j = 0; j <= (factor * 2); j++) {
            var upper = new Phaser.Geom.Point(i, y - 10);
            var lower = new Phaser.Geom.Point(i, y + totalHeight + 10);


            if (j < factor) {
                coords.push(upper);
                i += moveBy;
            } else if (j == factor) {
                i += moveBy;
                coords.push(upper, endCoord, lower);
                i -= moveBy * 2;
            } else {
                i -= moveBy;
                coords.push(lower);
            }
        }

        var riftPoly = new Phaser.GameObjects.Polygon(scene, (totalWidth / 2) + 20, totalHeight / 2, coords, 0xff0000);

        riftPoly.geom.getRandomPoint = function (vec) {
            var pt = riftPoly.geom.points[Phaser.Math.Between(0, riftPoly.geom.points.length - 1)];
            vec.x = pt.x;
            vec.y = pt.y;
            return vec;
        }

        return riftPoly;
    }
}

class RiftZone extends Phaser.GameObjects.Zone {
    // Zone for capturing overlap events and dealing with them
    constructor(scene, x, y, width, height, acceptedType, id) {
        super(scene, x, y, width, height);

        // The type of block this rift accepts, e.g. 'int', 'float', 'string', ...
        this.acceptedType = acceptedType;

        //this.currentBlock;

        // ID indetifies the rift to know what action to choose from when connected with a input block
        this.id = id;

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, 0);

        this.body.setAllowGravity(false);
    }

    overlapCallback(inputBlock) {
        if (this.acceptedType == inputBlock.blockType) {
            // accept the block!
            if (inputBlock.caughtInRift == false && inputBlock.rejectDelay < 0) {
                this.body.checkCollision.none = true; // disables from accepting multiples
                //this.currentBlock = inputBlock;
            }
            else {
                // reject the block!
            }
        }
    }

    preUpdate() { }
}

class RiftText extends Phaser.GameObjects.Text {
    // Basic text for the Rift 
    constructor(scene, x, y, text) {
        super(scene, x, y, text);

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);

    }

    preUpdate() { }
}

