/*
    Home of the Rift class and its members, the RiftInputBlock class,
    and rift effect pipelines/shaders.
*/

class RiftInputBlock extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, type) {
        super(scene, x, y, text);

        /* The type of this block, e.g. 'int', 'float', 'string', ... */
        this.blockType = type;

        /* Factory functions */
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, 0);

        this.body.setCollideWorldBounds(true);
    }

    // preUpdate() { }
}

class Rift {
    /* 
        Rift class! Contains codeText, which is the code puzzle needing 
        to be solved, riftZone, which is there to help detect overlaps from
        riftinputblocks 
    */
    constructor(scene, x, y, codeText, acceptedType) {
        var zoneWidth = 100, zoneHeight = 20;

        this.acceptedType = acceptedType;

        this.codeText = new RiftText(scene, x, y, codeText);

        this.riftZone = new RiftZone(scene, 
            x + this.codeText.width + zoneWidth/2,
            y + this.codeText.height / 2,
            zoneWidth,
            zoneHeight 
        );

        this.zoneText = new RiftText(scene, 
            this.riftZone.x - this.riftZone.width,
            this.riftZone.y - this.height / 2,
            ""
        );
    }
}

class RiftZone extends Phaser.GameObjects.Zone {
    /* Zone for capturing overlap events and dealing with them */
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, 0);

        this.body.setAllowGravity(false);
    }
}

class RiftText extends Phaser.GameObjects.Text {
    /* Basic text for the Rift */
    constructor(scene, x, y, text) {
        super(scene, x, y, text);

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
    }
}
