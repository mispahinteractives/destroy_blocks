export interface IInitialDataInterface{
    gameName : string;
    levelsCaptured : string;
    startLevel : string;
    userSummary : IUserSummaryData,
    levels : ILevelData
}

export interface IUserSummaryData {
    userId : string;
    totalLevelsPlayed : string;
    totalTimeTakenSec : string;
    fastestSpeedHit : string;
    totalHitsMade : string;
}

export interface ILevelData {
    levelNo : string;
    hitsRequired : string;
    ballVelocityChange : string;
    speedVariation : string;
    fastSpeedSec : string;
    slowSpeedSec : string;
    target :ITargetData;
    bioSensor ?:IBioSensor;
}

export interface ITargetData{
    frequency : string;
    intensity : string;
    speed : string;
    time : string;
}

export interface IBioSensor{
    eye : string;
    heartRate : string;
    timeStamp : string;
}

export interface IUpdateData{
    gameName : string,
    levelsCaptured : string,
    startLevel : string,
    userSummary : IUserSummaryData,
}

export interface ILevelConfigData{
    fastSpeed : number,
    slowSpeed : number
}

export interface ILevelConfiguration{
    config : ILevelConfigData,
    levelNo : number,
    targetFrequency : string,
    targetIntensity : string,
    targetSpeed : number
}