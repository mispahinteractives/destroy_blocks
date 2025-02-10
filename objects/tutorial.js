export class Tutorial extends Phaser.GameObjects.Container {
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
        this.graphicsGrp = this.scene.add.container(0, 0);
        this.add(this.graphicsGrp);

        this.graphics = this.scene.make.graphics().fillStyle(0x000000, 1).fillRect(this.dimensions.leftOffset, this.dimensions.topOffset, this.dimensions.actualWidth, this.dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

        this.frameGrp = this.scene.add.container(0, 0);
        this.add(this.frameGrp);

        this.frame = this.scene.add.sprite(0, -100, "sheet", 'tutorial/panel');
        this.frame.setOrigin(0.5);
        this.frame.setScale(1);
        this.frameGrp.add(this.frame);

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

        this.circleArr[1].whiteCircle.visible = false;
        // this.circleArr[2].whiteCircle.visible = false;

        this.leftArrow = this.scene.add.sprite(0, 0, "sheet", 'tutorial/2');
        this.leftArrow.setOrigin(0.5);
        this.leftArrow.setScale(1);
        this.add(this.leftArrow);

        this.rightArrow = this.scene.add.sprite(0, 0, "sheet", "tutorial/1");
        this.rightArrow.setOrigin(0.5);
        this.rightArrow.setScale(1);
        this.add(this.rightArrow);

        this.closeBtn = this.scene.add.sprite(0, 0, "sheet", 'tutorial/close');
        this.closeBtn.setOrigin(0.5);
        this.closeBtn.setScale(1);
        this.add(this.closeBtn);

        this.playBtn = this.scene.add.sprite(0, 0, "sheet", 'tutorial/play');
        this.playBtn.setOrigin(0.5);
        this.playBtn.setScale(1);
        this.add(this.playBtn);

        this.addTutorial();

        this.hand = this.scene.add.sprite(this.shooter.x + 100, this.shooter.y + 185, "sheet", "hand");
        this.hand.setOrigin(0.5, 1);
        this.hand.setScale(1);
        this.hand.angle = -25;
        this.add(this.hand);
        this.hand.alpha = 0;

        this.playBtn.on("pointerdown", (event) => {
            this.click()
        });

        this.closeBtn.on("pointerdown", (event) => {
            this.click()
        });

        this.rightArrow.setInteractive()
        this.rightArrow.on("pointerdown", (event) => {
            this.click1(this.rightArrow)
        });

        this.leftArrow.on("pointerdown", (event) => {
            this.click2(this.leftArrow)
        });
        this.visible = false;
        this.show();
    }

    click() {
        this.playBtn.disableInteractive();
        this.closeBtn.disableInteractive();
        this.hide();
        this.scene.tutorial1.hide();
    }

    click1(sprite) {
        this.rightArrow.disableInteractive();
        this.hand.visible = false;
        this.scene.tweens.add({
            targets: this.frameGrp,
            x: { from: this.frameGrp.x, to: this.frameGrp.x - 1000 },
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.scene.tutorial1.show()
            }
        })

    }

    click2(sprite) {
        this.leftArrow.disableInteractive();
        this.hand.visible = false;
        this.scene.tweens.add({
            targets: this.scene.tutorial1.frameGrp,
            x: { from: this.scene.tutorial1.frameGrp.x, to: this.scene.tutorial1.frameGrp.x + 1000 },
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.frameGrp,
                    x: { from: this.frameGrp.x, to: this.frameGrp.x + 1000 },
                    ease: "Linear",
                    duration: 250,
                })
            }
        })

    }

    show() {
        // if (this.visible) return;
        this.visible = true;
        this.alpha = 0;
        // this.frameGrp.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.frameGrp,
                    // alpha: { from: 0, to: 1 },
                    // x: { from: this.frameGrp.y - 500, to: this.frameGrp.y },
                    ease: "Back.easeOut",
                    duration: 200,
                    onComplete: () => {
                        setTimeout(() => {
                            this.showTutorial();
                            this.playBtn.setInteractive();
                            this.closeBtn.setInteractive();
                        }, 700);
                    }
                })
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
        this.scene.tweens.add({
            targets: this.hand,
            alpha: 1,
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.hand,
                    scale: { from: this.hand.scale, to: this.hand.scale - 0.1 },
                    ease: "Linear",
                    duration: 250,
                    yoyo: true,
                    onComplete: () => {
                        // this.hand.visible = false;
                    }
                })
            }
        })
    }

    showTutorial() {
        this.showredBall();
        this.scene.time.addEvent({
            delay: 1500,
            callback: () => {
                this.showYellowBall();
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.hand.visible = false;
                        this.hideFrame();
                        this.scene.tutorial1.show()
                    }
                })
            }
        })
    }

    hideFrame() {
        this.scene.tweens.add({
            targets: this.frameGrp,
            x: this.frameGrp.x - 400,
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.frameGrp.visible = false;
                this.frameGrp.x += 400;
            }
        })
    }

    showredBall() {
        this.handTween()
        setTimeout(() => {
            this.redBall.visible = true;
            this.shooter.setFrame("ball_thrower/red");
            this.redBall.visible = true;
            this.redBall.setTexture("red");
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
                y: { from: this.redBall.y, to: this.redBlock.y },
                ease: "Linear",
                duration: 350,
                onComplete: () => {
                    this.redBall.visible = false;
                }
            })
        }, 350)
    }

    showYellowBall() {
        this.handTween()
        setTimeout(() => {
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
                y: { from: this.redBall.y, to: this.yellowBlock.y },
                ease: "Linear",
                duration: 350,
                onComplete: () => {
                    this.yellowBlock.visible = false;
                    this.redBall.visible = false;
                }
            })
        }, 350)
    }

    hide() {
        if (!this.visible) return;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.visible = false;
                this.alpha = 1;
                this.scene.gamePlay.show();
            }
        })
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