import config from "../config.js";

export class CTA extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene) {

        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);
        this.init();
    }

    init() {
        this.userWon = false;

        this.visible = false;
        // this.userWon = true
        // this.show()
    }

    ctaClick() {
        if (this.done) return;
        this.btnTxt.disableInteractive();
        onCTAClick();
        this.done = true;
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.done = false;
                this.btnTxt.setInteractive();
            }
        })
    }

    showBtn() {
        this.scene.tweens.add({
            targets: this.btnTxt,
            alpha: {
                from: 0,
                to: 1
            },
            ease: "Linear",
            duration: 200,
        })
        this.scene.tweens.add({
            targets: this.btn,
            alpha: {
                from: 0,
                to: 1
            },
            ease: "Linear",
            duration: 200,
            onComplete: () => {

            }
        })
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {}
        })
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: {
                from: 1,
                to: 0
            },
            ease: "Linear",
            duration: 100,
            onComplete: () => {
                this.alpha = 1;
                this.visible = false;
            }
        });
    }
}