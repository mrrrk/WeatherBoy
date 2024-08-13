import Stuff from "@/utilities/Stuff";

module Moon {

    //
    // -- my poor attempt...
    //

    // (lunar month is average - the length actually varies depending on position in orbit)
    const lunarMonthDays = 29.53059;

    // use a start date with a known new moon and calculate using length of lunar month in days
    export const lunarAgeDays = (atDate: Date = new Date()): number => {
        //const firstNewMoon = new Date(2024, 6, 5, 22, 57, 0); // 6 = July!
        const firstNewMoon = new Date(Date.parse("2024-07-05T22:57:00"));
        //const firstNewMoon = new Date(Date.parse("2000-01-06T06:14:00"));
        const dayinMillis = 24 * 60 * 60 * 1000;
        const diffDays = (atDate.getTime() - firstNewMoon.getTime()) / dayinMillis;
        return diffDays % lunarMonthDays;
    }

    // value from 0 to 1 (new-moon -> full (0.5) -> new-moon)
    export const lunarCycleFraction = (): number => {
        return lunarAgeDays() / lunarMonthDays;
    }

    //
    // -- a more competent approach...
    //     - copied from https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
    //     - see also https://astronomy.stackexchange.com/questions/51505/calculate-moon-illumination-given-moon-age
    //

    // some serious f***ing magic going on here...
    // (Meeus' Astronomical Algorithms Second Edition, chapter 48 - apparently)
    export const phaseAngleDegrees = (jd: number): number => {

        // 2451545 = julian date as of 1/1/2000; 36525.0 = days in a century
        const T = (jd - 2451545) / 36525.0; // centuries since 1/1/2000 (huh?)
        const tSquared = T * T;
        const tCubed = tSquared * T;
        const tToTheFour = tCubed * T;

        const D = Stuff.toRadians(Stuff.constrainAngle(297.8501921 + 445267.1114034 * T - 0.0018819 * tSquared + 1.0/545868.0 * tCubed - 1.0/113065000.0 * tToTheFour)); //47.2
        const M = Stuff.toRadians(Stuff.constrainAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * tSquared + 1.0/24490000.0 * tCubed)); //47.3
        const Mp = Stuff.toRadians(Stuff.constrainAngle(134.9633964 + 477198.8675055 * T + 0.0087414 * tSquared + 1.0/69699.0 * tCubed - 1.0/14712000.0 * tToTheFour)); //47.4

        //48.4
        const iDegrees = Stuff.constrainAngle(D * 180 / Math.PI - 6.289 * Math.sin(Mp) + 2.1 * Math.sin(M) -1.274 * Math.sin(2 * D - Mp) -0.658 * Math.sin(2 * D) -0.214 * Math.sin(2 * Mp) -0.11 * Math.sin(D));

        // new moon = 0°, full moon = 180°
        return iDegrees;
    }

    // illumination from zero to one
    export const illuminatedFraction = (phaseAngleDegrees: number) => (1 + Math.cos(Stuff.toRadians(phaseAngleDegrees - 180))) / 2;

    //
    // -- moon tilt - I got this formula looking at data from https://moonphases.co.uk/
    //     - it's a pretty sketchy guess... (see moontest.vue)
    //     - also https://astronomy.stackexchange.com/questions/24711/how-does-the-moon-look-like-from-different-latitudes-of-the-earth
    //

    export const tiltDegrees = (phaseAngleDegrees: number) => 40 * (1 + (-Stuff.constrainAngle(phaseAngleDegrees) / 180));
}
export default Moon;