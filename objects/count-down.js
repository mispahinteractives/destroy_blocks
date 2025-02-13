
export class CountDown extends Phaser.GameObjects.Container {
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
        this.countdownValue = 3;

        this.graphicsGrp = this.scene.add.container(0, 0);
        this.add(this.graphicsGrp);

        this.graphics = this.scene.make.graphics().fillStyle(0x000000, .5).fillCircle(0, 0, 50);
        this.graphicsGrp.add(this.graphics);

        this.text = this.scene.add.text(0, 0, this.countdownValue, {
            fontSize: '64px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(this.text)

        this.visible = false;
    }

    updateCount(){
        this.visible = true;
        // this.sounds("countdown").play()
        this.scene.tweens.add({
            targets: this.graphics,
            scale: {from: 0 , to: this.graphics.scaleX},
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                
               
            }
        });
        
        this.scene.tweens.add({
            targets: this.text,
            scale: {from: 0 , to: this.text.scaleX},
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                
                
            }
        });
        this.scene.sound.play('countdown', { volume: 1 })
        this.scene.time.addEvent({
            delay: 1000,
            repeat: 2,
            callback: () => {
                this.countdownValue--;
                this.text.setText(this.countdownValue);
                
                this.scene.tweens.add({
                    targets: this.graphics,
                    scale: {from: 0 , to: this.graphics.scaleX},
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        
                       
                    }
                });
                
                this.scene.tweens.add({
                    targets: this.text,
                    scale: {from: 0 , to: this.text.scaleX},
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        
                        
                    }
                });
                if(this.countdownValue <= 0){
                    this.visible= false;
                this.scene.gamePlay.startGame();
                }else{
        this.scene.sound.play('countdown', { volume: 1 })

                }
            }
        });
    }

}