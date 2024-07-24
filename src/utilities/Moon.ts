module Moon {

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

    const getLunarAgePercent = (date = new Date()) => {
        return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
    }

    const normalize = (value: number) => {
        value = value - Math.floor(value);
        if (value < 0) value = value + 1;
        return value;
    }
}
export default Moon;