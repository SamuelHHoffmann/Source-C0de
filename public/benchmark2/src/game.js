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
    }
};

var game = new Phaser.Game(config);

// add all scenes to game
this.game.scene.add('MainMenu', MainMenu);
this.game.scene.add('LoadingScene', LoadingScene);
this.game.scene.start('MainMenu');