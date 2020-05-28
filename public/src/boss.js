// boss stuff!

/** @type {import("../../typings/phaser")} */

class BossPoint extends Phaser.Geom.Point {
    constructor (x, y, angle) {
        super(x, y);
        this.angle = angle;
    }
}

class Watchtower {
    constructor() {
        this.tower = null;
        this.spotlights = null;
    }
}

class BossBoss {
    // not another manager...
    // bosses the boss around
}

let BossBehaviors = {
    NAVIGATE_BETWEEN_POINTS_SET: 0,
    NAVIGATE_BETWEEN_RANDOM_POINTS: 1,
    WIGGLE_WILDLY: 2,
    PURSUE_PLAYER: 3,
    ENTER_SCENE: 4,
    EXIT_SCENE: 5,
    RIFT_ATTACK: 6,
    STUCK_FIX: 7,
    GOES_NOWHERE_DOES_NOTHING: 8
};

class Boss {

    constructor(scene, riftManager) {
        // displayed stuff
        this.scene = scene;
        this.boss = null;
        this.head = null;
        this.movePoints = null;
        this.moveDistance = 20;

        // ai stuff
        this.behavior = null;
        this.navigating = false;
        this.navPoints = null;

        // effects stuff
        this.riftManager = riftManager;
        this.particles = this.riftManager.riftParticles;
        this.unmasked = false;
        this.hitDelay = 0;
        
    }

    bossGravityWell(x, y, active) {
        if(this.well == null) {
            this.well = this.particles.createGravityWell({
                x: x,
                y: y,
                power: 10,
                epsilon: 100,
                gravity: 10,
            });

            this.well.active = active;

        } else {
            this.well.x = x;
            this.well.y = y;
            this.well.active = active;
        }
    }

    bossSpawnBody(x, y, segments) {

        this.boss = [this.scene.physics.add.sprite(x, y, "boss")];

        this.head = this.boss[0];
        this.head.setAlpha(0);
        this.head.body.setAllowGravity(false);
        if(!this.unmasked) { 
            this.head.anims.play("BOSS_HEAD_ARMOR_IDLE");
        } else {
            this.head.anims.play("BOSS_HEAD_BARE_IDLE");
        }
        this.head.setDepth(100);

        for (var i = 0; i < segments; i++) {    // create body segments
            var bodySprite = this.scene.physics.add.sprite(x, y, "boss");

            bodySprite.body.setAllowGravity(false);
            if(!this.unmasked) {
                bodySprite.anims.play("BOSS_BODY_ARMOR_IDLE");
            } else {
                bodySprite.anims.play("BOSS_BODY_BARE_IDLE");
            }
            bodySprite.setDepth(100);
            bodySprite.setAlpha(0);

            if(i > segments/3) {
                bodySprite.setScale(1.3 - i/segments, 1.3 - i/segments);
            }

            this.boss.push(bodySprite);
        }

        
        this.scene.physics.add.overlap(this.scene.player, this.boss, function(player, boss) {
            // player, boss hit callbacks
            if(boss.hitDelay > 0) {
                boss.hitDelay --;
            } else {
                //var tint = Phaser.Math.Between(0, 359);
                player.setTintFill(Phaser.Display.Color.HSVColorWheel()[270].color);

                if(boss.x > player.x) {
                    player.setVelocity(-1000, -100);
                } else {
                    player.setVelocity(1000, -100);
                }
                
                setTimeout(function() {
                    player.clearTint();
                }, 250);

                boss.hitDelay = 25;
            }
        });

        this.movePoints = [];
        this.moveDistance = 15;

        for(var i = 0; i < this.boss.length * this.moveDistance; i++) {
            this.movePoints.push(new BossPoint(x, y, 0));
        }

        this.unmasked = false;
        //this.bossLoseArmor(1000);
    }

    bossTearDown() {
        for(var i = 0; i<this.boss.length; i++) {
            this.boss[i].destroy();
        }
    }


    bossDelegateBehavior(x, y) {
        // manages behaviors, called on update.
        if(this.behavior == null) {
            this.behavior = BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET;
        }
        switch(this.behavior) {

            case BossBehaviors.GOES_NOWHERE_DOES_NOTHING:
                break;
            case BossBehaviors.NAVIGATE_BETWEEN_RANDOM_POINTS:
                this.behaviorNavBetweenRandomPoints();
                break;
            case BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET:
                this.behaviorNavBetweenSetPoints();
                break;
            default:
                break;  
        }
    }

    // ===== //\ EFFECTS \// ===== //

    bossFadeIn(delay) {
        for(var segment of this.boss) {
            this.segmentFade(segment, delay += 300, "in", this.scene);
        }
    }

    bossFadeOut(delay) {
        for(var segment of this.boss) {
            this.segmentFade(segment, delay += 300, "out", this.scene);
        }
    }

    bossLoseArmor(delay) {
        if(this.unmasked) {
            for(var segment of this.boss) {
                this.segmentLoseArmor(segment, delay += 500, this.boss);
            }
        }
    }

    
    segmentFade(segment, delay, inout, scene) {
        setTimeout(function() {
            if (inout == "out") {
                scene.tweens.add({
                    targets: segment,
                    duration: 250,
                    alpha: 0.0
                });
            } else {
                scene.tweens.add({
                    targets: segment,
                    duration: 250,
                    alpha: {
                        from: 0,
                        to: 1
                    }
                });    
            }
        }, delay);
    }

    segmentLoseArmor(segment, delay, boss) {
        setTimeout(function() {
            if(segment == boss[0]) {
                segment.anims.play("BOSS_HEAD_ARMOR_SHATTER");
            } else {
                segment.anims.play("BOSS_BODY_ARMOR_SHATTER");
            }
        }, delay);

        segment.on('animationcomplete', function () {
            if(segment == boss[0]) {
                segment.anims.play("BOSS_HEAD_BARE_IDLE");
            } else {
                segment.anims.play("BOSS_BODY_BARE_IDLE");
            }
        });
    }

    // ===== //\ BOSS MOVEMENT \// ===== //

    spawnBoss(x, y, segments, behavior) {
        this.behaviorEnterScene(x, y, behavior, segments);
    }

    despawnBoss(x, y) {
        this.behaviorExitScene(x, y, BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET);

        let that = this;
        setTimeout(function() {
            that.behavior = BossBehaviors.GOES_NOWHERE_DOES_NOTHING;
            that.bossTearDown();
        }, 15000); // disappears itself after 30 seconds..
    }

    bossMoveBody() {
        // locomotion, adapted from phaser 2 /examples/arcade physics/snake.js
        var v = this.scene.physics.velocityFromAngle(this.head.angle, 100);
        this.head.body.setVelocity(v.x, v.y);

        var p = this.movePoints.pop();
        p.x = this.head.x;
        p.y = this.head.y;
        p.angle = this.head.angle;

        this.movePoints.unshift(p);

        for(var i = 1; i < this.boss.length; i++) {
            this.boss[i].x = this.movePoints[i*this.moveDistance].x;
            this.boss[i].y = this.movePoints[i*this.moveDistance].y;
            this.boss[i].angle = this.movePoints[i*this.moveDistance].angle;
        }
    }

    bossNavToPoint(x, y) {
        // angle between boss head and destination coords
        var angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.head.x, this.head.y, x, y));

        if(angle > this.head.angle) {
            this.head.body.setAngularVelocity(100);
        } else {
            this.head.body.setAngularVelocity(-100);
        }
    }

    bossNearPoint(x, y) {
        //  boss being at exact coordinate unlikely, so this helps
        if ( ((this.head.x < x + 5) && (this.head.x > x - 5)) &&
             ((this.head.y < y + 5) && (this.head.y > y - 5)) ) {
            return true;
        }
        return false;
    }

    // ===== //\ UPDATE \// ===== //

    bossUpdate() {
        this.bossDelegateBehavior();
    }



    // ===== //\ BOSS BEHAVIORS \// ===== //

    behaviorEnterScene(x, y, next, segments) {
        if(this.navPoints == null) {
            this.generateRandomNavCoords(2, true, 100);
        }

        this.bossGravityWell(x, y, true);
        
        if(this.boss == null) {
            this.bossSpawnBody(x, y, segments);
            this.bossFadeIn(0);
        } else {
            this.navPoints.unshift(new Phaser.Geom.Point(x, y));
            this.behavior = BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET;

            var thing = this;
            this.head.on("reachedPoint", function() {
                thing.bossFadeIn(0);
            });
        }

        var thing2 = this;
        setTimeout(function() {
            thing2.bossGravityWell(x, y, false);
        }, 6000);

        this.behavior = next;
    }

    behaviorExitScene(x, y, next) {
        if(this.navPoints == null) {
            this.generateRandomNavCoords(2, true, 100);
        }

        this.bossGravityWell(x, y, true);

        this.navPoints.unshift(new Phaser.Geom.Point(x, y));
        this.behavior = BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET;

        var thing = this;

        this.head.on("reachedPoint", function() {
            thing.bossFadeOut(0);
        });

        setTimeout(function() {
            thing.bossGravityWell(x, y, false);
        });

        this.behavior = next;
    }

    behaviorNavBetweenRandomPoints() {
        this.bossNavigatePoints( true);
    }
    
    behaviorNavBetweenSetPoints() {
        if(this.navPoints == null) {
            this.generateRandomNavCoords(6, true, 100);
        }

        this.bossNavigatePoints(false);
    }

    // ===== //\ BOSS BEHAVIOR HELPERS \// ===== //

    inputNavCoords(navCoords) {
        this.navPoints = [];
        for(var coord of navCoords) {
            this.navPoints.push(new Phaser.Geom.Point(coord.x, coord.y));
        }
    }

    generateRandomNavCoords(totalCoords, forceNewCoords, distance) {
        var width = this.scene.cameras.main.centerX * 2;
        var height = this.scene.cameras.main.centerY * 2;

        if(this.navPoints == null || forceNewCoords == true) {
            this.navPoints = [new Phaser.Geom.Point(Phaser.Math.Between(distance, width - distance), Phaser.Math.Between(distance, height - distance))];
        }

        for(var i = 1; i < totalCoords; i++) {
            var nc = this.genNavCoord(width, height, this.navPoints[i-1], distance);
            this.navPoints.push(new Phaser.Geom.Point(nc.x, nc.y));
            console.log(nc);
        }
    }

    genNavCoord(width, height, prevPt, distance) {
        // can't be completely random or the boss enter a death spiral
        var xBounds1 = Phaser.Math.Between(prevPt.x + distance, width - distance);
        var xBounds2 = Phaser.Math.Between(distance, prevPt.x - distance);

        var yBounds1 = Phaser.Math.Between(prevPt.y + distance, height - distance);
        var yBounds2 = Phaser.Math.Between(distance, prevPt.y - distance);

        var xChoice = (Math.random() > 0.5 ? xBounds1 : xBounds2);  
        var yChoice = (Math.random() > 0.5 ? yBounds1 : yBounds2); 

        return {x: xChoice, y: yChoice};
    }

    bossNavigatePoints(random) {
        if (this.navPoints == null) {
            this.generateRandomNavCoords(6, true, 100);
        }

        this.navigating = this.bossNearPoint(this.navPoints[0].x, this.navPoints[0].y);

        if (!this.navigating) {
            // move the beast
            this.bossMoveBody();
            this.bossNavToPoint(this.navPoints[0].x, this.navPoints[0].y);
        } else {
            // stop the beast
            this.head.emit("reachedPoint");
            this.head.body.setVelocity(0, 0);
            this.head.body.setAngularVelocity(0);

            // update the beast's travel itinerary
            var starsMyDestination = this.navPoints[0];
            this.navPoints.shift();

            if (random == true) {
                var nc = this.genNavCoord((this.scene.cameras.main.centerX * 2), (this.scene.cameras.main.centerY * 2), this.navPoints[0], 100);
                this.navPoints.push(new Phaser.Geom.Point(nc.x, nc.y));
            } else {
                this.navPoints.push(starsMyDestination);
            }

            this.navigating = false;
            console.log(this.navPoints[0]);
        }
    }
}