/** @type {import("../../typings/phaser")} */

class RiftActionManager {
    /*  Manages rift inputs mapping functions to riftInputID's
    */

    static scene; //LevelScene 

    static getFunctionForID(riftID, inputID) {

        var connectionID = riftID + inputID;

        var tempfn;
        switch (connectionID) {
            case "1111":
                tempfn = () => RiftActionManager.fn1112();
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



}