export interface IForecastDay {
    time: string,

    // 10MWind = 5 min average 10m off ground (m/s ??? - no, knots)
    midday10MWindSpeed: number|undefined,
    midnight10MWindSpeed: number|undefined,
    midday10MWindDirection: number|undefined,
    midnight10MWindDirection: number|undefined,
    midday10MWindGust: number|undefined,
    midnight10MWindGust: number|undefined,

    middayVisibility: number|undefined,
    midnightVisibility: number|undefined,

    middayRelativeHumidity: number|undefined,
    midnightRelativeHumidity: number|undefined,

    // mean sea level pressure (n/m^2 ?)
    middayMslp: number|undefined,
    midnightMslp: number|undefined,

    daySignificantWeatherCode: number|undefined,
    nightSignificantWeatherCode: number|undefined,

    dayMaxScreenTemperature: number|undefined,
    nightMinScreenTemperature: number|undefined,
    dayUpperBoundMaxTemp: number|undefined,
    nightUpperBoundMinTemp: number|undefined,
    dayLowerBoundMaxTemp: number|undefined,
    nightLowerBoundMinTemp: number|undefined,

    nightMinFeelsLikeTemp: number|undefined,
    dayUpperBoundMaxFeelsLikeTemp: number|undefined,
    nightUpperBoundMinFeelsLikeTemp: number|undefined,
    dayLowerBoundMaxFeelsLikeTemp: number|undefined,
    nightLowerBoundMinFeelsLikeTemp: number|undefined,

    nightProbabilityOfPrecipitation: number|undefined,
    nightProbabilityOfSnow: number|undefined,
    nightProbabilityOfHeavySnow: number|undefined,
    nightProbabilityOfRain: number|undefined,
    nightProbabilityOfHeavyRain: number|undefined,
    nightProbabilityOfHail: number|undefined,
    nightProbabilityOfSferics: number|undefined
}