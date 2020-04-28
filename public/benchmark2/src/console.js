/** @type {import("../../typings/phaser")} */

class Console extends Phaser.Scene{
    // console prompt text
    prompt = "Type Command:";

    // current text in console
    input;

    // console text object
    console;

    // process keyboar input
    processInput(event) {
        // toggle visability
        if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ESC)
            this.console.setVisible(!this.console.visible);
    }

    preload() {
    }

    create() {
        // add the text to the scene
        this.console = this.add.text(0, 0, this.prompt, { fill: '#ffffff' })
            .setFontSize(26)
            .setVisible(false);
        // setup keyboard input
        this.input.keyboard.on('keyup', (event) => this.processInput(event));
    }

    update() {
        // // check if we need to render and if we do bring scene to top
        // if (this.visible)
        //     this.scene.bringToTop();
    }
}