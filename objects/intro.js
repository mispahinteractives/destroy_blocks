import { Tutorial1 } from "./tutorial1.js";
import { Tutorial2 } from "./tutorial2.js";
import { Tutorial3 } from "./tutorial3.js";

export class Intro extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.dimensions = dimensions;
        this.scene.add.existing(this);
        this.init();
    }

    init() {
        this.level = 0;
        this.graphicsGrp = this.scene.add.container(0, 0);
        this.add(this.graphicsGrp);

        this.graphics = this.scene.make.graphics()
            .fillStyle(0x000000, 1)
            .fillRect(this.dimensions.leftOffset, this.dimensions.topOffset, this.dimensions.actualWidth, this.dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

        this.leftArrow = this.scene.add.sprite(0, 0, "sheet", 'tutorial/2');
        this.leftArrow.setOrigin(0.5).setScale(1).setAlpha(0.5);
        this.add(this.leftArrow);

        this.rightArrow = this.scene.add.sprite(0, 0, "sheet", "tutorial/1");
        this.rightArrow.setOrigin(0.5).setScale(1);
        this.add(this.rightArrow);

        this.closeBtn = this.scene.add.sprite(0, 0, "sheet", 'tutorial/close');
        this.closeBtn.setOrigin(0.5).setScale(1);
        this.add(this.closeBtn);

        this.playBtn = this.scene.add.sprite(0, 0, "sheet", 'tutorial/play');
        this.playBtn.setOrigin(0.5).setScale(1);
        this.add(this.playBtn);

        this.tutorial1 = new Tutorial1(this.scene, 0, 0, this);
        this.add(this.tutorial1);
        this.tutorial2 = new Tutorial2(this.scene, 0, 0, this);
        this.add(this.tutorial2);
        this.tutorial3 = new Tutorial3(this.scene, 0, 0, this);
        this.add(this.tutorial3);

        this.playBtn.setInteractive().on("pointerdown", () => this.hide());
        this.closeBtn.setInteractive().on("pointerdown", () => this.hide());
        this.rightArrow.setInteractive().on("pointerdown", () => {
            if (this.rightArrow.alpha === 0.5) return;
            this.changeTutorial(1);
        });
        this.leftArrow.setInteractive().on("pointerdown", () => {
            if (this.leftArrow.alpha === 0.5) return;
            this.changeTutorial(-1);
        });
    }

    changeTutorial(direction) {
        if (this.tutorial1.runTween || this.tutorial2.runTween || this.tutorial3.runTween) return;

        this.tutorial1.stopTimer();
        this.tutorial2.stopTimer();
        this.tutorial3.stopTimer();

        let currentTutorial = this[`tutorial${this.level + 1}`];
        let nextLevel = (this.level + direction + 3) % 3;
        let nextTutorial = this[`tutorial${nextLevel + 1}`];

        this.scene.tweens.add({
            targets: currentTutorial,
            x: direction > 0 ? -500 : 500,
            ease: "Cubic.easeOut",
            duration: 300,
            onComplete: () => {
                currentTutorial.hide();
                currentTutorial.x = 500;
            }
        });

        nextTutorial.x = direction > 0 ? 500 : -500;
        nextTutorial.show();
        this.scene.tweens.add({
            targets: nextTutorial,
            x: 0,
            ease: "Linear",
            duration: 300
        });

        this.level = nextLevel;
        this.leftArrow.setAlpha(this.level === 0 ? 0.5 : 1);
        this.rightArrow.setAlpha(this.level === 2 ? 0.5 : 1);

    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.alpha = 0;
        this.frameGrp.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.tutorial1.show();
            }
        });
    }

    hide() {
        if (!this.visible) return;
        this.visible = false;
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.visible = false;
                this.scene.countDown.updateCount();
                this.scene.gamePlay.show();
            }
        });
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2;

        this.leftArrow.x = this.dimensions.leftOffset + 17 - this.x;
        this.leftArrow.y = this.dimensions.gameHeight / 2 - 50 - this.y;

        this.rightArrow.x = this.dimensions.rightOffset - 17 - this.x;
        this.rightArrow.y = this.dimensions.gameHeight / 2 - 50 - this.y;

        this.closeBtn.x = this.dimensions.leftOffset + 47 - this.x;
        this.closeBtn.y = this.dimensions.bottomOffset - 47 - this.y;

        this.playBtn.x = this.dimensions.rightOffset - 204 - this.x;
        this.playBtn.y = this.dimensions.bottomOffset - 47 - this.y;

        this.graphics.clear();
        this.graphics = this.scene.make.graphics().fillStyle(0x000000, 0.65).fillRect(this.dimensions.leftOffset - this.x, this.dimensions.topOffset - this.y, this.dimensions.actualWidth, this.dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

    }
}