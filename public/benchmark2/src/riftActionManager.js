/** @type {import("../../typings/phaser")} */

class RiftActionManager {
    /*  Manages rift inputs mapping functions to riftInputID's
    */

    static scene; //LevelScene 

    static idStack = [];

    static restoreIDStack = [];

    static quitIDStack = []

    static reverseToLevel(levelNumber) {
        var len = this.idStack.length;
        for (var x = 0; x < len; x++) {
            var id = "" + this.idStack.pop();
            if (parseInt(id.charAt(0)) > levelNumber) {
                var reverseFunction = this.getInverseFunctionForID(id, "");
                reverseFunction();
                this.restoreIDStack.push(id);
            } else if (parseInt(id.charAt(0)) == levelNumber) {
                this.quitIDStack.push(id);
                var reverseFunction = this.getInverseFunctionForID(id, "");
                reverseFunction();
            } else {
                this.idStack.push(id);
                break;
                // ignore if actions are before this level. (like if you did level 1,2 ,3 4 and then went back and did level 2 you should leave whatever you did for level 1)
            }
        }
    }

    static restoreStack(didQuit) {
        if (didQuit) {
            for (var x = 0; x < this.quitIDStack.length; x++) {
                var quitID = this.quitIDStack.pop();
                var quitFnAction = this.getFunctionForID(quitID, "");
                quitFnAction();
                this.idStack.push(quitID);
            }
        }
        for (var x = 0; x < this.restoreIDStack.length; x++) {
            var restoreID = this.restoreIDStack.pop();
            restoreFunction = this.getFunctionForID(restoreID, "");
            restoreFunction();
            this.idStack.push(restoreID);
        }
    }

    static getFunctionForID(riftID, inputID) {
        var connectionID = riftID + inputID;
        var tempfn;
        switch (connectionID) {
            case "1111":
                tempfn = () => RiftActionManager.fn1112();
                return tempfn;
            case "2121":
                tempfn = () => RiftActionManager.fn2121();
                return tempfn;
            case "5151":
                tempfn = () => RiftActionManager.fn5151();
                return tempfn;
            case "5252":
                tempfn = () => RiftActionManager.fn5252();
                return tempfn;
            case "7172":
                tempfn = () => RiftActionManager.fn7172();
                return tempfn;
            case "7174":
                tempfn = () => RiftActionManager.fn7174();
                return tempfn;
            case "7271":
                tempfn = () => RiftActionManager.fn7271();
                return tempfn;
            case "7373":
                tempfn = () => RiftActionManager.fn7373();
                return tempfn;
            case "7472":
                tempfn = () => RiftActionManager.fn7472();
                return tempfn;
            case "7474":
                tempfn = () => RiftActionManager.fn7474();
                return tempfn;
            default:
                tempfn = () => RiftActionManager.fnundefined();
                return tempfn;
        }
    }

    static getInverseFunctionForID(riftID, inputID) {
        var connectionID = riftID + inputID;
        var tempfn;
        switch (connectionID) {
            case "1111":
                tempfn = () => RiftActionManager.invfn1112();
                return tempfn;
            case "2121":
                tempfn = () => RiftActionManager.invfn2121();
                return tempfn;
            case "5151":
                tempfn = () => RiftActionManager.invfn5151();
                return tempfn;
            case "5252":
                tempfn = () => RiftActionManager.invfn5252();
                return tempfn;
            case "7172":
                tempfn = () => RiftActionManager.invfn7172();
                return tempfn;
            case "7174":
                tempfn = () => RiftActionManager.invfn7174();
                return tempfn;
            case "7472":
                tempfn = () => RiftActionManager.invfn7472();
                return tempfn;
            case "7474":
                tempfn = () => RiftActionManager.invfn7474();
                return tempfn;
            default:
                tempfn = () => RiftActionManager.fnundefined();
                return tempfn;
        }
    }

    static fnundefined() { }


    // Level 1

    static fn1112() {
        RiftActionManager.scene.levelData.input.jumpKey = "SPACE";
    }

    static invfn1112() {
        RiftActionManager.scene.levelData.input.jumpKey = "";
    }

    // Level 2

    static fn2121() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static invfn2121() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    // Level 5

    static fn5151() {
        RiftActionManager.scene.levelData.input.throwStrength = 1000;
    }

    static invfn5151() {
        RiftActionManager.scene.levelData.input.throwStrength = 300;
    }

    static fn5252() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static invfn5252() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    // Level 6


    // Level 7

    static fn7172() {//
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static fn7174() {//
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static fn7271() {//
        //appear platform
        //no inverse
        RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
        RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
    }

    static fn7373() {//
        //restart Level
        //no inverse
        RiftActionManager.scene.reDrawLayer = true;
    }

    static fn7472() {//
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static fn7474() {//
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static invfn7172() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static invfn7174() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static invfn7472() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static invfn7474() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    // Level 8


}