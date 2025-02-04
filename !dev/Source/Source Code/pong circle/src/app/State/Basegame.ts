import { Container, Graphics } from "pixi.js";
import { Game } from "../game";
import { Background } from "../Background/Background";
import { Gameplay } from "../Gameplay/Gameplay";
import { GameScore } from "../Meter/GameScore";
import { Level } from "../Meter/LevelMeter";
import { Timer } from "../Meter/Timer";
import { CommonConfig } from "@/Common/CommonConfig";
import {
  IBioSensor,
  IInitialDataInterface,
  ILevelConfiguration,
  ILevelData,
  ITargetData,
  IUpdateData,
  IUserSummaryData,
} from "../DataInterface/InitialDataInterface";
import { LeftNavBtnContainer } from "../Button/LeftNavBtnContainer";
import { RightNavBtnContainer } from "../Button/RightNavBtnContainer";
import { TutorialContainer } from "../Tutorial/TutorialContainer";
import { Popup } from "../Popup/Popup";

export class BaseGame extends Container {
  private aspectRatio: number = 0;
  private background!: Background;
  private gameplay!: Gameplay;
  // private gameScore!: GameScore;
  private level!: Level;
  private timer!: Timer;
  private gameInitiated : boolean = false;
  private isLocal : boolean  = false;
  private leftNavBtnContainer !: LeftNavBtnContainer;
  private rightNavBtnContainer !: RightNavBtnContainer;
  private _tutorialContainer !: TutorialContainer;
  private _popup !: Popup;
  constructor() {
    super();
    this.getGameConfiguration();
    // if(this.isLocal){
    //   this.initStage();
    // }else{
    //   this.getGameConfiguration();
    // }
  }

  private initStage(): void {
    this.gameInitiated = true;
    this.init();
    this.addContainerToStage();
    this.setPosition();
    this.resizeApp();
    Game.the.app.stage.on("RESIZE_THE_APP", this.resizeApp, this);
  }

  private subscribeEvent(): void {
    Game.the.app.stage.on(
      CommonConfig.UPDATE_GAME_LEVEL_DATA,
      this.setInitialData,
      this
    );
  }

  private init() {
    this.background = new Background();
    this.initGameplay();
    this.initLevel();
    this.initTimer();
    this.leftNavBtnContainerBtn();
    this.rightNavBtnContainerBtn();
    this.initTutorial();
    this.initPopup();
    Game.the.app.stage.emit(CommonConfig.PLAY_TUTORIAL);
    this.subscribeEvent();
  }

  private initGameplay() {
    this.gameplay = new Gameplay();
    this.aspectRatio = this.gameplay.height / 919;
  }

  private initTutorial():void{
    this._tutorialContainer = new TutorialContainer();
  }

  private initPopup():void{
    this._popup = new Popup();
  }

  private initLevel() {
    this.level = new Level();
  }

  private leftNavBtnContainerBtn () :void{
    this.leftNavBtnContainer = new LeftNavBtnContainer();
  }

  private rightNavBtnContainerBtn() :void{
    this.rightNavBtnContainer =new RightNavBtnContainer();
  }

  private addContainerToStage() {
    this.addChild(this.background);
    this.addChild(this.gameplay);
    this.addChild(this.leftNavBtnContainer);
    this.addChild(this.rightNavBtnContainer);
    this.addChild(this._tutorialContainer);
    this.addChild(this._popup);
  }

  private initTimer(): void {
    this.timer = new Timer();
  }

  private setPosition() {}

  private resizeApp(): void {
    let currentScale: number = 1;
    let assumedHeight: number = window.innerHeight * this.aspectRatio;
    if (window.innerWidth < window.innerHeight) {
      this.gameplay.scale.set(1.2);
    } else {
      this.gameplay.scale.set(0.8);
    }
    let height = this.gameplay.height;
    currentScale = assumedHeight / height;
    this.gameplay.scale.set(currentScale);
    // if (window.innerWidth < window.innerHeight) {
      
    // } else {
    //   this.gameplay.position.set(window.innerWidth / 2, window.innerHeight / 2);
    // }
    this.gameplay.position.set(window.innerWidth / 2, (window.innerHeight - (this.gameplay.height * 0.6))/ 2);
    this._popup.buttonContainer.scale.set(currentScale);
    this._popup.buttonContainer.position.set(window.innerWidth / 2, window.innerHeight * 0.38);
    this.level.position.set(20, 20);
    this.timer.position.set(20, this.level.y + this.level.height + 20);
    this.leftNavBtnContainer.scale.set(currentScale);
    this.rightNavBtnContainer.scale.set(currentScale);
    this.leftNavBtnContainer.position.set(this.gameplay.x - (this.leftNavBtnContainer.width * 1.5), this.gameplay.y + (this.gameplay.height * 0.7));
    this.rightNavBtnContainer.position.set(this.gameplay.x + (this.gameplay.width * 0.4), this.gameplay.y + (this.gameplay.height  * 0.7));
    this._tutorialContainer._main.scale.set(currentScale * 0.7);
    this._tutorialContainer.leftHand.scale.set(currentScale * 0.45);
    this._tutorialContainer.rightHand.scale.set(currentScale * 0.45);
    this._tutorialContainer._main.position.set((this.background.x + this.background.width) - (this._tutorialContainer._main.width * 0.3), window.innerHeight - (this._tutorialContainer._main.height * 0.63) );
    this._tutorialContainer.leftHand.position.set(this.leftNavBtnContainer.x - (this._tutorialContainer.leftHand.width * 0.5), this.leftNavBtnContainer.y - (this._tutorialContainer.rightHand.height));
    this._tutorialContainer.rightHand.position.set(this.rightNavBtnContainer.x - (this._tutorialContainer.rightHand.width * 1.5), this.rightNavBtnContainer.y - ((this._tutorialContainer.rightHand.height)));
  }

  private getGameConfiguration(): void {
    async function fetchGameConfiguration(): Promise<any> {
      const url = `${CommonConfig.BASE_URL}fetchFiltered`;
      const body = {
        collection: "game_config",
        filter: {
          gameName: "Pong Circle",
        },
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error making API call:", error);
        throw error;
      }
    }

    fetchGameConfiguration()
      .then((data) => {
        console.log("API response:", data);
        this.setConfiguration(data);
        this.checkDataFromSelectData();
        // this.setInitialData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  private setConfiguration(data : any) : void{
    CommonConfig.the.setGameConfiguration(data[0].levels);
    console.log(CommonConfig.the.getGameConfiguration());
  }

  private checkDataFromSelectData() :void{
    async function selectDataAPI(): Promise<any> {
      const url = `${CommonConfig.BASE_URL}selectData`;
      const body = {
        templateId: CommonConfig.TEMPLATE_ID,
        query: {
          tableName: "games",
          filters: {
            gameName: "Pong Circle"
          }
        }
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error making API call:", error);
        throw error;
      }
    }

    selectDataAPI()
      .then((data) => {
        console.log("API response:", data);
        if(data.data.length){
          if(data.data.length && data.data[0].userSummary.userId === "12345"){
            CommonConfig.the.setInsertedId("676cf8acba71881ced20a924");
            console.log(CommonConfig.the.getInsertedId());
            this.initStage();
          }else{
            CommonConfig.the.setInsertedId("676cf8acba71881ced20a924");
            console.log(CommonConfig.the.getInsertedId());
            this.initStage();
          }
        }else{
          this.generatePayloadPath();
        }
        // this.setConfiguration(data);
        // this.setInitialData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  private generatePayloadPath(): void {
    async function generatePayload(templateId: string): Promise<any> {
      const url = `${CommonConfig.BASE_URL}generatePayload`;
      const body = {
        templateId,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error making API call:", error);
        throw error;
      }
    }

    generatePayload(CommonConfig.TEMPLATE_ID)
      .then((data) => {
        console.log("API response:", data);
        this.setInitialData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  private setInitialData(): void {
    let levelConfig : ILevelConfiguration[] = CommonConfig.the.getGameConfiguration();
    let currentLevelHitFrequency: number = Number(
      levelConfig[CommonConfig.the.getGameLevel() - 1].targetFrequency.split(" ")[0]
    );
    let fastSpeedSec: string = (levelConfig[CommonConfig.the.getGameLevel() - 1].config.fastSpeed).toString();
    let slowSpeedSec: string = (levelConfig[CommonConfig.the.getGameLevel() - 1].config.slowSpeed).toString();
    const currentTimeStamp = new Date().toISOString();

    let targetData: ITargetData = {
      frequency: levelConfig[CommonConfig.the.getGameLevel() - 1].targetFrequency,
      intensity: levelConfig[CommonConfig.the.getGameLevel() - 1].targetIntensity,
      speed: CommonConfig.the.getCurrentSpeed().toString(),
      time: (levelConfig[CommonConfig.the.getGameLevel() - 1].targetSpeed).toString(),
    };

    // let bioSensor: IBioSensor = {
    //   eye: "blue",
    //   heartRate: "72",
    //   timeStamp: currentTimeStamp,
    // };

    let levelData: ILevelData = {
      levelNo: CommonConfig.the.getGameLevel().toString(),
      hitsRequired: currentLevelHitFrequency.toString(),
      ballVelocityChange: "High",
      speedVariation: "Medium",
      fastSpeedSec: fastSpeedSec,
      slowSpeedSec: slowSpeedSec,
      target: targetData,
    };

    let userSummary: IUserSummaryData = {
      userId: "12345",
      totalLevelsPlayed: CommonConfig.the.getGameLevel().toString(),
      totalTimeTakenSec: CommonConfig.the.getTimer().toString(),
      fastestSpeedHit: CommonConfig.the.getFastestSpeed().toString(),
      totalHitsMade: CommonConfig.the.getGameScore().toString(),
    };

    let initialData: IInitialDataInterface = {
      gameName: "Pong Circle",
      levelsCaptured: CommonConfig.the.getGameLevel().toString(),
      startLevel: "1",
      userSummary: userSummary,
      levels: levelData,
    };

    this.insertData(initialData);
  }

  private insertData(initialData: IInitialDataInterface): void {
    const tableData = {
      templateId: CommonConfig.TEMPLATE_ID,
      tables: [
        {
          name: "games",
          data: initialData,
        },
      ],
    };
    async function interstData(tableData: any): Promise<any> {
      const url = `${CommonConfig.BASE_URL}submit`;
      const body = tableData;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error making API call:", error);
        throw error;
      }
    }

    interstData(tableData)
      .then((data) => {
        console.log("API response:", data);
        CommonConfig.the.setInsertedId(data.results[0].insertedId);
        !this.gameInitiated && this.initStage();
        this.gameInitiated && (Game.the.app.stage.emit(CommonConfig.ENABLE_PLAY_AGAIN_BUTTON));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  private updateGameLevelData(): void {
    let userSummary: IUserSummaryData = {
      userId: "12345",
      totalLevelsPlayed: CommonConfig.the.getGameLevel().toString(),
      totalTimeTakenSec: CommonConfig.the.getTimer().toString(),
      fastestSpeedHit: CommonConfig.the.getFastestSpeed().toString(),
      totalHitsMade: CommonConfig.the.getGameScore().toString(),
    };
    let data: IUpdateData = {
      gameName: "Pong Circle",
      levelsCaptured: CommonConfig.the.getGameLevel().toString(),
      startLevel: "1",
      userSummary: userSummary,
    };

    let requestData = {
      templateId: CommonConfig.TEMPLATE_ID,
      updates: [
        {
          id: CommonConfig.the.getInsertedId(),
          name: "games",
          data: data,
        },
      ],
    };

    async function updateLevelData(data: any): Promise<any> {
      const url = `${CommonConfig.BASE_URL}updateData`;
      const body = data;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error making API call:", error);
        throw error;
      }
    }

    updateLevelData(requestData)
      .then((data) => {
        console.log("API response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

}
