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
            default:
                tempfn = () => RiftActionManager.fnundefined();
                return tempfn;
        }
    }

    static fnundefined() { }

    static fn1112() {
        RiftActionManager.scene.levelData.input.jumpKey = "SPACE";
    }

    static invfn1112() {
        RiftActionManager.scene.levelData.input.jumpKey = "";
    }

    static fn2121() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static invfn2121() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }
}