import { Container, Text, TextStyle } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "@/Common/CommonConfig";

export class Level extends Container {
    private winMeterLabelText !: Text;
    private winMeterText !: Text;
    private betValue: number = 0;
    private gap: number = 5;

    constructor() {
        super();
        this.init();
        this.updateScore();
        this.addToStage();
        Game.the.app.stage.on(CommonConfig.UPDATE_GAME_LEVEL_DATA, this.updateScore, this);
    }

    private init(): void {
        const buttonStyle = new TextStyle({
            fill: "#ffffff",
            fontSize: 24,
            fontWeight: "bold"
        });
        const buttonStyle2 = new TextStyle({
            fill: "#ffffff",
            fontSize: 24,
            fontWeight: "bold"
        });
        this.winMeterLabelText = new Text({
            text: `Level : `,
            style: buttonStyle
        });
        this.winMeterText = new Text({
            text: `${this.betValue}`,
            style: buttonStyle2
        })
    }

    private addToStage(): void {
        this.addChild(this.winMeterLabelText);
        this.addChild(this.winMeterText);
    }

    private updateScore(): void {
        let balance : number = CommonConfig.the.getGameLevel();
        this.winMeterText.text = `${balance}`;
        this.winMeterText.x = this.winMeterLabelText.x + this.winMeterLabelText.width + this.gap;
    }

}