module Moon {

    const lunarMonthDays = 29.530588853;

    export const lunarAgeDays = (): number => {
        const firstNewMoon = new Date(2024, 6, 5); // 6 = July!
        const dayinMillis = 24 * 60 * 60 * 1000;
        const diffDays = (new Date().getTime() - firstNewMoon.getTime()) / dayinMillis;
        return diffDays % lunarMonthDays;
    }

    export const lunarFraction = (): number => {
        return lunarAgeDays() / lunarMonthDays;
    }

    const getJulianDate = (date = new Date()): number => {
        const time = date.getTime();
        const offset = date.getTimezoneOffset()
        return (time / 86400000) - (offset / 1440) + 2440587.5;
    }

    const LUNAR_MONTH = 29.530588853;

    const getLunarAge = (date = new Date()) => {
        const percent = getLunarAgePercent(date);
        const age = percent * LUNAR_MONTH;
        return age;
    }

    export const getLunarAgePercent = (date = new Date()): number => {
        return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
    }

    const normalize = (value: number): number => {
        value = value - Math.floor(value);
        if (value < 0) value = value + 1;
        return value;
    }
}
export default Moon;