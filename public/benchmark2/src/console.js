/** @type {import("../../typings/phaser")} */

class Console extends Phaser.Scene{
    // console prompt text
    prompt = "Type Command:";

    // current text in console
    userInput = '';

    // console text object
    console;

    // process keyboar input
    processInput(event) {
        // toggle visability
        if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ESC)
            this.console.setVisible(!this.console.visible);

        else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ENTER) {
            // process cmd and update console text
            this.checkCommand(this.userInput);
            this.userInput = '';
            this.console.setText(this.prompt + this.userInput);
        }
        else if(event.keyCode == Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
            // delete last key typed and update console
            if (this.userInput.length != 0) {
                this.userInput = this.userInput.substr(0, this.userInput.length-1);
                this.console.setText(this.prompt + this.userInput);
            }
        }
        else {
            if (event.keyCode != Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                // append to current input text and update console
                this.userInput += event.key;
                this.console.setText(this.prompt + this.userInput);
            }
        }
    }

    checkCommand(cmdString) {
        var cmdParts = cmdString.split(' ');

        // if we don't have at least two parts of cmd do nothing
        if (cmdParts.length  < 2)
            return;
        // process rest of cmds accordingly
        switch (cmdParts[0].toLowerCase()) {
            case 'load':
                this.processLevelSwitch(cmdParts[1]);
                break;
            default:
                return;
        }
    }

    processLevelSwitch(level) {
        // find the scene we are currently in
        var currentScenes = this.scene.manager.getScenes(true, false);
        console.log(currentScenes);
        this.scene.manager.switch(currentScenes[0], level);
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