import { Assets, Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "@/Common/CommonConfig";
import gsap from "gsap";

export class TutorialContainer extends Container {
  private bg !: Graphics;
  _mainNode!: Container;
  private _character!: Sprite;
  _main!: Container;
  handContainer !: Container;
  leftHand !: Sprite;
  rightHand !: Sprite;
  private tutorialIndicator !: Container;
  private skipBtnContainer !: Container;
  private nextBtnContainer !: Container;
  private tutorialText !: Text;
  private btnContainer !: Container;
  private isLoopTween : boolean = true;
  private bg_frame!: Sprite;
  private content !: Container;

  constructor() {
    super();
    this._mainNode = new Container();
    this.addChild(this._mainNode);
    this.init();
    this.addToStage();
    this.setPosition();
    this.subscribeEvent();
    this.leftHand.alpha = 0;
    this.rightHand.alpha = 0;
    this.visible = false;
    CommonConfig.the.setTutorialState(true);
    CommonConfig.the.setGamePauseForTutorialState(true);
    CommonConfig.the.setCurrentTutorialState(CommonConfig.TUTORIAL_RIGHT_STATE);
  }

  private playLoopTween() :void{
    if(!this.isLoopTween) return;
    gsap.to(this.nextBtnContainer, {
      alpha : 0.65,
      duration : 0.5,
      loop : true,
      ease : "power4.in",
      onComplete:()=>{
        gsap.to(this.nextBtnContainer, {
          alpha : 1,
          duration : 0.5,
          ease : "power4.in",
          onComplete:()=>{
            this.playLoopTween();
          }
        })
      }
    })
  }

  private init(): void {
    this.bg = new Graphics();
    this.bg.fillStyle = 0x141116;
    this.bg.drawRect(0, 0, 4000, 4000);
    this.bg.endFill();
    this.bg.alpha = 0.65;
    this._main = new Container();
    this.handContainer = new Container();
    this._character = new Sprite(Assets.get("character"));          
    this.leftHand = new Sprite(Assets.get("hand"));
    this.rightHand = new Sprite(Assets.get("hand"));
    // this.leftHand.anchor.set(0.5);
    // this.rightHand.anchor.set(0.5);
    this.leftHand.scale.set(0.35);
    this.rightHand.scale.set(0.35);
    this.initTutorialSection();
  }

  private initTutorialSection(): void {
    this.tutorialIndicator = new Container();
    this.btnContainer = new Container();
    this.content = new Container();
    this.tutorialIndicator.addChild(this.content);
    this.bg_frame = new Sprite(Assets.get("frame_bg"));
    this.bg_frame.scale.set(0.9);
    this.tutorialIndicator.addChild(this.bg_frame);
    const textStyle = new TextStyle({
      // fontFamily: 'Bauhaus',
      fill: "#00277f",
      fontSize: 40,
      align : "center",
      wordWrap : true,
      wordWrapWidth : this.bg_frame.width * 0.8
    });
    this.tutorialText = new Text({
      text: CommonConfig.TUTORIAL_TEXT_LEFT,
      style : textStyle
    });
    this.content.addChild(this.tutorialText);
    this.tutorialText.position.set((this.bg_frame.width - this.tutorialText.width)/2,0);
    this.skipBtnContainer = new Container();
    this.nextBtnContainer = new Container();
    let btnBgSkipBtn = new Sprite(Assets.get("buttonBg"));
    btnBgSkipBtn.scale
    let btnBgNextBtn = new Sprite(Assets.get("buttonBg"));
    this.skipBtnContainer.addChild(btnBgSkipBtn);
    this.nextBtnContainer.addChild(btnBgNextBtn);
    const buttonStyle = new TextStyle({
      // fontFamily: 'Bauhaus',
      fill: "#ffffff",
      fontSize: 48,
    });
    let skipBtnText: Text = new Text({
      text: "Skip",
      style : buttonStyle
    });
    let nextBtnText: Text = new Text({
      text: "Next",
      style : buttonStyle
    });
    this.skipBtnContainer.addChild(skipBtnText);
    this.nextBtnContainer.addChild(nextBtnText);
    skipBtnText.position.set((btnBgSkipBtn.width - skipBtnText.width)/2,(btnBgSkipBtn.height - skipBtnText.height)/2);
    nextBtnText.position.set((btnBgNextBtn.width - nextBtnText.width)/2,(btnBgNextBtn.height - nextBtnText.height)/2);
    this.nextBtnContainer.scale.set(0.6);
    this.skipBtnContainer.scale.set(0.6);
    this.nextBtnContainer.position.set(this.skipBtnContainer.x + (this.skipBtnContainer.width + 5), 0);
    this.btnContainer.addChild(this.nextBtnContainer);
    this.btnContainer.addChild(this.skipBtnContainer);
    this.btnContainer.position.set((this.bg_frame.width - this.btnContainer.width) * 0.5, this.tutorialText.y + (this.tutorialText.height * 1) );
    this.content.addChild(this.btnContainer);
    // content.scale.set(0.9);
    this.content.position.set(0,(this.bg_frame.height - this.content.height) * 0.3)
    this.tutorialIndicator.addChild(this.content);
  }

  private addToStage(): void {
    this.addChild(this.bg);
    this.addChild(this._mainNode);
    this._mainNode.addChild(this._main);
    this._mainNode.addChild(this.handContainer);
    this._main.addChild(this._character);
    this.handContainer.addChild(this.leftHand);
    this.handContainer.addChild(this.rightHand);
    // this.tutorialIndicator.scale.set
    this._main.addChild(this.tutorialIndicator);
  }

  private setPosition(): void {
    this._character.position.set(34.5, 121.5);
    this.tutorialIndicator.scale.set(0.9);
    this.tutorialIndicator.position.set(-381, 54);
    this._main.scale.set(0.6);
  }

  private subscribeEvent() :void{
    this.skipBtnContainer.interactive = true;
    this.nextBtnContainer.interactive = true;
    this.skipBtnContainer.on("pointerup", this.skipBtnClicked, this);
    this.nextBtnContainer.on("pointerup", this.nextBtnClicked, this);
    Game.the.app.stage.on(CommonConfig.PLAY_TUTORIAL,this.playInstruction,this);
    Game.the.app.stage.on(CommonConfig.HIDE_TUTORIAL,this.hideInstruction,this);
  }

  private skipBtnClicked() :void{
    gsap.killTweensOf(this.nextBtnContainer);
    this.skipBtnContainer.interactive = false;
    this.nextBtnContainer.interactive = false;
    gsap.to(this, {
      alpha: 1,
      duration: 0.4,
      ease: "power1.inOut",
      onComplete : ()=>{
        CommonConfig.the.setTutorialState(false);
        CommonConfig.the.setCurrentTutorialState("");
        CommonConfig.the.setGamePauseForTutorialState(false);
        Game.the.app.stage.emit(CommonConfig.START_GAME);
        this.leftHand.visible = false;
        this.rightHand.visible = false;
        this.tutorialIndicator.visible = false;
        this.bg.visible = false;
        this.visible = false;
      }
    });
  }

  private nextBtnClicked() :void{
    // this.skipBtnContainer.interactive = false;
    gsap.killTweensOf(this.nextBtnContainer);
    this.nextBtnContainer.alpha = 0.65;
    this.isLoopTween = false;
    this.nextBtnContainer.interactive = false;
    CommonConfig.the.setGamePauseForTutorialState(false);
    Game.the.app.stage.emit(CommonConfig.START_GAME);
    // this.leftHand.visible = false;
    // this.rightHand.visible = false;
    // this.tutorialIndicator.visible = false;
    // this.bg.visible = false;
    if(CommonConfig.the.getCurrentTutorialState() === CommonConfig.TUTORIAL_LEFT_STATE){
      Game.the.app.stage.emit(CommonConfig.TUTORIAL_LEFT_CLICK);
    }else{
      Game.the.app.stage.emit(CommonConfig.TUTORIAL_RIGHT_CLICK);
    }
  }

  private playInstruction(): void {
    // this._clouds.alpha = 0;
    CommonConfig.the.setGamePauseForTutorialState(true);
    this.isLoopTween = true;
    this.playLoopTween();
    this.skipBtnContainer.interactive = true;
    this.nextBtnContainer.interactive = true;
    this.visible = true;
    this.leftHand.visible = false;
    this.rightHand.visible = false;
    this.leftHand.alpha = 0;
    this.rightHand.alpha = 0;
    this.tutorialIndicator.visible = true;
    this.bg.visible = true;
    if(CommonConfig.the.getCurrentTutorialState() === CommonConfig.TUTORIAL_LEFT_STATE){
      this.leftHand.visible = true;
      this.leftHand.alpha = 1;
      this.tutorialText.text = CommonConfig.TUTORIAL_TEXT_LEFT;
      this.content.position.set(-3,43.5);
      this.tutorialText.position.set((this.bg_frame.width - this.tutorialText.width)/2,0);
      this.btnContainer.position.set((this.bg_frame.width - this.btnContainer.width) * 0.5, this.tutorialText.y + (this.tutorialText.height * 1) + 10 );
    }else if(CommonConfig.the.getCurrentTutorialState() === CommonConfig.TUTORIAL_RIGHT_STATE){
      this.rightHand.visible = true;
      this.rightHand.alpha = 1;
      this.tutorialText.text = CommonConfig.TUTORIAL_TEXT_RIGHT;
      this.content.position.set(0.5,60.5);
      this.tutorialText.position.set((this.bg_frame.width - this.tutorialText.width)/2,0);
      this.btnContainer.position.set((this.bg_frame.width - this.btnContainer.width) * 0.5, this.tutorialText.y + (this.tutorialText.height * 1) + 15);
    }else{
      // this.bg_frame.scale.set(0.9);
      this.tutorialText.text = CommonConfig.TUTORIAL_CENTER_RIGHT;
      // this.tutorialIndicator.position.set(-446, 54);
      this.content.position.set(-1,23);
      this.tutorialText.position.set((this.bg_frame.width - this.tutorialText.width)/2,0);
      this.btnContainer.position.set((this.bg_frame.width - this.btnContainer.width) * 0.5, this.tutorialText.y + (this.tutorialText.height * 1));
      // this.rightHand.visible = true;
      // this.rightHand.alpha = 1;
    }
    
   

  }

  private hideInstruction(): void {
    this.skipBtnContainer.interactive = false;
    this.nextBtnContainer.interactive = false;
    // CommonConfig.the.setTutorialState(false);
    CommonConfig.the.setCurrentTutorialState("");
    this.leftHand.visible = false;
    this.rightHand.visible = false;
    this.tutorialIndicator.visible = false;
    this.bg.visible = false;
    this.visible = false;
  }
}
