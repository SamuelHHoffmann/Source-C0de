/** @type {import("../../typings/phaser")} */

class RiftActionManager {
    /*  Manages rift inputs mapping functions to riftInputID's
    */

    static scene; //LevelScene 

    static idStack = [];

    static restoreIDStack = [];

    static quitIDStack = []

    static levelStack = [];

    static fnHash = new Map([]);
    static invfnHash = new Map([]);

    static init() {
        console.log('Making Hash Map');
        console.log(this.fnHash);
        console.log(this.invfnHash)
        // hash all level function information

        // level 1
        this.fnHash.set(1, [() => RiftActionManager.fn1112()]);
        // level 2
        this.fnHash.set(2, [() => RiftActionManager.fn2121()]);
        // level 3
        this.fnHash.set(3, []);
        // level 4
        this.fnHash.set(4, []);
        // level 5
        this.fnHash.set(5, [() => RiftActionManager.fn5151(), () => RiftActionManager.fn5252()]);
        // level 6
        this.fnHash.set(6, [() => RiftActionManager.fn6161()]);
        // level 7
        this.fnHash.set(7, [() => RiftActionManager.fn7174()]);
        // level 8
        this.fnHash.set(8, [() => RiftActionManager.fn8181s()]);
        // level 9
        this.fnHash.set(9, [() => RiftActionManager.fn9191(), () => RiftActionManager.fn9393()]);
        // level 10
        this.fnHash.set(10, [() => RiftActionManager.fn101101(), () => RiftActionManager.fn102102()]);
        // level 11
        this.fnHash.set(11, []);
        // level 12
        this.fnHash.set(12, []);
        // level 13
        this.fnHash.set(13, []);

        // level 1
        this.invfnHash.set(1, [() => RiftActionManager.invfn1112()]);
        // level 2
        this.invfnHash.set(2, [() => RiftActionManager.invfn2121()]);
        // level 3
        this.invfnHash.set(3, []);
        // level 4
        this.invfnHash.set(4, []);
        // level 5
        this.invfnHash.set(5, [() => RiftActionManager.invfn5151(), () => RiftActionManager.invfn5252()]);
        // level 6
        this.invfnHash.set(6, [() => RiftActionManager.invfn6161()]);
        // level 7
        this.invfnHash.set(7, [() => RiftActionManager.invfn7172()]);
        // level 8
        this.invfnHash.set(8, [() => RiftActionManager.invfn8181()]);
        // level 9
        this.invfnHash.set(9, [() => RiftActionManager.invfn9191(), () => RiftActionManager.invfn9393()]);
        // level 10
        this.invfnHash.set(10, []);
        // level 11
        this.invfnHash.set(11, [() => RiftActionManager.invfn111111()]);
        // level 12
        this.invfnHash.set(12, [() => RiftActionManager.invfn121121(), () => RiftActionManager.invfn122122()]);
        // level 13
        this.invfnHash.set(13, [() => RiftActionManager.invfn139139()]);
    }

    static reverseToLevel(levelNumber) {
        console.log('Level Stack');
        console.log(this.levelStack);

        var len = this.levelStack.length;

        // if we need to go ahead in levels
        if (len < (levelNumber-1)) {
            // call all level functions until one before levelNumber
            for (var i=len+1; i<levelNumber; i++) {
                // push to stack and call functions
                console.log('Pushing level ' + i);
                this.levelStack.push(i);
                this.fnHash.get(i).forEach(element => {
                    element();
                });
            }
        }
        // we need to go back in levels
        else if (len > levelNumber) {
            for (var i=len; i>=levelNumber; i--) {
                // pop off stack and call inverse functions
                console.log('Poping level ' + i);
                this.levelStack.pop();
                this.invfnHash.get(i).forEach(element => {
                    element();
                });
            }
        }
        // level num is same revert to previous level
        else {
            // pop for this level and call inverse
            this.levelStack.pop();
            this.invfnHash.get(levelNumber).forEach(element => {
                element();
            });
        }

        console.log(this.levelStack);
    }

    static reverseToLevelOld(levelNumber) {
        var len = this.idStack.length;
        for (var x = 0; x < len; x++) {
            var id = "" + this.idStack.pop();
            var levelnum = 0;
            if (id.length == 4) {
                levelnum = parseInt(id.charAt(0));
            } else {
                levelnum = parseInt((id.charAt(0) + id.charAt(1)));
            }
            if (levelnum > levelNumber) {
                var reverseFunction = this.getInverseFunctionForID(id, "");
                reverseFunction();
                this.restoreIDStack.push(id);
            } else if (levelnum == levelNumber) {
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
            case "9191":
                tempfn = () => RiftActionManager.fn9191();
                return tempfn;
            case "9292":
                tempfn = () => RiftActionManager.fn9292();
                return tempfn;
            case "9393":
                tempfn = () => RiftActionManager.fn9393();
                return tempfn;
            case "101101":
                tempfn = () => RiftActionManager.fn101101();
                return tempfn;
            case "102102":
                tempfn = () => RiftActionManager.fn102102();
                return tempfn;
            case "103104":
                tempfn = () => RiftActionManager.fn103104();
                return tempfn;
            case "111111":
                tempfn = () => RiftActionManager.fn111111();
                return tempfn;
            case "121121":
                tempfn = () => RiftActionManager.fn121121();
                return tempfn;
            case "122122":
                tempfn = () => RiftActionManager.fn122122();
                return tempfn;
            case "123123":
                tempfn = () => RiftActionManager.fn123123();
                return tempfn;
            case "131131":
                tempfn = () => RiftActionManager.fn131131();
                return tempfn;
            case "132132":
                tempfn = () => RiftActionManager.fn132132();
                return tempfn;
            case "133133":
                tempfn = () => RiftActionManager.fn133133();
                return tempfn;
            case "134134":
                tempfn = () => RiftActionManager.fn134134();
                return tempfn;
            case "134134":
                tempfn = () => RiftActionManager.fn135135();
                return tempfn;
            case "135135":
                tempfn = () => RiftActionManager.fn135135();
                return tempfn;
            case "136136":
                tempfn = () => RiftActionManager.fn136136();
                return tempfn;
            case "137137":
                tempfn = () => RiftActionManager.fn137137();
                return tempfn;
            case "138138":
                tempfn = () => RiftActionManager.fn138138();
                return tempfn;
            case "139139":
                tempfn = () => RiftActionManager.fn139139();
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
            case "9393":
                tempfn = () => RiftActionManager.invfn9393();
                return tempfn;
            case "121121":
                tempfn = () => RiftActionManager.invfn121121();
                return tempfn;
            case "122122":
                tempfn = () => RiftActionManager.invfn122122();
                return tempfn;
            case "139139":
                tempfn = () => RiftActionManager.invfn139139();
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

        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("11");
            RiftActionManager.scene.riftManager.removeRiftInput("11");
        }, 2000);
    }

    static invfn1112() {
        RiftActionManager.scene.levelData.input.jumpKey = "";
    }


    // Level 2
    static fn2121() {
        RiftActionManager.scene.levelData.input.gravity = -300;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("21");
            RiftActionManager.scene.riftManager.removeRiftInput("21");
        }, 2000);
    }

    static invfn2121() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    // Level 3
    // No rifts :(


    // Level 4
    static fn4141() {
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("41");
                RiftActionManager.scene.riftManager.removeRiftInput("41");
            }, 2000);
        } catch{ }
    }

    static invfn4141() {
        try {RiftActionManager.scene.riftLayer.destroy(false);} catch {}
    }


    // Level 5
    static fn5151() {
        RiftActionManager.scene.levelData.input.throwStrength = 1000;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("51");
            RiftActionManager.scene.riftManager.removeRiftInput("51");
        }, 2000);
    }

    static invfn5151() {
        RiftActionManager.scene.levelData.input.throwStrength = 300;
    }

    static fn5252() {
        RiftActionManager.scene.levelData.input.gravity = 300;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("52");
            RiftActionManager.scene.riftManager.removeRiftInput("52");
        }, 2000);
    }

    static invfn5252() {
        RiftActionManager.scene.levelData.input.gravity = -300;
    }


    // Level 6
    static fn6161() {
        RiftActionManager.scene.levelData.input.throwStrength = 300;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("61");
            RiftActionManager.scene.riftManager.removeRiftInput("61");
        }, 2000);
    }

    static invfn6161() {
        RiftActionManager.scene.levelData.input.throwStrength = 1000;
        
    }

    static fn6262() {
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("62");
                RiftActionManager.scene.riftManager.removeRiftInput("62");
            }, 2000);
        } catch{ }
    }

    static invfn6262() {
        try {RiftActionManager.scene.riftLayer.destroy(false);} catch {}
    }


    // Level 7
    static fn7172() {
        RiftActionManager.scene.levelData.input.gravity = -300;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("71");
            RiftActionManager.scene.riftManager.removeRiftInput("72");
        }, 2000);
    }

    static fn7174() {
        RiftActionManager.scene.levelData.input.gravity = 300;
    }

    static fn7271() {
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("72");
                RiftActionManager.scene.riftManager.removeRiftInput("71");
            }, 2000);
        } catch{ }
    }

    static invfn7271() {
        try {RiftActionManager.scene.riftLayer.destroy(false);} catch {}
    }

    static fn7373() {
        //no inverse
        RiftActionManager.scene.reDrawLayer = true;
    }

    static fn7472() {
        RiftActionManager.scene.levelData.input.gravity = -300;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("74");
            RiftActionManager.scene.riftManager.removeRiftInput("72");
        }, 2000);
    }

    static fn7474() {
        RiftActionManager.scene.levelData.input.gravity = 300;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("74");
            RiftActionManager.scene.riftManager.removeRiftInput("74");
        }, 2000);
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
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
        } catch{ }
        // change drag on player
        RiftActionManager.scene.levelData.input.drag = 0.0;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("81");
            RiftActionManager.scene.riftManager.removeRiftInput("81");
        }, 2000);
    }

    static fn8181s() {
        // change drag on player
        RiftActionManager.scene.levelData.input.drag = 0.0;  
    }

    static invfn8181() {
        RiftActionManager.scene.levelData.input.drag = 0.85;
        try {
            RiftActionManager.scene.riftLayer.destroy(false);
        } catch { }
    }


    // Level 9
    static fn9191() {
        RiftActionManager.scene.levelData.input.downKey = "S";
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("91");
            RiftActionManager.scene.riftManager.removeRiftInput("91");
        }, 2000);
    }

    static invfn9191() {
        RiftActionManager.scene.levelData.input.downKey = "";
    }

    static fn9292() {
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("92");
                RiftActionManager.scene.riftManager.removeRiftInput("92");
            }, 2000);
        } catch{ }
    }

    static invfn9292(){
        try {RiftActionManager.scene.riftLayer.destroy(false);} catch {}
    }

    static fn9393() {
        // change drag on player
        RiftActionManager.scene.levelData.input.drag = 0.85;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("93");
            RiftActionManager.scene.riftManager.removeRiftInput("93");
        }, 2000);
    }

    static invfn9393() {
        RiftActionManager.scene.levelData.input.drag = 0.0;
    }


    // Level 10
    static fn101101() {
        try {
            RiftActionManager.scene.invRift1Layer.setAlpha(0);
            RiftActionManager.scene.invRift1Layer.setCollisionBetween(0, 5, false, true);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("101");
                RiftActionManager.scene.riftManager.removeRiftInput("101");
            }, 2000);
        } catch{ }


    }

    static fn102102() {
        try {
            RiftActionManager.scene.invRift2Layer.setAlpha(0);
            RiftActionManager.scene.invRift2Layer.setCollisionBetween(0, 5, false, true);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("102");
                RiftActionManager.scene.riftManager.removeRiftInput("102");
            }, 2000);
        } catch{ }


    }

    static fn103104() {
        try {
            RiftActionManager.scene.invRift1Layer = RiftActionManager.scene.map.createDynamicLayer("invRift1", RiftActionManager.scene.tileset, 0, 0).setDepth(21).setCollisionBetween(0, 5);
            RiftActionManager.scene.invRift1Colider = RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.invRift1Layer);
            RiftActionManager.scene.invRift2Layer = RiftActionManager.scene.map.createDynamicLayer("invRift2", RiftActionManager.scene.tileset, 0, 0).setDepth(21).setCollisionBetween(0, 5);
            RiftActionManager.scene.invRift2Colider = RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.invRift2Layer);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("103");
                RiftActionManager.scene.riftManager.removeRiftInput("104");
            }, 2000);

        } catch{ }
    }

    static invfn103104() { 
        try { 
            RiftActionManager.scene.invRift1Layer.destroy(false);
            RiftActionManager.scene.invRift2Layer.destroy(false);
        } catch { }
    }


    // Level 11
    static fn111111() {
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.riftLayer.setTileIndexCallback(35, RiftActionManager.scene.endLevel, RiftActionManager.scene);
            RiftActionManager.scene.riftLayer.setTileIndexCallback(36, RiftActionManager.scene.endLevel, RiftActionManager.scene);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
        } catch{ }
    }

    static invfn111111() {
        try {
            RiftActionManager.scene.riftLayer.destroy(false);
        } catch { }
    }

    // Level 12

    static fn121121() {
        try {
            RiftActionManager.scene.riftLayer = RiftActionManager.scene.map.createStaticLayer("rift", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.invRift1Layer = RiftActionManager.scene.map.createStaticLayer("riftDeco", RiftActionManager.scene.tileset, 0, 0).setDepth(20).setCollisionBetween(0, 5);
            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.player, RiftActionManager.scene.riftLayer);
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 100, 100, "Gravity is:", "direction", "123");
            

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("121");
                RiftActionManager.scene.riftManager.removeRiftInput("121");
                RiftActionManager.scene.riftManager.removeRift("122");
                RiftActionManager.scene.riftManager.removeRiftInput("122");
            }, 2000);

            //console.log(RiftActionManager.scene.riftManager.rifts);
        } catch { }
    }

    
    static invfn121121() { 
        try { 
            //RiftActionManager.scene.riftManager.removeRift("123");
            //RiftActionManager.scene.levelData.input.gravity = 300;
            RiftActionManager.scene.riftLayer.destroy(false);
            RiftActionManager.scene.invRift1Layer.destroy(false);
        } catch { }
    }

    static fn122122() {
        try {
            RiftActionManager.scene.levelData.input.gravity = -300;
        } catch { }
    }

    static invfn122122() {
        try {
            RiftActionManager.scene.levelData.input.gravity = 300;
        } catch { }
    }

    static fn123123() {
        try {
            RiftActionManager.scene.levelData.input.gravity = 300;

            RiftActionManager.scene.boss = new Boss(RiftActionManager.scene, RiftActionManager.scene.riftManager);
            console.log(RiftActionManager.scene.boss);
            RiftActionManager.scene.boss.inputNavCoords([{x: 150, y: 100}, {x: 155, y: 200}, {x: 650, y: 100}, {x: 655, y: 200}]);
            RiftActionManager.scene.boss.spawnBoss(400, 300, 20, BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET);

            setTimeout(function() {
                RiftActionManager.scene.riftManager.removeRift("123");
                RiftActionManager.scene.riftManager.removeRiftInput("123");
            }, 2000);

            
            setTimeout(function() {
                RiftActionManager.scene.boss.despawnBoss(750, 300);
            }, 30000);
        } catch { }
    }


    // final level (boss) 

    static fn131131() { // close the rift
        // boss spawn..
        RiftActionManager.scene.boss = new Boss(RiftActionManager.scene, RiftActionManager.scene.riftManager);
        var l13NavInit = [
            {x:200, y:150},
            {x:600, y:150},
            {x:200, y:450},
            {x:600, y:450}
        ];

        RiftActionManager.scene.boss.inputNavCoords(l13NavInit);
        RiftActionManager.scene.boss.spawnBoss(400, 300, 20, BossBehaviors.NAVIGATE_BETWEEN_POINTS_SET);

        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("131");
            RiftActionManager.scene.riftManager.removeRiftInput("131");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 300, 50, "ĠṛäṿIẗÿ ïṡ:", "direction", "132");
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 480, 30, "uP", "direction", "132");

        }, 2000);
    }

    static fn132132() {
        RiftActionManager.scene.levelData.input.gravity = -200;
        //RiftActionManager.scene.boss.behavior = BossBehaviors.PURSUE_PLAYER;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("132");
            RiftActionManager.scene.riftManager.removeRiftInput("132");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 550, 150, "Gravity is:", "direction", "133");
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 100, 100, "down", "direction", "133");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 320, 400, "Throw is:", "power", "134");
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 600, 600, "strong", "power", "134");
            
        }, 2000);
    }


    static fn133133() {
        RiftActionManager.scene.levelData.input.gravity = 300;

        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("133");
            RiftActionManager.scene.riftManager.removeRiftInput("133");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 320, 50, "???? is:", "pain", "135");
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 50, 300, "vulnerable", "pain", "135");
        }, 2000);
    }

    static fn134134() {
        RiftActionManager.scene.levelData.input.throwStrength = 1000;
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("134");
            RiftActionManager.scene.riftManager.removeRiftInput("134");
        }, 2000);
    }

    static fn135135() {
        RiftActionManager.scene.boss.unmasked = true;
        RiftActionManager.scene.boss.bossLoseArmor(1000);

        setTimeout(function() {
            RiftActionManager.scene.boss.behavior = BossBehaviors.PURSUE_PLAYER;
            RiftActionManager.scene.riftManager.removeRift("135");
            RiftActionManager.scene.riftManager.removeRiftInput("135");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 100, 100, "SLIP:", "bool", "136"); // drag
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 200, 100, "true", "bool", "136");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 450, 100, "ĠṛäṿIẗÿ ïṡ:", "direction", "137"); // gravity
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 630, 100, "^v", "direction", "137");
        }, 2000);

    }

    static fn136136() {
        RiftActionManager.scene.levelData.input.drag = 0.0;

        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("136");
            RiftActionManager.scene.riftManager.removeRiftInput("136");
        }, 2000);
    }

    static fn137137() {
        
        for(var i = 0; i< 10; i++) {
            setTimeout(function() {
                RiftActionManager.scene.levelData.input.gravity = Phaser.Math.Between(-300, 300);
            }, i*1000);
        }

        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("137");
            RiftActionManager.scene.riftManager.removeRiftInput("137");
        }, 2000);

        setTimeout(function() {
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 550, 150, "Gravity is:", "direction", "138");
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 100, 100, "down", "direction", "138");
            RiftActionManager.scene.levelData.input.gravity = -300;
        }, 11000);
    }

    static fn138138() {
        RiftActionManager.scene.levelData.input.gravity = 300;

        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("138");
            RiftActionManager.scene.riftManager.removeRiftInput("138");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 320, 50, "???? is:", "pain", "139");
            RiftActionManager.scene.riftManager.createNewRiftInput(RiftActionManager.scene, 50, 300, "dead", "pain", "139");
        }, 2000);
    }

    static fn139139() {
        setTimeout(function() {
            RiftActionManager.scene.riftManager.removeRift("139");
            RiftActionManager.scene.riftManager.removeRiftInput("139");

            RiftActionManager.scene.boss.behavior = BossBehaviors.GOES_NOWHERE_DOES_NOTHING;
            RiftActionManager.scene.boss.dead = true;
            
            for(var i = 0; i< RiftActionManager.scene.boss.boss.length; i++) {
                var segment = RiftActionManager.scene.boss.boss[i];
                segment.body.setAllowGravity(true);
                segment.body.setDrag(0.85);
            }

            RiftActionManager.scene.physics.add.collider(RiftActionManager.scene.collision_layer, RiftActionManager.scene.boss.boss);
        }, 2000);

        setTimeout(function() {
            RiftActionManager.scene.boss.bossFadeOut(0);
        }, 10000);

        setTimeout(function() {
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 400, 50, "  ", "none", "140");
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 500, 150, "  ", "none", "141");
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 600, 250, "  ", "none", "142");
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 500, 350, "  ", "none", "143");

            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 400, 450, "  ", "none", "144");
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 300, 350, "  ", "none", "145");
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 200, 250, "  ", "none", "146");
            RiftActionManager.scene.riftManager.createNewRift(RiftActionManager.scene, 300, 150, "  ", "none", "147");

            setTimeout(function() {
                //RiftActionManager.scene.riftManager.removeRift("140");
                //RiftActionManager.scene.riftManager.removeRift("141");
                //RiftActionManager.scene.riftManager.removeRift("142");
                //RiftActionManager.scene.riftManager.removeRift("143");
                //RiftActionManager.scene.riftManager.removeRift("144");
               // RiftActionManager.scene.riftManager.removeRift("145");
                //RiftActionManager.scene.riftManager.removeRift("146");
                //RiftActionManager.scene.riftManager.removeRift("147");

                RiftActionManager.scene.levelData.input.drag = 0.85;

                RiftActionManager.scene.winText = RiftActionManager.scene.add.text(380, 280, "You win!").setColor('white');
            }, 5000);
        }, 12000);

        
    }

    static invfn139139() {
        try {
            RiftActionManager.scene.winText.destroy();
        } catch { }
    }
    
}



    