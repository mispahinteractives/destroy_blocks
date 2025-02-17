export class Tutorial3 extends Phaser.GameObjects.Container {
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

        this.blocksArr = [];

        this.frameGrp = this.scene.add.container(0, 0);
        this.add(this.frameGrp);

        this.frame = this.scene.add.sprite(0, -100, "sheet", 'tutorial/panel');
        this.frame.setOrigin(0.5);
        this.frame.setScale(1);
        this.frameGrp.add(this.frame);

        this.tutorialText = this.scene.add.text(0, 305, this.scene.text.texts[0].tuto3, {
            fontFamily: "Flame_Regular",
            fontSize: 33,
            fill: "#ffffff",
            align: "center",
            stroke: "#c00b00",
            strokeThickness: 4,
        })
        this.tutorialText.setOrigin(0.5);
        this.add(this.tutorialText);
        this.tutorialText.visible = false;

        this.circleArr = [];

        let startX = -22;
        let startY = 140;
        for (let i = 0; i < 3; i++) {

            let blueCircle = this.scene.add.sprite(startX, startY, "sheet", "tutorial/4");
            blueCircle.setOrigin(0.5);
            blueCircle.setScale(1.25);
            this.frameGrp.add(blueCircle);

            let whiteCircle = this.scene.add.sprite(startX, startY, "sheet", "tutorial/3");
            whiteCircle.setOrigin(0.5);
            whiteCircle.setScale(1.25);
            this.frameGrp.add(whiteCircle);

            this.circleArr.push(blueCircle);
            blueCircle.whiteCircle = whiteCircle;

            startX += 22;

        }

        this.circleArr[0].whiteCircle.visible = false;
        this.circleArr[1].whiteCircle.visible = false;

        this.addTutorial();

        this.hand = this.scene.add.sprite(this.shooter.x + 100, this.shooter.y + 185, "sheet", "hand");
        this.hand.setOrigin(0.5, 1);
        this.hand.setScale(1);
        this.hand.angle = -25;
        this.add(this.hand);
        this.hand.visible = false;

        this.visible = false;
        setTimeout(() => {
            // this.show();
        }, 20);
    }

    stopTimer() {

        if (this.handTimer) {
            this.scene.time.removeEvent(this.handTimer);
        }
        if (this.timer1) {
            this.scene.time.removeEvent(this.timer1);
        }
        if (this.timer2) {
            this.scene.time.removeEvent(this.timer2);
        }
        if (this.timer3) {
            this.scene.time.removeEvent(this.timer3);
        }
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        // this.frameGrp.alpha = 0;
        this.runTween = true;
        this.timer3 = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
                this.tutorialText.visible = true;
                this.scene.tweens.add({
                    targets: this.tutorialText,
                    scaleX: { from: 0, to: this.tutorialText.scaleX },
                    ease: "Back.easeOut",
                    duration: 250,
                    onComplete: () => {
                        this.runTween = false;
                        this.showTutorial2();
                    }
                })
            }
        })
    }

    hide() {
        if (!this.visible) return;
        this.runTween = true;
        this.tutorialText.visible = false
        this.runTween = false;
        this.visible = false;
        this.x = 0;
        this.redBall.visible = true;
        this.redBall.y = 20
        this.shooter.setFrame("ball_thrower/red");
        this.redBall.setTexture("red");
        let startY = -135;
        for (let i = 0; i < this.blocksArr.length; i++) {
            this.blocksArr[i].visible = true;
            this.blocksArr[i].y = startY
            startY -= 40;
            if (i == 6) {
                this.blocksArr[i].visible = false;
            }
        }
    }

    addTutorial() {

        this.bottomUi = this.scene.add.sprite(0, 75, "sheet", 'ball_thrower/thrower_bg');
        this.bottomUi.setOrigin(0.5);
        this.bottomUi.setScale(1);
        this.frameGrp.add(this.bottomUi);

        this.redBall = this.scene.add.sprite(0, 20, "red");
        this.redBall.setOrigin(0.5);
        this.redBall.setScale(1);
        this.frameGrp.add(this.redBall);

        this.shooter = this.scene.add.sprite(0, 30, "sheet", 'ball_thrower/red');
        this.shooter.setOrigin(0.5);
        this.shooter.setScale(1);
        this.frameGrp.add(this.shooter);

        let startX = 0;
        let startY = -135;
        let path = ["red", "yellow", "red", "yellow", "red", "yellow", "red"];
        for (let i = 0; i < 7; i++) {

            let blocks = this.scene.add.sprite(startX, startY, "sheet", path[i]);
            blocks.setOrigin(0.5);
            blocks.setScale(0.65);
            this.frameGrp.add(blocks);
            this.blocksArr.push(blocks);
            if (i == 6) {
                blocks.visible = false;
            }

            startY -= 40;

        }

    }

    handTween() {
        this.handTimer = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.hand.visible = true;
                this.scene.tweens.add({
                    targets: this.hand,
                    scale: { from: this.hand.scale, to: this.hand.scale - 0.1 },
                    ease: "Linear",
                    duration: 250,
                    yoyo: true,
                    onComplete: () => {
                        this.hand.visible = false;
                    }
                })
            }
        })
    }

    showTutorial2() {
        this.handTween()
        this.timer1 = this.scene.time.addEvent({
            delay: 350,
            callback: () => {
                this.scene.tweens.add({
                    targets: this.shooter,
                    y: { from: this.shooter.y, to: this.shooter.y - 10 },
                    ease: "Linear",
                    duration: 100,
                    yoyo: true,
                })
                this.redBall.visible = true;
                this.scene.tweens.add({
                    targets: this.redBall,
                    y: { from: this.redBall.y, to: this.blocksArr[0].y },
                    ease: "Linear",
                    duration: 350,
                    onComplete: () => {
                        this.blocksArr[6].visible = true;
                        this.blocksArr.forEach(element => {
                            element.y += 40;
                        });
                        this.blocksArr[0].visible = false;
                        this.redBall.visible = false;
                        this.timer2 = this.scene.time.addEvent({
                            delay: 1000,
                            callback: () => {
                                this.scene.intro.changeTutorial(1)
                            }
                        })
                    }
                })
            }
        })
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2;
    }
}