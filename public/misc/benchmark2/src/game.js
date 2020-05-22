/** @type {import("../typings/phaser)} */

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {
    // load all audio used in multiple scenes here
    this.load.audio('backgroundMusic', 'resources/audio/music/NortsTheme.mp3');
    this.load.audio('hoverSound', 'resources/audio/soundEffects/hover.mp3');
    this.load.audio('clickSound', 'resources/audio/soundEffects/click.mp3');
}

function create() {
    // add necessary sounds
    this.sound.add('hoverSound');

    // add all scenes to game
    this.game.scene.add('MainMenu', MainMenu);
    this.game.scene.add('PauseScene', PauseScene);
    this.game.scene.add('LevelScene', LevelScene);
    this.game.scene.add('AboutMenu', AboutMenu);
    this.game.scene.add('SettingsMenu', SettingsMenu);
    this.game.scene.add('LevelSelect', LevelSelect);
    this.game.scene.add('Console', Console);
    //this.game.scene.add('EffectsTest', EffectsTest);

    // make sure console is on top and start both main menu and console scene
    this.game.scene.start('Console').bringToTop();
    this.game.scene.start('MainMenu');
}