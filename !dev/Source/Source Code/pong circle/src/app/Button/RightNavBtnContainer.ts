import { Assets, Container, Sprite, Spritesheet, Texture } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "../../Common/CommonConfig";

export class RightNavBtnContainer extends Container{
    private buttton !: Sprite;
    private buttonTexture !: Spritesheet;

    constructor(){
        super();
        this.buttonTexture = Assets.get("ui_assets");
        this.initializeButton();
        this.addEvent();
        Game.the.app.stage.on(CommonConfig.RESET_BUTTON, this.resetButton,this);
        Game.the.app.stage.on(CommonConfig.TUTORIAL_RIGHT_CLICK, this.rightClick, this);
    }

    private initializeButton() :void{
        this.buttton = new Sprite(this.buttonTexture.textures['Ui_button.png']);
        this.addChild(this.buttton);
        this.buttton.anchor.set(0.5,0.5)
        this.buttton.scale.set(0.45,0.45);
        this.buttton.position.set(-this.buttton.width/2,this.buttton.height/2)
    }

    private addEvent() :void{
        this.interactive = true;
        this.on('pointerdown', this.onButtonDown, this)
            .on('pointerup', this.onButtonUp, this)
    }

    private resetButton() :void{
        this.buttton.scale.set(0.45,0.45);
    }

    private onButtonDown() :void{
        if(CommonConfig.the.getTutorialState()){
            return
        }
        if(CommonConfig.the.getGamePaused()){
            return;
        }
        CommonConfig.the.setIsButtonLoop(true);
        CommonConfig.the.setCurrentBtn("ArrowRight");
        this.buttton.scale.set(0.40,0.40);
    }

    private onButtonUp() :void{
        if(CommonConfig.the.getTutorialState()){
            return
        }
        if(CommonConfig.the.getGamePaused()){
            return;
        }
        CommonConfig.the.setIsButtonLoop(false);
        CommonConfig.the.setCurrentBtn("");
        this.buttton.scale.set(0.45,0.45);
    }

    private rightClick() :void{
        this.buttton.scale.set(0.40,0.40);
    }

    private disable() :void{
        this.interactive = false;
        // this.alpha = 0.65;
    }

    private enable() :void{
        this.interactive = true;
        this.alpha = 1;
    }

    private onEnableDisableBtn(value : boolean) :void{
        value ? this.enable() : this.disable()
    }
    
}