/*
    Home of the Rift class and its members, the RiftInputBlock class,
    and rift effect pipelines/shaders.
*/

class RiftManager {
    /*  Manages rifts and inputs,
        constructor for this should be called in create() 
    */
    constructor(scene) {
        /* group objects contain all rifts and all riftinputs */
        this.rifts = [];
        this.riftZones = scene.physics.add.group([]);
        this.riftInputBlocks = scene.physics.add.group([]);

        /* current effects */
        this.riftEffects;

        /* allows for the throwing of objects */
        scene.input.on('pointerdown', function () {
            if (scene.player.pickedUp != null) {
                var angle = Phaser.Math.Angle.BetweenPoints(scene.player, scene.input);
                scene.physics.velocityFromRotation(angle, 300, scene.player.pickedUp.body.velocity);
                scene.player.pickedUp.yeetCallback();

                scene.player.pickedUp = null;
            }
        }, scene);
    }

    riftManagerTeardown(scene) {
        this.rifts = [];
        this.riftZones.clear(true, true);
        this.riftInputBlocks.clear(true, true);

        scene.physics.world.colliders.destroy();
        //scene.physics.world.overlaps.destroy();

    }

    riftManagerLevelLoad(scene) {

        /* allows for block-rift interaction */
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

    createNewRift(scene, x, y, codeText, acceptedType) {
        var rift = new Rift(scene, x, y, codeText, acceptedType);

        this.rifts.push(rift);
        console.log(this.rifts);
        this.riftZones.add(rift.riftZone);
    }

    createNewRiftInput(scene, x, y, inputText, inputType, fn) {
        var riftInput = new RiftInputBlock(scene, x, y, inputText, inputType, fn);

        this.riftInputBlocks.add(riftInput);
    }

    riftManagerUpdate(player) {
        if (player != null) {
            if (player.pickedUp != null) {
                player.pickedUp.x = player.x - player.width;
                player.pickedUp.y = player.y - 50;
            }
        }

        /* rifts reject blocks that aren't of the same type */

        /*
        var rzChildren = this.riftZones.getChildren();
        if(rzChildren != null) {
            for(let child of rzChildren) {
                child.wiggledRZ = false;
                if(child.currentBlock != null) {
                    if(child.acceptedType != child.currentBlock.blockType) {
                        if(child.wiggledRZ == false) {
                            child.prevWiggle = child.currentBlock.wiggle(2);
                            child.wiggledRZ = true;
                        }
                        else {
                            child.currentBlock.x -= child.prevWiggle[0];
                            child.currentBlock.y -= child.prevWiggle[1];
                            wiggledRZ = false;
                        }
                    }
                }
            }
        }*/

    }

}

class RiftInputBlock extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, type, fn) {
        super(scene, x, y, text);

        /* The type of this block, e.g. 'int', 'float', 'string', ... */
        this.blockType = type;
        this.connectedCallback = fn

        this.caughtInRift = false;

        /* Factory functions */
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, 0);

        this.body.setCollideWorldBounds(true);
        this.body.setFrictionX(1);
    }

    overlapCallback(rift) {
        if (this.caughtInRift == false) {
            if (this.blockType == rift.acceptedType) {
                this.body.setAllowGravity(false);
                this.body.setVelocity(0, 0);

                this.x = rift.x - (rift.width / 2);
                this.y = rift.y - (rift.height / 2);

                //rift.currentBlock = this;
                //callback (i think)
                this.connectedCallback();

                this.caughtInRift = true;

            }
        }
    }

    playerTouchCallback(player) {
        if (player.pickedUp == null && this.caughtInRift == false) {
            player.pickedUp = this;
            this.body.setAllowGravity(false);
            this.body.setVelocity(0, 0);

            this.caughtInRift = true;
        }
    }

    yeetCallback() {
        this.body.setAllowGravity(true);
        this.caughtInRift = false;
    }

    wiggle(factor) {
        var negative = Math.random() < 0.5 ? -1 : 1;
        var randX = Math.floor(Math.random() * factor) * negative;
        var randY = Math.floor(Math.random() * factor) * negative;

        this.x = this.x + randX;
        this.y = this.y + randY;

        /*
        if(randX == factor-1) {
            this.body.setVelocity(Math.floor(Math.random()*50) + 20, 
                                Math.floor(Math.random()*50) + 20);
            this.yeetCallback();
        }*/

        return [randX, randY];
    }

    preUpdate() { }
}

class Rift {
    /* 
        Rift class! Contains codeText, which is the code puzzle needing 
        to be solved, riftZone, which is there to help detect overlaps from
        riftinputblocks 
    */
    constructor(scene, x, y, codeText, acceptedType) {
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
            acceptedType
        );

        /* currently unused
        this.zoneText = new RiftText(scene, 
            this.riftZone.x - this.riftZone.width,
            this.riftZone.y - this.height / 2,
            ""
        );*/
    }
}

class RiftZone extends Phaser.GameObjects.Zone {
    /* Zone for capturing overlap events and dealing with them */
    constructor(scene, x, y, width, height, acceptedType) {
        super(scene, x, y, width, height);

        /* The type of block this rift accepts, e.g. 'int', 'float', 'string', ... */
        this.acceptedType = acceptedType;

        this.currentBlock;

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, 0);

        this.body.setAllowGravity(false);
    }

    overlapCallback(inputBlock) {
        if (this.acceptedType == inputBlock.blockType) {
            this.body.checkCollision.none = true;
            this.currentBlock = inputBlock;
        }
    }

    preUpdate() { }
}

class RiftText extends Phaser.GameObjects.Text {
    /* Basic text for the Rift */
    constructor(scene, x, y, text) {
        super(scene, x, y, text);

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
    }

    preUpdate() { }
}
