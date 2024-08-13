
import Stuff from "@/utilities/Stuff";

export interface SunriseSunsetResult {
    sunrise: number;
    sunset: number;
}

module Sun {

    // see https://en.wikipedia.org/wiki/Sunrise_equation

    export const SunriseAndSunset = (
            timestamp: number,
            latitudeDegrees: number,
            longitudeDegrees: number,
            elevation: number = 0.0): SunriseSunsetResult => {

        const julianDate = Stuff.epochMillisToJulian(timestamp);

        // days since 1/1/2000
        const julianDay = Math.ceil(julianDate - (2451545.0 + 0.0009) + 69.184 / 86400.0);

        // an approximation of mean solar time at integer n {\displaystyle n} expressed as a Julian day with the day fraction.
        const meanSolarTime = julianDay + 0.0009 - longitudeDegrees / 360.0;

        // Solar mean anomaly
        const solarMeanAnomalyDeg = 357.5291 + 0.98560028 * meanSolarTime % 360;
        const solarMeanAnomalyRad = Stuff.toRadians(solarMeanAnomalyDeg);

        // Equation of the center
        const centreDegrees = 1.9148 * Math.sin(solarMeanAnomalyRad) +
                              0.02 * Math.sin(2 * solarMeanAnomalyRad) +
                              0.0003 * Math.sin(3 * solarMeanAnomalyRad);

        // Ecliptic longitude
        const eclipticLongitudeDeg = solarMeanAnomalyDeg + centreDegrees + 180.0 + 102.9372 % 360;
        const eclipticLongitudeRad = Stuff.toRadians(eclipticLongitudeDeg);

        // Solar transit (julian date)
        const solarTransitJulian = 2451545.0 + meanSolarTime + 0.0053 * Math.sin(solarMeanAnomalyRad) - 0.0069 * Math.sin(2 * eclipticLongitudeRad)

        // Declination of the Sun
        const sinDecl = Math.sin(eclipticLongitudeRad) * Math.sin(Stuff.toRadians(23.4397))
        // cos_d = sqrt(1-sin_d**2) // exactly the same precision, but 1.5 times slower
        const cosDecl = Math.cos(Math.asin(sinDecl))

        // Hour angle
        const cosHourAngle = (Math.sin(Stuff.toRadians(-0.833 - 2.076 * Math.sqrt(elevation) / 60.0)) - Math.sin(Stuff.toRadians(latitudeDegrees)) * sinDecl) / (Math.cos(Stuff.toRadians(latitudeDegrees)) * cosDecl)
        const hourAngleRad = Math.acos(cosHourAngle)
        const hourAngleDeg = Stuff.toDegrees(hourAngleRad);  // 0...180

        const riseJulian = solarTransitJulian - hourAngleDeg / 360;
        const setJulian = solarTransitJulian + hourAngleDeg / 360;

        return {
            sunrise: Stuff.julianToEpochMillis(riseJulian),
            sunset: Stuff.julianToEpochMillis(setJulian)
        };
    }
}
export default Sun;