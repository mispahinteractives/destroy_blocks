import gsap from "gsap";
import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "@/Common/CommonConfig";

export class Popup extends Container {
  private bg!: Graphics;
  buttonContainer!: Container;
  private gameOverText!: Sprite;
  private playAgainButton!: Sprite;
  constructor() {
    super();

    this.init();
  }

  private init(): void {
    this.bg = new Graphics();
    this.bg.fillStyle = 0x141116;
    this.bg.drawRect(0, 0, 1920, 1080);
    this.bg.endFill();
    this.addChild(this.bg);
    this.bg.alpha = 0.65;

    this.buttonContainer = new Container();
    this.addChild(this.buttonContainer);

    this.gameOverText = new Sprite(Assets.get("gameOver_assets"));
    this.gameOverText.anchor.set(0.5);
    this.gameOverText.x = 0;
    this.gameOverText.y = -75;
    this.buttonContainer.addChild(this.gameOverText);

    // Create "Play Again" button
    this.playAgainButton = new Sprite(Assets.get("playAgain_assets"));
    this.playAgainButton.scale.set(0.5);
    this.playAgainButton.x = -86;
    this.playAgainButton.y = 55;
    this.playAgainButton.interactive = false;
    this.playAgainButton.on("pointerdown", () => this.retartGame());

    this.gameOverText!.visible = false;
    this.playAgainButton!.visible = false;
    this.playAgainButton!.alpha = 1;
    this.buttonContainer.addChild(this.playAgainButton);

    Game.the.app.stage.on(
      CommonConfig.SHOW_GAME_OVER_POPUP,
      this.gameOverPopup,
      this
    );
    Game.the.app.stage.on(
      CommonConfig.ENABLE_PLAY_AGAIN_BUTTON,
      this.enablePlayAgainButton,
      this
    );
    this.visible = false;
    this.alpha = 0;
  }

  private enablePlayAgainButton(): void {
    this.playAgainButton!.interactive = true;
    this.playAgainButton!.alpha = 1;
  }

  private retartGame(): void {
    gsap.to(this, {
      alpha: 0,
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => {
        this.visible = false;
        this.gameOverText!.visible = false;
        this.playAgainButton!.visible = false;
        this.playAgainButton!.interactive = false;
        Game.the.app.stage.emit(CommonConfig.RESTART_GAME);
      },
    });
  }

  private gameOverPopup(): void {
    if(CommonConfig.the.getTutorialState()){
      this.playAgainButton.texture = Assets.get("start_btn");
      CommonConfig.the.setTutorialState(false);
    }else{
      this.playAgainButton.texture = Assets.get("playAgain_assets");
    }
    this.visible = true;
    this.gameOverText!.visible = true;
    this.playAgainButton!.visible = true;
    gsap.to(this, {
      alpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => {
        this.playAgainButton!.interactive = true;
      },
    });
  }
}
