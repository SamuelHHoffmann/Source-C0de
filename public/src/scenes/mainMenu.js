/** @type {import("../../typings/phaser")} */

class MainMenu extends Phaser.Scene {
    // variables for buttons
    playButton;
    settingsButton;
    aboutButton;

    // background logo
    logoIMG;

    // audio
    backgroundMusic;

    // offsets
    spaceOff = 50;
    topOff = this.spaceOff;
    centerOriginOff = .5;

    // static text
    title;

    constructor(handle, parent) {
        super(handle);
    }

    riftAnimation() {
        this.riftPoints = [];
        this.riftParticles = this.add.particles('riftParticles');
        this.riftParticles.visible = false;
        this.riftParticles.setDepth(0);

        this.riftBackground = this.add.image(400, 300, "maskedImg");
        this.riftBackground.setAlpha(0.8)

        this.riftBackground.setMask(new Phaser.Display.Masks.BitmapMask(this, this.riftParticles));

        for(var i = 0, x = 125; i < 20; i++, x += 30) {
            this.riftPoints[i] = new Phaser.Geom.Point(x, 230+Phaser.Math.Between(-50, 50));
        }

        var that = this;
        this.riftPoints.getRandomPoint = function (vec) {
            var pt = that.riftPoints[Phaser.Math.Between(0, that.riftPoints.length - 1)];
            vec.x = pt.x;
            vec.y = pt.y;
            return vec;
        }
        
        this.riftEmitter = this.riftParticles.createEmitter({
            lifespan: 2000,
            speedY: { min: -50, max: 50 },
            speedX: { min: -10, max: 10 },
            scaleX: { start: 0.5, end: 0 },
            scaleY: { start: 2.5, end: 0 },
            emitZone: {
                type: 'random',
                source: this.riftPoints,
            },
            rotate: {
                onEmit: function () {
                    var rots = [0, 45, 135];
                    return rots[Phaser.Math.Between(0, rots.length - 1)];
                }
            },
            quantity: 2
        });  
    }

    playClickHandler() {
        // transition to level select
        this.scene.switch('LevelSelect');

        // play sound
        this.sound.play('clickSound');
    }

    settingsClickHandler() {
        // transition to settings menu
        this.scene.switch('SettingsMenu');

        // play sound
        this.sound.play('clickSound');
    }

    aboutClickHandler() {
        // transition to about menu
        this.scene.switch('AboutMenu');

        // play sound
        this.sound.play('clickSound');
    }

    buttonHovered(button) {
        // handles any button being hovered
        button.setColor('#37A8DF');
        button.setScale(1.2);

        // play sound
        this.sound.play('hoverSound');
    }

    buttonHoverExit(button) {
        // handles any button no longer being hovered
        button.setColor('#ffffff');
        button.setScale(1);
    }

    preload() {
        this.load.image('logo', 'resources/images/logo_noeffect.png');
        this.load.image("riftParticles", "resources/images/riftParticle.png");
        this.load.image("maskedImg", "resources/images/maskedEffect.png");
    }

    create() {
        // start playing music
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.backgroundMusic.play({loop: true});

        // get camera center x and y
        var cameraCenterX = this.cameras.main.centerX;
        var cameraCenterY = this.cameras.main.centerY;

        this.riftAnimation();

        // add title image
        this.logoIMG = this.add.image(cameraCenterX, cameraCenterY - (this.cameras.main.height / 8), 'logo')
            .setScale(0.2)
            .setDepth(0);

        // set up play button
        this.playButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff, "PLAY", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.playClickHandler())
            .on('pointerover', () => this.buttonHovered(this.playButton))
            .on('pointerout', () => this.buttonHoverExit(this.playButton))
            .setDepth(1);

        // set up settings button
        this.settingsButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + this.spaceOff, "SETTINGS", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.settingsClickHandler())
            .on('pointerover', () => this.buttonHovered(this.settingsButton))
            .on('pointerout', () => this.buttonHoverExit(this.settingsButton))
            .setDepth(1);

        // set up about button
        this.aboutButton = this.add.text(cameraCenterX, cameraCenterY + (this.cameras.main.height / 4) - (this.cameras.main.height / 8) - this.topOff + (this.spaceOff * 2), "ABOUT", { fill: '#ffffff' })
            .setOrigin(this.centerOriginOff)
            .setInteractive({ 'useHandCursor': true })
            .on('pointerdown', () => this.aboutClickHandler())
            .on('pointerover', () => this.buttonHovered(this.aboutButton))
            .on('pointerout', () => this.buttonHoverExit(this.aboutButton))
            .setDepth(1);

       
    }

    update() {
    }
}