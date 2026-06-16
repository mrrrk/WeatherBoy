import Stuff from "@/utilities/Stuff";

namespace Moon {

    //
    // -- my poor attempt just used age of moon to determine angle and illumination...
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
    // -- a more competent approach
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
        const iDegrees = Stuff.constrainAngle(
            180 -
            D * 180 / Math.PI -
            6.289 * Math.sin(Mp) +
            2.1 * Math.sin(M) -
            1.274 * Math.sin(2 * D - Mp) -
            0.658 * Math.sin(2 * D) -
            0.214 * Math.sin(2 * Mp) -
            0.11 * Math.sin(D));

        // Greg's code goes:   180° (new) > 90° (qtr) > 0°   (full) > 270° (qtr) > 180° (new)
        // but I'm going with: 0°   (new) > 90° (qtr) > 180° (full) > 270° (qtr) > 0°   (new)
        // (i.e. rotating opposite direction and 180° out of phase)

        return Stuff.constrainAngle(180 - iDegrees);
    }

    // illumination from zero to one
    export const illuminatedFraction = (phaseAngleDegrees: number) => (1 + Math.cos(Stuff.toRadians(180 - phaseAngleDegrees))) / 2;

    //
    // -- moon tilt - apparent angle of the bright limb from vertical, as a canvas rotation
    //     - position angle of bright limb (Meeus Ch 48) minus parallactic angle (Ch 12/47)
    //     - the draw code puts waxing bright side at canvas-right, waning at canvas-left,
    //       so the canvas rotation formula differs by 180° between the two cases
    //     - (Claude came up with this!)

    export const tiltDegrees = (jd: number, phaseAngleDegrees: number, latitudeDegrees: number, longitudeDegrees: number): number => {
        const T  = (jd - 2451545) / 36525.0;
        const T2 = T * T;
        const T3 = T2 * T;
        const r = Stuff.toRadians;
        const d = Stuff.toDegrees;
        const n = Stuff.constrainAngle;

        // Sun's ecliptic longitude (Meeus Ch 25)
        const L0 = n(280.46646 + 36000.76983 * T + 0.0003032 * T2);
        const mSunR = r(n(357.52911 + 35999.05029 * T - 0.0001537 * T2));
        const C = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(mSunR)
                + (0.019993 - 0.000101 * T) * Math.sin(2 * mSunR)
                + 0.000289 * Math.sin(3 * mSunR);
        const lSunR = r(n(L0 + C));

        // Moon's fundamental arguments (Meeus Ch 47)
        const mMoonR  = r(n(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0));
        const dMoonR  = r(n(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0));
        const fMoonR  = r(n( 93.2720993 + 483202.0175273 * T - 0.0034029 * T2 - T3 / 3526000.0));
        const lPrimeR = r(n(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0));

        // Moon's ecliptic longitude (degrees, top 6 terms from Table 47.A)
        const lMoonR = r(n(d(lPrimeR)
            + 6.288774 * Math.sin(mMoonR)
            + 1.274027 * Math.sin(2 * dMoonR - mMoonR)
            + 0.658314 * Math.sin(2 * dMoonR)
            + 0.213618 * Math.sin(2 * mMoonR)
            - 0.185116 * Math.sin(mSunR)
            - 0.114332 * Math.sin(2 * fMoonR)));

        // Moon's ecliptic latitude (degrees, top 4 terms from Table 47.B)
        const bMoonR = r(
              5.128122 * Math.sin(fMoonR)
            + 0.280602 * Math.sin(mMoonR + fMoonR)
            + 0.277693 * Math.sin(mMoonR - fMoonR)
            + 0.173237 * Math.sin(2 * dMoonR - fMoonR));

        // Obliquity of ecliptic (Meeus Ch 22)
        const eps = r(23.439291 - 0.013004 * T);

        // Ecliptic → equatorial: Sun (ecliptic latitude ≈ 0)
        const raSun  = Math.atan2(Math.sin(lSunR) * Math.cos(eps), Math.cos(lSunR));
        const decSun = Math.asin(Math.sin(eps) * Math.sin(lSunR));

        // Ecliptic → equatorial: Moon
        const raMoon  = Math.atan2(
            Math.sin(lMoonR) * Math.cos(eps) - Math.tan(bMoonR) * Math.sin(eps),
            Math.cos(lMoonR));
        const decMoon = Math.asin(
            Math.sin(bMoonR) * Math.cos(eps) + Math.cos(bMoonR) * Math.sin(eps) * Math.sin(lMoonR));

        // Moon's hour angle at observer's location, normalised to (-180°, +180°], west-positive
        const GMST = n(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T2 - T3 / 38710000.0);
        const hDeg = (() => { const h = n(GMST + longitudeDegrees - d(raMoon)); return h > 180 ? h - 360 : h; })();
        const H = r(hDeg);

        // Position angle of bright limb: direction from Moon to Sun on the celestial sphere (Meeus 48.5)
        const chi = Math.atan2(
            Math.cos(decSun) * Math.sin(raSun - raMoon),
            Math.sin(decSun) * Math.cos(decMoon) - Math.cos(decSun) * Math.sin(decMoon) * Math.cos(raSun - raMoon));

        // Parallactic angle: angle at Moon between zenith direction and north celestial pole
        const phi = r(latitudeDegrees);
        const q = Math.atan2(Math.sin(H), Math.tan(phi) * Math.cos(decMoon) - Math.sin(decMoon) * Math.cos(H));

        // (chi - q) is the bright limb direction from zenith, degrees clockwise from "up":
        //   0° = zenith, 90° = east, 180° = nadir, 270° = west
        // canvas-clock 0° = 12 o'clock, so canvas-clock = 360° - brightLimbAngle
        // rotation = target canvas-clock - original canvas-clock:
        //   waxing bright side drawn at 3 o'clock (canvas-clock 90°)  → 270 - brightLimbAngle
        //   waning bright side drawn at 9 o'clock (canvas-clock 270°) →  90 - brightLimbAngle
        const brightLimbAngle = d(chi - q);
        const isWaxing = n(phaseAngleDegrees) <= 180;
        return isWaxing ? 270 - brightLimbAngle : 90 - brightLimbAngle;
    }
}
export default Moon;
