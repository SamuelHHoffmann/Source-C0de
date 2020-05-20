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
            var restoreFunction = this.getFunctionForID(restoreID, "");
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
            case "4141":
                tempfn = () => RiftActionManager.fn4141();
                return tempfn;
            case "5151":
                tempfn = () => RiftActionManager.fn5151();
                return tempfn;
            case "5252":
                tempfn = () => RiftActionManager.fn5252();
                return tempfn;
            case "6161":
                tempfn = () => RiftActionManager.fn6161();
                return tempfn;
            case "6262":
                tempfn = () => RiftActionManager.fn6262();
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
            case "8181":
                tempfn = () => RiftActionManager.fn8181();
                return tempfn;
            case "101101":
                tempfn = () => RiftActionManager.fn101101();
                return tempfn;
            case "102102":
                tempfn = () => RiftActionManager.fn102102();
                return tempfn;
            case "103104":
                tempfn = () => RiftActionManager.fn103104();
            case "9191":
                tempfn = () => RiftActionManager.fn9191();
                return tempfn;
            case "9292":
                tempfn = () => RiftActionManager.fn9292();
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
            case "6161":
                tempfn = () => RiftActionManager.invfn6161();
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
            case "8181":
                tempfn = () => RiftActionManager.invfn8181();
                return tempfn;
            case "9191":
                tempfn = () => RiftActionManager.invfn9191();
                return tempfn;
            case "9292":
                tempfn = () => RiftActionManager.invfn9292();
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

    // Level 3
    // No rifts :(

    // Level 4
    static fn4141() {
        //no inverse
        RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
        RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
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
    static fn6161() {
        RiftActionManager.scene.levelData.input.throwStrength = 300;
    }

    static invfn6161() {
        RiftActionManager.scene.levelData.input.throwStrength = 1000;
    }

    // no inverse
    static fn6262() {
        RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
        RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
    }

    // Level 7

    static fn7172() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static fn7174() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static fn7271() {
        //no inverse
        RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
        RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
    }

    static fn7373() {
        //no inverse
        RiftActionManager.scene.reDrawLayer = true;
    }

    static fn7472() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }

    static fn7474() {
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
    static fn8181() {
        RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
        RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);

        // change drag on player
        RiftActionManager.scene.levelData.input.drag = 0.0;
    }

    static invfn8181() {
        RiftActionManager.scene.levelData.input.drag = 0.85;
    }

    // Level 9

    static fn9191() {
        RiftActionManager.scene.levelData.input.downKey = "S";
    }

    static inv9191() {
        RiftActionManager.scene.levelData.input.downKey = "";
    }

    static fn9292() {
        RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
        RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);

        // change drag on player
        RiftActionManager.scene.levelData.input.drag = 0.85;
    }

    static invfn9292() {
        RiftActionManager.scene.levelData.input.drag = 0.0;
    }


    // Level 10

    static fn101101() {
        try {
            RiftActionManager.scene.invRift1Layer.setAlpha(0);
            RiftActionManager.scene.invRift1Layer.setCollisionBetween(0, 5, false, true);
        } catch{ }
    }

    static fn102102() {
        try {
            RiftActionManager.scene.invRift2Layer.setAlpha(0);
            RiftActionManager.scene.invRift2Layer.setCollisionBetween(0, 5, false, true);
        } catch{ }
    }

    static fn103104() {
        RiftActionManager.scene.invRift1Layer = RiftActionManager.scene.map.createDynamicLayer("invRift1", RiftActionManager.scene.tileset, 0, 0).setDepth(19).setCollisionBetween(0, 5);
        RiftActionManager.scene.invRift1Colider = RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.invRift1Layer);
        RiftActionManager.scene.invRift2Layer = RiftActionManager.scene.map.createDynamicLayer("invRift2", RiftActionManager.scene.tileset, 0, 0).setDepth(19).setCollisionBetween(0, 5);
        RiftActionManager.scene.invRift2Colider = RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.invRift1Layer);
    }


}