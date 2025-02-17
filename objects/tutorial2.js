export class Tutorial2 extends Phaser.GameObjects.Container {
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
        this.frameGrp = this.scene.add.container(0, 0);
        this.add(this.frameGrp);

        this.frame = this.scene.add.sprite(0, -100, "sheet", 'tutorial/panel');
        this.frame.setOrigin(0.5);
        this.frame.setScale(1);
        this.frameGrp.add(this.frame);

        this.tutorialText = this.scene.add.text(0, 305, this.scene.text.texts[0].tuto2, {
            fontFamily: "UberMoveMedium",
            fontSize: 35,
            fill: "#ffffff",
            align: "center",
        })
        this.tutorialText.setOrigin(0.5);
        this.add(this.tutorialText);
        this.tutorialText.visible = false;

        this.circleArr = [];

        let startX = -11;
        let startY = 140;
        for (let i = 0; i < 2; i++) {

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

        this.addTutorial();

        this.hand = this.scene.add.sprite(this.shooter.x + 100, this.shooter.y + 185, "sheet", "hand");
        this.hand.setOrigin(0.5, 1);
        this.hand.setScale(1);
        this.hand.angle = -25;
        this.add(this.hand);
        this.hand.visible = false;

        this.visible = false;
        // this.show();
    }

    stopTimer() {
        if (this.timer1) {
            this.scene.time.removeEvent(this.timer1);
        }
        if (this.handTimer) {
            this.scene.time.removeEvent(this.handTimer);
        }
        if (this.timer2) {
            this.scene.time.removeEvent(this.timer2);
        }
        if (this.timer3) {
            this.scene.time.removeEvent(this.timer3);
        }
        if (this.timer4) {
            this.scene.time.removeEvent(this.timer4);
        }
        if (this.timer5) {
            this.scene.time.removeEvent(this.timer5);
        }
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        // this.frameGrp.alpha = 0;
        this.runTween = true;
        this.showTween = this.scene.tweens.add({
            targets: this,
            x: { from: this.x + 400, to: this.x },
            ease: "Linear",
            duration: 250,
            onComplete: () => {
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
        this.hideTween = this.scene.tweens.add({
            targets: this,
            x: { from: this.x, to: this.x + 400 },
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.tutorialText.visible = false;
                this.runTween = false;
                this.redBlock.y = -275;
                this.yellowBlock.y = -315;
                this.visible = false;
                this.x = 0;
                this.shooter.setFrame("ball_thrower/red");
                this.redBall.setTexture("red");
                // this.scene.gamePlay.show()
            }
        })
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

        this.redBlock = this.scene.add.sprite(0, -275, "sheet", 'red');
        this.redBlock.setOrigin(0.5);
        this.redBlock.setScale(0.65);
        this.frameGrp.add(this.redBlock);
        this.redBlock.visible = false;

        this.yellowBlock = this.scene.add.sprite(0, -315, "sheet", 'yellow');
        this.yellowBlock.setOrigin(0.5);
        this.yellowBlock.setScale(0.65);
        this.frameGrp.add(this.yellowBlock);
        this.yellowBlock.visible = false;

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
        this.redBlock.visible = true;
        this.yellowBlock.visible = true;
        this.redBall.y = 20;
        this.timer2 = this.scene.time.addEvent({
            delay: 350,
            callback: () => {
                this.scene.tweens.add({
                    targets: this.yellowBlock,
                    y: { from: this.yellowBlock.y, to: this.redBlock.y },
                    ease: "Linear",
                    duration: 350,
                })
                this.scene.tweens.add({
                    targets: this.redBlock,
                    y: { from: this.redBlock.y, to: this.redBlock.y + 40 },
                    ease: "Linear",
                    duration: 350,
                    onComplete: () => {
                        this.timer3 = this.scene.time.addEvent({
                            delay: 1400,
                            callback: () => {
                                this.scene.tweens.add({
                                    targets: this.yellowBlock,
                                    y: { from: this.yellowBlock.y, to: this.redBlock.y },
                                    ease: "Linear",
                                    duration: 350,
                                })
                            }
                        })
                    }
                })
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
                    y: { from: this.redBall.y, to: this.redBlock.y + 40 },
                    ease: "Linear",
                    duration: 350,
                    onComplete: () => {
                        this.redBlock.visible = false;
                        this.redBall.visible = false;
                        this.timer4 = this.scene.time.addEvent({
                            delay: 1000,
                            callback: () => {
                                this.handTween()
                                this.timer5 = this.scene.time.addEvent({
                                    delay: 350,
                                    callback: () => {
                                        this.shooter.setFrame("ball_thrower/yellow");
                                        this.redBall.visible = true;
                                        this.redBall.setTexture("yellow");
                                        this.redBall.y = 20;
                                        this.scene.tweens.add({
                                            targets: this.shooter,
                                            y: { from: this.shooter.y, to: this.shooter.y - 10 },
                                            ease: "Linear",
                                            duration: 100,
                                            yoyo: true,
                                        })
                                        this.scene.tweens.add({
                                            targets: this.redBall,
                                            y: { from: this.redBall.y, to: this.yellowBlock.y + 40 },
                                            ease: "Linear",
                                            duration: 350,
                                            onComplete: () => {
                                                this.yellowBlock.visible = false;
                                                this.redBall.visible = false;
                                                this.timer1 = this.scene.time.addEvent({
                                                    delay: 1000,
                                                    callback: () => {
                                                        this.hide();
                                                        this.scene.intro.tutorial1.show()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })

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