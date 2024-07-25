export interface IForecast {

    time: string;
    when: Date|undefined; // we set this from the time (string) value

    //
    // -- hourly - https://datahub.metoffice.gov.uk/docs/glossary?models=mo-spot-1hr&sortOrder=ALPHABETICALLY
    //

    feelsLikeTemperature: number|undefined;

    maxScreenAirTemp: number|undefined;
    minScreenAirTemp: number|undefined;
    mslp: number|undefined; // (n/m^2)
    precipitationRate: number|undefined; // (mm/hr)
    probOfPrecipitation: number|undefined; // (percent)
    screenDewPointTemperature: number|undefined;
    screenRelativeHumidity: number|undefined;
    screenTemperature: number|undefined;
    significantWeatherCode: number|undefined;

    totalPrecipAmount: number|undefined; // (mm - in an hour?)
    totalSnowAmount: number|undefined;
    uvIndex: number|undefined;
    visibility: number|undefined;
    windDirectionFrom10m: number|undefined;  // (m/s - mean over observed prev 10 mins - huh?)
    windGustSpeed10m: number|undefined;
    windSpeed10m: number|undefined;
    max10mWindGust: number|undefined;

    //
    // -- daily
    //

    // 10MWind = 5 min average 10m off ground (m/s ??? - no, knots)
    midday10MWindSpeed: number|undefined;
    midnight10MWindSpeed: number|undefined;
    midday10MWindDirection: number|undefined;
    midnight10MWindDirection: number|undefined;
    midday10MWindGust: number|undefined;
    midnight10MWindGust: number|undefined;

    middayVisibility: number|undefined;
    midnightVisibility: number|undefined;

    middayRelativeHumidity: number|undefined;
    midnightRelativeHumidity: number|undefined;

    // mean sea level pressure (n/m^2 ?)
    middayMslp: number|undefined;
    midnightMslp: number|undefined;

    daySignificantWeatherCode: number|undefined;
    nightSignificantWeatherCode: number|undefined;

    dayMaxScreenTemperature: number|undefined;
    nightMinScreenTemperature: number|undefined;
    dayUpperBoundMaxTemp: number|undefined;
    nightUpperBoundMinTemp: number|undefined;
    dayLowerBoundMaxTemp: number|undefined;
    nightLowerBoundMinTemp: number|undefined;

    nightMinFeelsLikeTemp: number|undefined;
    dayUpperBoundMaxFeelsLikeTemp: number|undefined;
    nightUpperBoundMinFeelsLikeTemp: number|undefined;
    dayLowerBoundMaxFeelsLikeTemp: number|undefined;
    nightLowerBoundMinFeelsLikeTemp: number|undefined;

    nightProbabilityOfPrecipitation: number|undefined;
    nightProbabilityOfSnow: number|undefined;
    nightProbabilityOfHeavySnow: number|undefined;
    nightProbabilityOfRain: number|undefined;
    nightProbabilityOfHeavyRain: number|undefined;
    nightProbabilityOfHail: number|undefined;
    nightProbabilityOfSferics: number|undefined;
}