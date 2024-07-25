module Moon {

    // from https://www.timeanddate.com/astronomy/moon/lunar-month.html
    // (is average - the length actually varies depending on position in orbit)
    const lunarMonthDays = 29.530575;

    // use a start date with a known new moon and calculate using length of lunar month in days
    export const lunarAgeDays = (): number => {
        const firstNewMoon = new Date(2024, 6, 5); // 6 = July!
        const dayinMillis = 24 * 60 * 60 * 1000;
        const diffDays = (new Date().getTime() - firstNewMoon.getTime()) / dayinMillis;
        return diffDays % lunarMonthDays;
    }

    // value from 0 to 1 (new-moon -> full (0.5) -> new-moon)
    export const lunarCycleFraction = (): number => {
        return lunarAgeDays() / lunarMonthDays;
    }

    export const illuminationPercent = (): number => {
        const jd = julianDateFromUnixTime(new Date().getTime());

        console.log("+++ JD = ", jd);
        console.log("+++ 2date = ", new Date(unixTimeFromJulianDate(jd)));

        return Math.round(getIlluminatedFractionOfMoon(jd) * 100);
    }

    // copied from https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
    // see also https://astronomy.stackexchange.com/questions/51505/calculate-moon-illumination-given-moon-age

    // Julian date = number of days since January 1, 4713 BC (!!?)
    const julianDateFromUnixTime = (t: number): number => (t / 86400000) + 2440587.5;

    const unixTimeFromJulianDate = (jd: number) => (jd - 2440587.5) * 86400000;

    const constrain = (d: number) => {
        let t = d % 360;
        if (t < 0) t += 360;
        return t;
    }

    // some serious f***ing magic going on here...
    const  getIlluminatedFractionOfMoon = (jd: number): number => {
        const toRad=Math.PI / 180.0;
        // 2451545 = julian date as of 1/1/2000; 36525.0 = days in a century
        const T = (jd - 2451545) / 36525.0; // centuries since 1/1/2000 (huh?)
        const tSquared = T * T;
        const tCubed = tSquared * T;
        const tToTheFour = tCubed * T;

        const D = constrain(297.8501921 + 445267.1114034 * T - 0.0018819 * tSquared + 1.0/545868.0 * tCubed - 1.0/113065000.0 * tToTheFour) * toRad; //47.2
        const M = constrain(357.5291092 + 35999.0502909 * T - 0.0001536 * tSquared + 1.0/24490000.0 * tCubed) * toRad; //47.3
        const Mp = constrain(134.9633964 + 477198.8675055 * T + 0.0087414 * tSquared + 1.0/69699.0 * tCubed - 1.0/14712000.0 * tToTheFour) * toRad; //47.4

        //48.4
        const i=constrain(180 - D*180/Math.PI - 6.289 * Math.sin(Mp) + 2.1 * Math.sin(M) -1.274 * Math.sin(2*D - Mp) -0.658 * Math.sin(2*D) -0.214 * Math.sin(2*Mp) -0.11 * Math.sin(D))*toRad;

        const k=(1+Math.cos(i))/2;
        return k;
    }


}
export default Moon;