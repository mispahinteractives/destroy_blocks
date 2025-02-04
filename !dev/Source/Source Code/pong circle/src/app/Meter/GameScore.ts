import { Container, Text, TextStyle } from "pixi.js";
import { Game } from "../game";
import { CommonConfig } from "@/Common/CommonConfig";
import { ILevelConfiguration } from "../DataInterface/InitialDataInterface";

export class GameScore extends Container {
    private winMeterLabelText !: Text;
    private winMeterText !: Text;
    private betValue: number = 0;
    private gap: number = 5;

    constructor() {
        super();
        this.init();
        this.updateScore();
        this.addToStage();
        Game.the.app.stage.on(CommonConfig.UPDATE_GAME_SCORE, this.updateScore, this);
    }

    private init(): void {
        const buttonStyle = new TextStyle({
            fill: "#ffffff",
            fontSize: 24,
            fontWeight: "bold"
        });
        const buttonStyle2 = new TextStyle({
            fontFamily: 'Showcard_gothic',
            fill: "#3fa7bf",
            fontSize: 108,
            fontWeight: "bold"
        });
        this.winMeterLabelText = new Text({
            text: `Game Score : `,
            style: buttonStyle
        });
        this.winMeterText = new Text({
            text: `${this.betValue}`,
            style: buttonStyle2
        })
    }

    private addToStage(): void {
        // this.addChild(this.winMeterLabelText);
        this.addChild(this.winMeterText);
    }

    private updateScore(): void {
        let balance: number = CommonConfig.the.getGameScore();
        this.winMeterText.text = `${balance}`;
        this.winMeterText.x = 0;
        if(localStorage.getItem("HighScore")){
           if(balance > Number(localStorage.getItem("HighScore"))){
              localStorage.setItem("HighScore",balance.toString())
            }
        }else{
            localStorage.setItem("HighScore",balance.toString())
        }
        Game.the.app.stage.emit(CommonConfig.UPDATE_SCORE_POSITION);
        let currentLevelHitFrequency = Number(CommonConfig.the.getGameConfiguration()[CommonConfig.the.getGameLevel() - 1].targetFrequency.split(" ")[0]);
        if (CommonConfig.the.getGameScore() >= currentLevelHitFrequency) {
            CommonConfig.the.setGameLevel(CommonConfig.the.getGameLevel() + 1);
            Game.the.app.stage.emit(CommonConfig.UPDATE_GAME_LEVEL_DATA);
        }
        this.calculateSpeed();
    }

    private calculateSpeed() :void{
        let currentConfig : ILevelConfiguration = CommonConfig.the.getGameConfiguration()[CommonConfig.the.getGameLevel() - 1];
        let lastTargetFrequency : number = 10;
        if(CommonConfig.the.getGameLevel() > 1){
            lastTargetFrequency = Number(CommonConfig.the.getGameConfiguration()[CommonConfig.the.getGameLevel() - 2].targetFrequency.split(" ")[0]);
        }
        let speed : number = 1;
        const speedArray : number[] = [currentConfig.config.slowSpeed,currentConfig.config.fastSpeed];
        if(currentConfig.targetIntensity === "Single Speed"){
            speed = 1/currentConfig.config.slowSpeed;
        }else if(currentConfig.targetIntensity === "Random Pattern"){
           speed =  1/speedArray[Math.floor(Math.random() * speedArray.length)];
        }else if(currentConfig.targetIntensity.includes("Alternating")){
            let alternative : string = currentConfig.targetIntensity;
            let currentScoreInLevel = CommonConfig.the.getGameScore() - lastTargetFrequency;
            const match = alternative.match(/\d+/);
            if(match){
                const number = parseInt(match[0], 10);
                console.log(number);
                speed = speedArray[(Math.floor(currentScoreInLevel / number))%2];
            }
        }
        CommonConfig.the.setCurrentSpeed(speed);
        if(speed > CommonConfig.the.getFastestSpeed()){
            CommonConfig.the.setFastestSpeed(speed)
        }
    }

}