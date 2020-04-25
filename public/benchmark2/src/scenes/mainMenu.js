/** @type {import("../../typings/phaser")} */

class MainMenu extends Phaser.Scene {
    playButton;

    constructor(handle, parent) {
        super(handle);
    }

    playerClickHandler() {
        // transition to level select
        console.log('Transitioning to level select');
        console.log(this.scene.manager.scenes);
        this.scene.start('LoadingScene');
    }

    preload() {

    }

    create() {
        // set up play button
        this.playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "PLAY", { fill: '#ffffff' })
        .setInteractive({ 'useHandCursor': true })
        .on('pointerdown', () => this.playerClickHandler());
    }

    update() {

    }
}