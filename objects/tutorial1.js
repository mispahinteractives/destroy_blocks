export class Tutorial1 extends Phaser.GameObjects.Container {
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

        this.addTutorial();

        this.hand = this.scene.add.sprite(this.shooter.x + 100, this.shooter.y + 185, "sheet", "hand");
        this.hand.setOrigin(0.5, 1);
        this.hand.setScale(1);
        this.hand.angle = -25;
        this.add(this.hand);
        this.hand.alpha = 0;

        this.visible = false;

        setTimeout(() => {
            this.show();
        }, 20);
    }

    stopTimer() {
        if (this.timer1) {
            this.scene.time.removeEvent(this.timer1);
        }
        this.stopTween();
    }

    stopTween() {
        if (this.showTween) {
            this.x = 0
            this.showTween.stop();
        }
        if (this.hideTween) {
            this.x = 0
            this.hideTween.stop();
            this.visible = false;
            this.x = 0
            this.scene.intro.leftArrow.alpha = 1
            this.scene.intro.rightArrow.alpha = .5
        }
    }

    show() {
        this.scene.intro.leftArrow.alpha = .5
        this.scene.intro.rightArrow.alpha = 1

        this.visible = true;
        this.showTween = this.scene.tweens.add({
            targets: this,
            x: { from: this.x - 400, to: this.x },
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.showTutorial();
            }
        })
    }

    hide() {
        if (!this.visible) return;
        this.hideTween = this.scene.tweens.add({
            targets: this,
            x: { from: this.x, to: this.x - 400 },
            ease: "Linear",
            duration: 250,
            onComplete: () => {
                this.visible = false;
                this.x = 0
                this.scene.intro.leftArrow.alpha = 1
                this.scene.intro.rightArrow.alpha = .5
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
                this.timer1 = this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.hand.visible = false;
                        this.hide();
                        this.scene.intro.tutorial2.show()
                    }
                })
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

}