/** @type {import("../../typings/phaser")} */

class Console extends Phaser.Scene {
    // console prompt text
    prompt = "Type Command:";

    // current text in console
    userInput = '';

    // console stack info
    CMDStack = [];
    tempStack = [];
    maxHist = 5;

    xyText;
    xposition;
    yposition;
    freezePositionUpdate = false;

    // console text object
    console;

    // level data
    levelData;

    // restore stack hist
    restoreHist() {
        // restore history
        this.tempStack.reverse().forEach((e) => this.CMDStack.push(e));
        this.tempStack = [];
    }

    // process keyboar input
    processInput(event) {
        // toggle visability
        if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ESC) {
            this.console.setVisible(!this.console.visible);
        }
        else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ENTER) {
            // process cmd and update console text and last CMD
            this.checkCommand(this.userInput);

            // set visibility to false
            this.console.setVisible(false);

            // restore cmd history
            this.restoreHist();

            // make sure we don't push too much
            var startIndex = Math.max(0, this.CMDStack.length - this.maxHist + 1);
            this.CMDStack = this.CMDStack.slice(startIndex);

            this.CMDStack.push(this.userInput);
            this.userInput = '';
            this.console.setText(this.prompt + this.userInput);
        }
        else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
            // delete last key typed and update console
            if (this.userInput.length != 0) {
                this.userInput = this.userInput.substr(0, this.userInput.length - 1);
                this.console.setText(this.prompt + this.userInput);
            }
        }
        else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.UP) {
            // load last command into input and update console
            if (this.CMDStack.length != 0) {
                this.userInput = this.CMDStack.pop();
                this.tempStack.push(this.userInput);
                this.console.setText(this.prompt + this.userInput);
            }
        }
        else {
            if (this.console.visible & event.keyCode != Phaser.Input.Keyboard.KeyCodes.SHIFT) {
                // append to current input text and update console
                this.userInput += event.key;
                this.console.setText(this.prompt + this.userInput);
            }
        }
    }

    checkCommand(cmdString) {
        var cmdParts = cmdString.split(' ');

        // process rest of cmds accordingly
        switch (cmdParts[0].toLowerCase()) {
            case 'load':
                this.processSceneSwitch(cmdParts[1]);
                break;
            case 'vol':
                this.changeVolume(cmdParts[1]);
                break;
            case 'level':
                this.processLevelSwitch(cmdParts[1]);
                break;
            case 'restart':
                this.restartLevel();
                break;
            case 'debug':
                this.setDebugMode();
                break;
            case 'gravity':
                this.changeGravity(cmdParts[1]);
                break;
            case 'spawn':
                this.spawnBoss(cmdParts);
                break;
            case 'kill':
                this.vanishBoss(cmdParts);
                break;
            case 'unlock':
                this.unlockLevel(cmdParts[1]);
                break;
            default:
                return;
        }
    }

    unlockLevel(toUnlock) {
        // get LevelSelect scene
        var levelSelect = this.scene.manager.getScene('LevelSelect');
        console.log(levelSelect);

        if (toUnlock == 'all') {
            console.log(levelSelect.LockedLevelData);
            levelSelect.LockedLevelData.forEach((element, index) => {
                levelSelect.LockedLevelData[index] = 1;
            });
        }

        else {
            if (this.levelData.levelCount >= toUnlock & toUnlock > 0)
                levelSelect.LockedLevelData[toUnlock-1] = 1;
        }

        levelSelect.unlock();
    }

    spawnBoss(cmds) {
        var x = parseInt(cmds[1]);
        var y = parseInt(cmds[2]);
        
        this.scene.manager.getScene('LevelScene').boss = new Boss(this.scene.manager.getScene('LevelScene'), this.scene.manager.getScene('LevelScene').riftManager);
        this.scene.manager.getScene('LevelScene').boss.spawnBoss(x, y);
    }

    vanishBoss(cmds) {
        var x = parseInt(cmds[1]);
        var y = parseInt(cmds[2]);
        this.scene.manager.getScene('LevelScene').boss.despawnBoss(x, y);
    }

    changeGravity(val) {
        this.scene.manager.getScene('LevelScene').levelData.input.gravity = val;
    }

    setDebugMode() {
        var debugGraphic = this.scene.manager.getScene('LevelScene').physics.world.debugGraphic;

        // draw debug
        if (debugGraphic == undefined) {
            debugGraphic = this.scene.manager.getScene('LevelScene').physics.world.createDebugGraphic();
            this.xyText.setVisible(true);
            // toggle visibility
        } else {
            debugGraphic.setVisible(!debugGraphic.visible);
            this.xyText.setVisible(false);
        }
    }

    restartLevel() {
        // redraw level scene
        this.scene.manager.getScene('LevelScene').reDrawLayer = true;
    }

    processSceneSwitch(level) {
        // find the scene we are currently in
        var currentScenes = this.scene.manager.getScenes(true, false);
        this.scene.manager.switch(currentScenes[1], level);
    }

    processLevelSwitch(number) {
        // find the scene we are currently in
        var currentScenes = this.scene.manager.getScenes(true, false);

        // check if level exists
        if (this.levelData.levelCount >= number & number > 0) {
            this.scene.manager.getScene('LevelScene').setLevelNumber(parseInt(number));
            //RiftActionManager.popLevel(this.scene.manager.getScene('LevelScene').levelNumber);
            this.scene.manager.getScene('LevelScene').reDrawLayer = true;
            this.scene.manager.switch(currentScenes[1], 'LevelScene');
        }
        else
            console.error('Level ' + number + ' is an invalid level.');
    }

    changeVolume(vol) {
        this.sound.volume = vol;
    }

    preload() {
        this.load.text('levelData', 'resources/data/levelData.json');
    }

    create() {
        // load level data
        this.levelData = JSON.parse(this.cache.text.get('levelData'));

        // add the text to the scene
        this.console = this.add.text(0, 0, this.prompt, { fill: '#ffffff' })
            .setFontSize(26)
            .setVisible(false);
        // setup keyboard input
        this.input.keyboard.on('keydown', (event) => this.processInput(event));

        this.xyText = this.add.text(0, 50, "X, Y: 0, 0", { fill: '#ffffff' })
            .setFontSize(18)
            .setVisible(false);

    }

    update() {

        if (this.freezePositionUpdate != undefined) {

            if ((this.input.mousePointer.worldX != this.xposition || this.input.mousePointer.worldY != this.yposition) && !this.freezePositionUpdate) {
                this.xyText.text = "X, Y: " + this.input.mousePointer.worldX.toFixed(2) + ", " + this.input.mousePointer.worldY.toFixed(2);
                this.xposition = this.input.mousePointer.worldX.to;
                this.yposition = this.input.mousePointer.worldY;
            }

            if (this.input.mousePointer.isDown) {
                if (this.freezePositionUpdate) {
                    this.freezePositionUpdate = false;
                } else {
                    this.freezePositionUpdate = true;
                    this.xyText.text = "X, Y: " + this.input.mousePointer.downX.toFixed(2) + ", " + this.input.mousePointer.downY.toFixed(2);
                    this.xposition = this.input.mousePointer.downX;
                    this.yposition = this.input.mousePointer.downY;
                }
                console.log(this.input.mousePointer.downX.toFixed(2), this.input.mousePointer.downY.toFixed(2));
            }
        }


    }
}