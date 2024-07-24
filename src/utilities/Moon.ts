module Moon {

    // from https://www.timeanddate.com/astronomy/moon/lunar-month.html
    // (is average - the length actually varies depending on position in orbit)
    const lunarMonthDays = 29.530575;

    // use a start date with a known new moon and calculate using length og lunar month in days
    export const lunarAgeDays = (): number => {
        const firstNewMoon = new Date(2024, 6, 5); // 6 = July!
        const dayinMillis = 24 * 60 * 60 * 1000;
        const diffDays = (new Date().getTime() - firstNewMoon.getTime()) / dayinMillis;
        return diffDays % lunarMonthDays;
    }

    // value from 0 to 1
    export const lunarCycleFraction = (): number => {
        return lunarAgeDays() / lunarMonthDays;
    }
}
export default Moon;