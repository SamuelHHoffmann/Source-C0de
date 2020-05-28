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
        this.scene = scene; // don't know why i didn't do this earlier
        this.rifts = [];
        this.riftZones = scene.physics.add.group([]);
        this.riftInputBlocks = scene.physics.add.group([]);

        /* rift audio*/
        //this.riftHum = this.scene.sound.add("riftHum");


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

        this.riftPointPop(scene, rift);
        /*
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
        */

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
        if(rift.riftZone != null) {
            this.riftZones.add(rift.riftZone);
        }

        this.riftFadeEffect(scene, [rift.riftPoly.geom, rift.codeText], "in");
        this.riftGravityWell(x, y, rift, true);
        

        var thing2 = this;
        setTimeout(function() {
            thing2.riftGravityWell(x, y, rift, false);
        }, 4000);
    }

    createNewRiftInput(scene, x, y, inputText, inputType, id) {
        var riftInput = new RiftInputBlock(scene, x, y, inputText, inputType, id);
        riftInput.setDepth(this.riftGraphics.depth + 1);
        riftInput.setColor('#37a8df');

        this.riftInputBlocks.add(riftInput);
    }

    removeRift(id) {
        for (var x = 0; x < this.rifts.length; x++) {
            var tempRift = this.rifts.pop();
            if (tempRift.riftZone.id == id) {
                //this.riftPointUnpop(this.scene, tempRift);
                //this.riftGravityWell(tempRift.codeText.x + tempRift.totalWidth/2, tempRift.codeText.y + tempRift.totalHeight/2, tempRift, true);

                tempRift.riftZone.destroy();
                tempRift.riftPoly.setAlpha(0);
                tempRift.codeText.destroy();
                tempRift.riftEmitter.remove();

            } else {
                this.rifts.push(tempRift);
            }
        }
    }

    removeRiftInput(id) {
        for (var x = 0; x < this.riftInputBlocks.children.entries.length; x++) {
            var inputBlock = this.riftInputBlocks.children.entries.pop();
            if (inputBlock.id == id) {
                inputBlock.setAlpha(0);
                break;
            } else {
                this.riftInputBlocks.children.entries.push(inputBlock);
            }
        }
    }

    riftPointMotion(scene, rift) {
        scene.tweens.add({
            targets: rift.riftPoly.geom.points.slice(rift.factor + 3, rift.riftPoly.geom.points.length),
            duration: function () {
                return Phaser.Math.Between(500, 5000);
            },
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            y: function (target) {
                return target.y + Phaser.Math.Between(rift.totalHeight, rift.totalHeight + 25);
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
            y: function (target) {
                return target.y + Phaser.Math.Between(0, -25);
            }
        });
    }

    riftPointUnpop(scene, rift) {
        scene.tweens.add({
            targets: rift.riftPoly.geom.points,
            duration: function() {
                return Phaser.Math.Between(500, 3000);
            },
            ease: 'Sine.easeIn',
            y: {
                from: function(target) {
                    return target.y;
                },
                to: rift.codeText.y + rift.totalHeight/2
            },
            x: {
                from: function(target) {
                    return target.x;
                },
                to: rift.codeText.x + rift.totalWidth/2
                
            }
        });
    }

    riftPointPop(scene, rift) {
        var that = this;
        scene.tweens.add({
            targets: rift.riftPoly.geom.points,
            duration: function() {
                return Phaser.Math.Between(500, 3000);
            },
            ease: 'Sine.easeIn',
            y: {
                from: rift.codeText.y + rift.totalHeight/2,
                to: function(target) {
                    return target.y;
                }
            },
            x: {
                from: rift.codeText.x + rift.totalWidth/2,
                to: function(target) {
                    return target.x;
                }
            },
            onComplete: function() {
                that.riftPointMotion(scene, rift);
            }
        });
    }

    riftFadeEffect(scene, target, inOut) {
        if (inOut == "out") {
            // fade in
            scene.tweens.add({
                targets: target,
                duration: 3000,
                alpha: 0.0
            });
        } else {
            scene.tweens.add({
                targets: target,
                duration: 3000,
                alpha: {
                    from: 0,
                    to: 1
                }
            })
        }
    }

    riftGravityWell(x, y, rift, active) {
        if(rift.well == null || rift.well == undefined) {
            rift.well = this.riftParticles.createGravityWell({
                x: x + (rift.totalWidth/2),
                y: y + (rift.totalHeight/2),
                power: 10,
                epsilon: 100,
                gravity: 10,
            });

            rift.well.active = active;

        } else {
            rift.well.x = x;
            rift.well.y = y;
            rift.well.active = active;
        }
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
                    if (player.gravity < 0) {
                        player.pickedUp.x = player.x - (player.pickedUp.width / 2);
                        player.pickedUp.y = player.y + (player.height / 2) - (player.pickedUp.height / 4);
                    }
                    else {
                        player.pickedUp.x = player.x - (player.pickedUp.width / 2);
                        player.pickedUp.y = player.y - (player.height / 2) - (player.pickedUp.height / 4);
                    }
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

            this.caughtInRift = true;

            if (this.blockType == rift.acceptedType) { // rift accepts
                this.setColor('black');
                var callabckFn = RiftActionManager.getFunctionForID(rift.id, this.id);
                RiftActionManager.idStack.push((rift.id + this.id));

                this.body.x = rift.x - (rift.body.width / 2);
                this.body.y = rift.y - (rift.body.height / 2);
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

            this.setColor('#37a8df');

            this.caughtInRift = true;
        }
    }

    yeetCallback() {
        this.setColor('#37a8df');
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
        this.codeText = new RiftText(scene, x, y, codeText);

        if(acceptedType != "none") {
            /* rift objects */
            this.riftZone = new RiftZone(scene,
                x + this.codeText.width + zoneWidth / 2,
                y + this.codeText.height / 2,
                zoneWidth,
                zoneHeight,
                acceptedType,
                id
            );
        } else {
            this.riftZone = null;
            zoneWidth -= 100;
        }

        this.totalHeight = zoneHeight;
        this.totalWidth = zoneWidth + this.codeText.width;

        this.factor = Math.ceil(this.totalWidth / 30);
        this.riftPoly = this.buildRiftPoly(scene, x, y, this.totalWidth, this.totalHeight, this.factor);

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

        var riftPoly = new Phaser.GameObjects.Polygon(scene, (totalWidth / 2), totalHeight / 2, coords, 0xff0000);

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

class WorldGlitchPipe extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    static time = 0;
    constructor(game)
    {
        var config = {
            game: game,
            renderer: game.renderer,
            fragShader:
            `
                #ifdef GL_ES
                precision mediump float;
                #endif
    
                precision mediump float;
                uniform float     time;
                uniform vec2      resolution;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;

                void main( void ) {,
                    vec2 uv = outTexCoord;
                    uv.x += sin((uv.y + time) * 100.0) + sin((uv.y + time) * 100.0);
                    vec4 texColor = texture2D(uMainSampler, uv);
                    gl_FragColor = texColor;
                }
            `
        };
        super(config);

    }

    static create(scene) {
        scene.glitchPipe = this.game.renderer.addPipeline('Glitch', new WorldGlitchPipe(scene.game));
        scene.glitchPipe.setFloat2('resolution', scene.game.config.width, scene.game.config.height);
    }

    static apply(scene) {
        scene.cameras.main.setRenderToTexture(scene.glitchPipe);
    }

    static remove(scene) {
        scene.cameras.main.clearRenderToTexture();
    }

    static glitch(scene, time) {
        WorldGlitchPipe.apply(scene);

        setTimeout(function() {
            WorldGlitchPipe.remove(scene);
        }, time); 
    }

    static update(scene) {
        scene.glitchPipe.setFloat1('time', WorldGlitchPipe.time);
        WorldGlitchPipe.time += 0.005; 
    }
}


