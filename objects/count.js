export class Count extends Phaser.GameObjects.Container {
    constructor(scene, x, y, dimensions) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);

        this.init();
    }

    init() {
        this.value = 0;
        this.totalCount = 5;

        this.txt = this.scene.add.text(-47, -24, "0" + this.value, {
            fontFamily: "PepsiOwners_Extended",
            align: "center",
            fontSize: 26,
            fill: "#ffffff",
        });
        this.txt.setOrigin(0);
        this.add(this.txt);
        this.txt.setPadding(10, 10, 10, 10);

        this.visible = false;
        // this.show()
    }
    restart() {
        this.value = 0;
        this.txt.text = "0" + this.value;
    }

    updateCount(amount) {

        this.value += amount;
        if (this.value <= 0) this.value = 0;

        if (this.value < 10) {
            this.txt.text = "0" + this.value;

        } else {
            this.txt.text = this.value;

        }

        // if (this.value >= this.totalCount) {
        //     this.value = this.totalCount;
        // }

    }
    show() {
        this.visible = true;
        this.scene.add.tween({
            targets: this,
            alpha: {
                from: 0,
                to: 1,
            },
            ease: "Power0",
            duration: 100
        })
    }
}